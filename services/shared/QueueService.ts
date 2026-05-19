import amqp from 'amqplib';

export class QueueService {
  private static connection: any = null;
  private static channel: any = null;
  private static QUEUE_NAME = 'rupaykg_events';

  static async init() {
    if (process.env.RABBITMQ_URL) {
      try {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.QUEUE_NAME, { durable: true });
        console.log("[QUEUE] RabbitMQ Initialized");
        
        // Start consuming
        this.startWorker();
      } catch (err) {
        console.error("[QUEUE] RabbitMQ Connection Failed", err);
      }
    } else {
      console.log("[QUEUE] No RABBITMQ_URL. Async tasks will be processed in-process.");
    }
  }

  static async publish(data: any) {
    if (this.channel) {
      this.channel.sendToQueue(this.QUEUE_NAME, Buffer.from(JSON.stringify(data)), { persistent: true });
    } else {
      // Logic for in-process fallback
      setTimeout(() => this.processTask(data), 100);
    }
  }

  private static async startWorker() {
    if (!this.channel) return;
    this.channel.consume(this.QUEUE_NAME, async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        try {
          await this.processTask(data);
          this.channel?.ack(msg);
        } catch (err) {
          console.error("[QUEUE] Task processing failed", err);
          // Simple retry logic (nack with requeue)
          setTimeout(() => this.channel?.nack(msg, false, true), 1000);
        }
      }
    });
  }

  private static async processTask(data: any) {
    console.log(`[WORKER] Processing task: ${data.action} for resource ${data.resource_id}`);
    
    switch (data.action) {
      case 'PROCESS_IMAGE':
        // Simulated intensive AI image processing
        await new Promise(r => setTimeout(r, 2000));
        break;
      case 'GENERATE_REPORT_SNAPSHOT':
        await new Promise(r => setTimeout(r, 1000));
        break;
      case 'NOTIFY_USER':
        // Push notification logic
        break;
      default:
        console.log(`[WORKER] Unknown action: ${data.action}`);
    }
  }
}
