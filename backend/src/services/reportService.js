import PDFDocument from 'pdfkit';

// Brand-aligned palette (matches the frontend design system).
const COLORS = {
  brand: '#4f46e5',
  slate900: '#0f172a',
  slate600: '#475569',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  rose: '#e11d48',
  amber: '#f59e0b',
  emerald: '#10b981',
};

const levelColor = (level) =>
  level === 'HIGH' ? COLORS.rose : level === 'MEDIUM' ? COLORS.amber : COLORS.emerald;

const scoreColor = (score) =>
  score >= 60 ? COLORS.rose : score >= 25 ? COLORS.amber : COLORS.emerald;

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

/**
 * Final plain-English verdict derived from the score band.
 */
const verdict = (lease) => {
  const s = lease.overallRiskScore;
  if (s >= 60)
    return 'High risk — proceed with caution and negotiate the flagged clauses before signing.';
  if (s >= 25)
    return 'Moderate risk — negotiate the key clauses below before you commit.';
  return 'Relatively safe lease — still read carefully and confirm the details.';
};

const sectionTitle = (doc, text) => {
  doc.moveDown(1);
  doc
    .fontSize(14)
    .fillColor(COLORS.slate900)
    .font('Helvetica-Bold')
    .text(text);
  doc
    .moveTo(doc.x, doc.y + 2)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y + 2)
    .strokeColor(COLORS.slate200)
    .stroke();
  doc.moveDown(0.6);
};

const clauseBlock = (doc, clause, idx) => {
  const color = levelColor((clause.riskLevel || 'LOW').toUpperCase());

  // Keep a block roughly together near the page bottom.
  if (doc.y > doc.page.height - 160) doc.addPage();

  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor(color)
    .text(`${idx}. ${(clause.riskLevel || 'LOW').toUpperCase()} RISK`, {
      continued: true,
    })
    .fillColor(COLORS.slate400)
    .font('Helvetica')
    .text(`   ·   Page ${clause.pageNumber || 1}`);

  doc
    .moveDown(0.2)
    .fontSize(10)
    .font('Helvetica-Oblique')
    .fillColor(COLORS.slate600)
    .text(`"${clause.quote}"`);

  doc
    .moveDown(0.2)
    .font('Helvetica')
    .fillColor(COLORS.slate900)
    .text(clause.translation);

  if (clause.recommendation) {
    doc
      .moveDown(0.2)
      .font('Helvetica-Bold')
      .fillColor(COLORS.brand)
      .text('Recommendation: ', { continued: true })
      .font('Helvetica')
      .fillColor(COLORS.slate600)
      .text(clause.recommendation);
  }
  doc.moveDown(0.6);
};

/**
 * Build the professional tenant report into a PDFKit document and return it.
 * The caller pipes the returned doc to the response and calls doc.end().
 *
 * @param {object} lease - LeaseDocument (with analysisResults)
 * @returns {PDFDocument}
 */
export const buildLeaseReport = (lease) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  const results = lease.analysisResults || [];
  const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const r of results) {
    const lvl = (r.riskLevel || 'LOW').toUpperCase();
    counts[lvl] = (counts[lvl] || 0) + 1;
  }

  doc
    .fillColor(COLORS.brand)
    .fontSize(26)
    .font('Helvetica-Bold')
    .text('ClearLease', { align: 'left' });
  doc
    .fillColor(COLORS.slate400)
    .fontSize(11)
    .font('Helvetica')
    .text('Lease Risk Report');

  doc.moveDown(2);
  doc
    .fillColor(COLORS.slate900)
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(lease.originalFileName);
  doc
    .fillColor(COLORS.slate400)
    .fontSize(10)
    .font('Helvetica')
    .text(`Analyzed ${formatDate(lease.uploadDate || lease.createdAt)}`);

  doc.moveDown(1.5);

  // Score badge block
  const score = lease.overallRiskScore;
  doc
    .fontSize(48)
    .font('Helvetica-Bold')
    .fillColor(scoreColor(score))
    .text(`${score}`, { continued: true })
    .fontSize(16)
    .fillColor(COLORS.slate400)
    .text(' / 100');
  doc
    .fontSize(13)
    .font('Helvetica-Bold')
    .fillColor(scoreColor(score))
    .text(lease.riskLabel);
  doc
    .moveDown(0.3)
    .fontSize(10)
    .font('Helvetica')
    .fillColor(COLORS.slate600)
    .text(
      `${lease.totalFlags} flagged clause${lease.totalFlags === 1 ? '' : 's'} · ` +
        `${counts.HIGH} high · ${counts.MEDIUM} medium · ${counts.LOW} low`
    );

  sectionTitle(doc, 'Executive Summary');
  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor(COLORS.slate600)
    .text(
      `This report summarizes the AI risk analysis of "${lease.originalFileName}". ` +
        `The lease scored ${score}/100 (${lease.riskLabel}) based on ${lease.totalFlags} flagged clause(s). ` +
        `The sections below break down each issue by severity, with plain-English explanations and negotiation guidance.`
    );

  sectionTitle(doc, 'Risk Breakdown');
  doc.fontSize(10).font('Helvetica');
  [
    ['HIGH', counts.HIGH],
    ['MEDIUM', counts.MEDIUM],
    ['LOW', counts.LOW],
  ].forEach(([lvl, n]) => {
    doc
      .fillColor(levelColor(lvl))
      .font('Helvetica-Bold')
      .text(`${lvl}: `, { continued: true })
      .fillColor(COLORS.slate600)
      .font('Helvetica')
      .text(`${n} clause${n === 1 ? '' : 's'}`);
  });

  const byLevel = (lvl) =>
    results.filter((r) => (r.riskLevel || 'LOW').toUpperCase() === lvl);

  const renderGroup = (title, lvl) => {
    const group = byLevel(lvl);
    if (!group.length) return;
    sectionTitle(doc, title);
    group.forEach((c, i) => clauseBlock(doc, c, i + 1));
  };

  renderGroup('High Risk Clauses', 'HIGH');
  renderGroup('Medium Risk Clauses', 'MEDIUM');
  renderGroup('Low Risk Clauses', 'LOW');

  if (!results.length) {
    sectionTitle(doc, 'Flagged Clauses');
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor(COLORS.slate600)
      .text('No risky clauses were detected. Always read the full lease carefully.');
  }

  const withRecs = results.filter((r) => r.recommendation);
  if (withRecs.length) {
    sectionTitle(doc, 'Negotiation Recommendations');
    withRecs.forEach((c, i) => {
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor(levelColor((c.riskLevel || 'LOW').toUpperCase()))
        .text(`${i + 1}. `, { continued: true })
        .fillColor(COLORS.slate600)
        .font('Helvetica')
        .text(c.recommendation);
      doc.moveDown(0.3);
    });
  }

  sectionTitle(doc, 'Final Verdict');
  doc
    .fontSize(11)
    .font('Helvetica-Bold')
    .fillColor(scoreColor(score))
    .text(verdict(lease));

  doc.moveDown(2);
  doc
    .fontSize(8)
    .font('Helvetica-Oblique')
    .fillColor(COLORS.slate400)
    .text(
      'ClearLease provides informational analysis, not legal advice. For binding legal decisions, consult a licensed attorney.',
      { align: 'center' }
    );

  return doc;
};
