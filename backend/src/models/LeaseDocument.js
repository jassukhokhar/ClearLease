import mongoose from 'mongoose';

/**
 * A single flagged clause produced by the AI analysis.
 */
const analysisResultSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true },
    translation: { type: String, required: true },
    riskLevel: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'LOW',
    },
    pageNumber: { type: Number, default: 1 },
    recommendation: { type: String, default: '' },
  },
  { _id: false }
);

const leaseDocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalFileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    extractedText: { type: String, default: '' },
    overallRiskScore: { type: Number, default: 0 }, // normalized 0-100
    riskLabel: {
      type: String,
      enum: ['SAFE', 'MODERATE RISK', 'HIGH RISK'],
      default: 'SAFE',
    },
    totalFlags: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now },
    lastExportedAt: { type: Date, default: null },
    analysisResults: { type: [analysisResultSchema], default: [] },
  },
  { timestamps: true }
);

const LeaseDocument = mongoose.model('LeaseDocument', leaseDocumentSchema);

export default LeaseDocument;
