import { db } from '../db/index.ts';
import { blockchain_blocks } from '../db/schema.ts';
import { desc, eq } from 'drizzle-orm';
import crypto from 'crypto';

export class BlockchainService {
  private static calculateHash(data: any) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  static async getBlocks() {
    try {
      const blocks = await db.select().from(blockchain_blocks).orderBy(blockchain_blocks.blockIndex);
      if (blocks.length > 0) {
        return blocks.map(b => ({
          index: b.blockIndex,
          timestamp: b.timestamp ? new Date(b.timestamp).getTime() : Date.now(),
          data: b.data,
          previousHash: b.previousHash,
          hash: b.hash,
        }));
      }
    } catch (err) {
      console.warn('DB read warning in BlockchainService.getBlocks:', err);
    }
    // Return genesis block if table is empty
    return [
      {
        index: 0,
        timestamp: 1714550000000,
        data: {
          message: "Genesis Block",
          hcs_topic_id: "0.0.4592011",
          protocol: "Hedera Open Source Blockchain Interface"
        },
        previousHash: "0",
        hash: "a192e1424adc1dc71ecfdfe4cc43c15f040f4f8f0c337d2415bd137ff0f3249a"
      }
    ];
  }

  static async appendBlock(data: any) {
    const blocks = await this.getBlocks();
    const lastBlock = blocks[blocks.length - 1];
    const newIndex = lastBlock ? lastBlock.index + 1 : 0;
    const previousHash = lastBlock ? lastBlock.hash : "0";
    const timestamp = Date.now();

    const blockContent = {
      index: newIndex,
      timestamp,
      data,
      previousHash,
    };
    const hash = this.calculateHash(blockContent);

    const blockRecord = {
      id: `blk_${newIndex}_${Date.now()}`,
      blockIndex: newIndex,
      previousHash,
      hash,
      data,
      timestamp: new Date(timestamp),
    };

    try {
      await db.insert(blockchain_blocks).values(blockRecord).onConflictDoNothing();
    } catch (err) {
      console.warn('DB write warning in BlockchainService.appendBlock:', err);
    }

    return {
      index: newIndex,
      timestamp,
      data,
      previousHash,
      hash,
    };
  }
}
