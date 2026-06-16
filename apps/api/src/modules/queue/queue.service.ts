import { Injectable, Logger } from '@nestjs/common';

export interface QueueJob {
  id: string;
  type: string;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
}

export type JobHandler = (data: any) => Promise<any>;

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private queues = new Map<string, QueueJob[]>();
  private handlers = new Map<string, JobHandler>();
  private processing = new Map<string, boolean>();

  createJob(type: string, data: any): string {
    const jobId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job: QueueJob = {
      id: jobId,
      type,
      data,
      status: 'pending',
      createdAt: new Date(),
    };

    if (!this.queues.has(type)) {
      this.queues.set(type, []);
    }
    this.queues.get(type)!.push(job);

    this.logger.log(`Job ${jobId} created for queue: ${type}`);
    this.processQueue(type);

    return jobId;
  }

  registerHandler(type: string, handler: JobHandler) {
    this.handlers.set(type, handler);
    this.logger.log(`Handler registered for queue: ${type}`);
  }

  private async processQueue(type: string) {
    if (this.processing.get(type)) {
      return;
    }

    const handler = this.handlers.get(type);
    if (!handler) {
      return;
    }

    this.processing.set(type, true);

    const queue = this.queues.get(type) || [];
    const pendingJobs = queue.filter((job) => job.status === 'pending');

    for (const job of pendingJobs) {
      try {
        job.status = 'processing';
        job.processedAt = new Date();

        const result = await handler(job.data);

        job.status = 'completed';
        job.result = result;
        job.completedAt = new Date();

        this.logger.log(`Job ${job.id} completed`);
      } catch (error) {
        job.status = 'failed';
        job.error = error instanceof Error ? error.message : String(error);
        this.logger.error(`Job ${job.id} failed: ${job.error}`);
      }
    }

    this.processing.set(type, false);
  }

  getJob(jobId: string): QueueJob | undefined {
    for (const queue of this.queues.values()) {
      const job = queue.find((j) => j.id === jobId);
      if (job) return job;
    }
    return undefined;
  }

  getQueueStatus(type: string) {
    const queue = this.queues.get(type) || [];
    return {
      total: queue.length,
      pending: queue.filter((j) => j.status === 'pending').length,
      processing: queue.filter((j) => j.status === 'processing').length,
      completed: queue.filter((j) => j.status === 'completed').length,
      failed: queue.filter((j) => j.status === 'failed').length,
    };
  }

  getAllQueuesStatus() {
    const statuses: Record<string, any> = {};
    for (const [type] of this.queues) {
      statuses[type] = this.getQueueStatus(type);
    }
    return statuses;
  }

  retryJob(jobId: string): boolean {
    for (const queue of this.queues.values()) {
      const job = queue.find((j) => j.id === jobId);
      if (job && job.status === 'failed') {
        job.status = 'pending';
        job.error = undefined;
        job.processedAt = undefined;
        job.completedAt = undefined;

        this.processQueue(job.type);
        return true;
      }
    }
    return false;
  }

  clearCompleted(type: string) {
    const queue = this.queues.get(type);
    if (queue) {
      const cleared = queue.filter((j) => j.status !== 'completed');
      this.queues.set(type, cleared);
    }
  }
}
