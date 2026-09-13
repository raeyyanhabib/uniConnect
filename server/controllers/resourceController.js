import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createResourceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  category: z.enum(['book', 'equipment', 'notes', 'other']).default('book')
});

export const getResources = async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = {};

    if (category) {
      where.category = String(category);
    }

    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } }
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        owner: { select: { id: true, displayName: true, email: true } },
        transactions: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ resources });
  } catch (err) {
    console.error('getResources error:', err);
    return res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

export const createResource = async (req, res) => {
  try {
    const parseResult = createResourceSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors
      });
    }

    const { title, description, category } = parseResult.data;

    const resource = await prisma.resource.create({
      data: {
        title,
        description: description || '',
        category,
        ownerId: req.user.id
      },
      include: {
        owner: { select: { id: true, displayName: true } }
      }
    });

    return res.status(201).json({ message: 'Resource listed successfully', resource });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create resource listing' });
  }
};

export const requestBorrow = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({ where: { id } });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.ownerId === req.user.id) {
      return res.status(400).json({ error: 'Cannot borrow your own resource' });
    }

    if (resource.status !== 'available') {
      return res.status(400).json({ error: 'Resource is currently not available' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        resourceId: id,
        ownerId: resource.ownerId,
        borrowerId: req.user.id,
        status: 'pending_approval'
      }
    });

    return res.status(201).json({ message: 'Borrow request submitted', transaction });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to request resource borrow' });
  }
};
