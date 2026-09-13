import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding UniConnect database...');

  // Clean existing data
  await prisma.transaction.deleteMany();
  await prisma.groupAnnouncement.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.studyGroup.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.lostAndFound.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Demo Users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@nu.edu.pk',
      passwordHash,
      displayName: 'Alice Smith',
      department: 'Computer Science',
      semester: '6th',
      role: 'student'
    }
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@nu.edu.pk',
      passwordHash,
      displayName: 'Bob Johnson',
      department: 'Software Engineering',
      semester: '4th',
      role: 'student'
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@nu.edu.pk',
      passwordHash,
      displayName: 'Campus Admin',
      department: 'Administration',
      semester: 'Faculty',
      role: 'admin'
    }
  });

  // Demo Study Groups
  const group1 = await prisma.studyGroup.create({
    data: {
      name: 'Algorithm Design & Analysis Squad',
      courseCode: 'CS3001',
      description: 'Weekly problem-solving sessions on dynamic programming and graph algorithms.',
      capacity: 8,
      visibility: 'public',
      creatorId: alice.id,
      members: {
        create: [
          { userId: alice.id, role: 'creator' },
          { userId: bob.id, role: 'member' }
        ]
      },
      announcements: {
        create: [
          { authorId: alice.id, content: 'Next meeting this Thursday at 4 PM in Library Study Room 3.' }
        ]
      }
    }
  });

  const group2 = await prisma.studyGroup.create({
    data: {
      name: 'Database Systems Group',
      courseCode: 'CS2004',
      description: 'Preparing for midterm exam, focusing on SQL queries and normalization.',
      capacity: 10,
      visibility: 'public',
      creatorId: bob.id,
      members: {
        create: [
          { userId: bob.id, role: 'creator' }
        ]
      }
    }
  });

  // Demo Resources
  await prisma.resource.create({
    data: {
      title: 'Introduction to Algorithms (CLRS 4th Edition)',
      description: 'Hardcover copy in excellent condition available for 2-week borrow.',
      category: 'book',
      status: 'available',
      ownerId: alice.id
    }
  });

  await prisma.resource.create({
    data: {
      title: 'TI-84 Plus CE Graphing Calculator',
      description: 'Full battery, comes with charging cable.',
      category: 'equipment',
      status: 'available',
      ownerId: bob.id
    }
  });

  // Demo Lost and Found
  await prisma.lostAndFound.create({
    data: {
      reporterId: alice.id,
      itemName: 'Black HP Laptop Charger',
      description: 'Found near CS Auditorium lab on bench.',
      location: 'CS Auditorium',
      status: 'found'
    }
  });

  console.log('Database seeded successfully!');
  console.log('Demo Credentials:');
  console.log(' - Student: alice@nu.edu.pk / Password123!');
  console.log(' - Student: bob@nu.edu.pk / Password123!');
  console.log(' - Admin: admin@nu.edu.pk / Password123!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
