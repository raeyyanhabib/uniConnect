import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createGroupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters'),
  courseCode: z.string().min(2, 'Course code is required'),
  description: z.string().optional(),
  capacity: z.number().int().min(2).max(100).default(10),
  visibility: z.enum(['public', 'private']).default('public')
});

export const getGroups = async (req, res) => {
  try {
    const { query, courseCode } = req.query;

    const where = {};
    if (query) {
      where.OR = [
        { name: { contains: String(query) } },
        { description: { contains: String(query) } }
      ];
    }
    if (courseCode) {
      where.courseCode = { contains: String(courseCode) };
    }

    const groups = await prisma.studyGroup.findMany({
      where,
      include: {
        creator: {
          select: { id: true, displayName: true, email: true }
        },
        members: {
          include: {
            user: { select: { id: true, displayName: true } }
          }
        },
        announcements: {
          take: 3,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ groups });
  } catch (err) {
    console.error('getGroups error:', err);
    return res.status(500).json({ error: 'Failed to fetch study groups' });
  }
};

export const createGroup = async (req, res) => {
  try {
    const parseResult = createGroupSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors
      });
    }

    const { name, courseCode, description, capacity, visibility } = parseResult.data;

    const group = await prisma.studyGroup.create({
      data: {
        name,
        courseCode,
        description: description || '',
        capacity,
        visibility,
        creatorId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'creator'
          }
        }
      },
      include: {
        creator: { select: { id: true, displayName: true } },
        members: true
      }
    });

    return res.status(201).json({ message: 'Study group created', group });
  } catch (err) {
    console.error('createGroup error:', err);
    return res.status(500).json({ error: 'Failed to create study group' });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await prisma.studyGroup.findUnique({
      where: { id },
      include: { members: true }
    });

    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    if (group.members.length >= group.capacity) {
      return res.status(400).json({ error: 'Study group is at full capacity' });
    }

    const existingMember = group.members.find(m => m.userId === req.user.id);
    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this study group' });
    }

    const membership = await prisma.groupMember.create({
      data: {
        groupId: id,
        userId: req.user.id,
        role: 'member'
      }
    });

    return res.status(200).json({ message: 'Joined study group successfully', membership });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to join study group' });
  }
};

export const addAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Announcement content is required' });
    }

    const membership = await prisma.groupMember.findFirst({
      where: { groupId: id, userId: req.user.id }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Must be a group member to post announcements' });
    }

    const announcement = await prisma.groupAnnouncement.create({
      data: {
        groupId: id,
        authorId: req.user.id,
        content: content.trim()
      },
      include: {
        author: { select: { displayName: true } }
      }
    });

    return res.status(201).json({ message: 'Announcement posted', announcement });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to post announcement' });
  }
};
