import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

export const generatePdfReport = async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const groupCount = await prisma.studyGroup.count();
    const resourceCount = await prisma.resource.count();
    const lostFoundCount = await prisma.lostAndFound.count();

    const groups = await prisma.studyGroup.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { creator: { select: { displayName: true } } }
    });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="UniConnect_Summary_Report.pdf"');

    doc.pipe(res);

    // Title Section
    doc.fontSize(22).fillColor('#1E293B').text('UniConnect — Platform Summary Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#64748B').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1.5);

    // Executive Overview Box
    doc.rect(40, doc.y, 530, 80).fillAndStroke('#F8FAFC', '#E2E8F0');
    doc.fillColor('#0F172A').fontSize(14).text('Platform Metrics Overview', 55, doc.y - 70);
    doc.fontSize(11).fillColor('#334155');
    doc.text(`Total Registered Students: ${userCount}`, 55, doc.y + 5);
    doc.text(`Active Study Groups: ${groupCount}`, 220, doc.y - 13);
    doc.text(`Shared Resources: ${resourceCount}`, 380, doc.y - 13);
    doc.text(`Lost & Found Items: ${lostFoundCount}`, 55, doc.y + 10);
    doc.moveDown(3);

    // Study Groups Highlights
    doc.fontSize(14).fillColor('#1E293B').text('Recent Active Study Groups', { underline: true });
    doc.moveDown(0.5);

    if (groups.length === 0) {
      doc.fontSize(11).fillColor('#64748B').text('No study groups available yet.');
    } else {
      groups.forEach((g, idx) => {
        doc.fontSize(11).fillColor('#0F172A').text(`${idx + 1}. ${g.name} (${g.courseCode})`);
        doc.fontSize(9).fillColor('#475569').text(`   Created by: ${g.creator.displayName} | Capacity: ${g.capacity}`);
        doc.moveDown(0.3);
      });
    }

    doc.moveDown(2);
    doc.fontSize(9).fillColor('#94A3B8').text('Report compiled automatically by UniConnect Analytics Service.', { align: 'center' });

    doc.end();
  } catch (err) {
    console.error('PDF Report error:', err);
    return res.status(500).json({ error: 'Failed to generate PDF summary report' });
  }
};
