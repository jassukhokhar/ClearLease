import mongoose from 'mongoose';

/**
 * A saved side-by-side comparison of two analyzed leases. `summary` holds the
 * structured Gemini result (dimensions, winner, safer/most-expensive/highest-risk
 * and a plain-English verdict).
 */
const comparisonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    leaseA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaseDocument',
      required: true,
    },
    leaseB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaseDocument',
      required: true,
    },
    summary: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Comparison = mongoose.model('Comparison', comparisonSchema);

export default Comparison;
