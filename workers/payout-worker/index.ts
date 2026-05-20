import mongoose from 'mongoose';
import { WalletJournal } from '../../services/wallet-engine/logic';

/**
 * Payout Worker - Sovereign state sweep for negative balance prevention
 */
export const initPayoutWorker = () => {
    console.log('Payout Worker Init - Sweeping pending transactions');
    
    // Simulate a periodic sweep
    setInterval(async () => {
        // Skip query if mongoose is not fully connected (readyState 1)
        if (mongoose.connection?.readyState !== 1) {
            return;
        }
        try {
            const pendingHolds = await (WalletJournal as any).find({ status: 'PENDING', type: 'HOLD' }).lean();
            for (const hold of (pendingHolds as any[])) {
                // Perform fraud checks, then SETTLE or REVERSE
                console.log(`[PayoutWorker] Processing Hold: ${hold.transactionId}`);
                // hold.status = 'COMPLETED';
                // await hold.save();
            }
        } catch (err) {
            console.error("Payout Worker Sweep Error:", err);
        }
    }, 60000); // Every minute
};
