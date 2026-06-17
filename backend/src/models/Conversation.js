import mongoose from 'mongoose';

/**
 * A single chat message in a lease conversation.
 */
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

/**
 * One conversation per (user, lease). Holds the full message thread so the
 * AI Lease Assistant has memory across questions about the same lease.
 */
const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaseDocument',
      required: true,
      index: true,
    },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

// A user has at most one conversation per lease.
conversationSchema.index({ user: 1, lease: 1 }, { unique: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
