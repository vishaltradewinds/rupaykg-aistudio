import mongoose from 'mongoose';

/**
 * Wallet Journal Schema
 * Record-only structure. Transactions are NEVER modified.
 */
const walletJournalSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  transactionId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['CREDIT', 'DEBIT', 'HOLD', 'REVERSAL', 'SETTLED'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' }, // Or CCC
  metadata: {
    eventId: String, // e.g., wasteCollectionId
    category: String, // e.g., carbon_payout, service_fee
    proofHash: String // Hedera HCS Transaction ID
  },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'COMPLETED' },
  createdAt: { type: Date, default: Date.now }
});

export const WalletJournal = mongoose.models.WalletJournal || mongoose.model('WalletJournal', walletJournalSchema);

interface IUser extends mongoose.Document {
  id: string;
  wallet_balance: number;
}

export class WalletEngine {
  /**
   * Atomic Credit/Debit logic using Mongo Transactions
   */
  static async transact(userId: string, amount: number, type: 'CREDIT' | 'DEBIT', metadata: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // 1. Create Journal Entry
      const journalEntry = new WalletJournal({
        userId,
        transactionId: crypto.randomUUID(),
        type,
        amount,
        metadata
      });
      await journalEntry.save({ session });

      // 2. Update Aggregated Balance (Caching for performance, though source of truth is Journal)
      const User = mongoose.model<IUser>('User');
      const user = await User.findOne({ id: userId }).session(session);
      
      if (!user) throw new Error("User not found");
      
      const newBalance = type === 'CREDIT' ? user.wallet_balance + amount : user.wallet_balance - amount;
      
      if (newBalance < 0) throw new Error("Negative balance protection triggered");

      user.wallet_balance = newBalance;
      await user.save({ session });

      await session.commitTransaction();
      return { status: 'SUCCESS', journalId: journalEntry.transactionId, newBalance };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Reconstruct balance from journal (Audit reconciliation)
   */
  static async auditBalance(userId: string) {
    const records = await (WalletJournal as any).find({ userId }).lean();
    return (records as any[]).reduce((acc: number, rec: any) => {
      return (rec as any).type === 'CREDIT' ? acc + (rec as any).amount : acc - (rec as any).amount;
    }, 0);
  }
}
