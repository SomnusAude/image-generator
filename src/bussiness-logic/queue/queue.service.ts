import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import Redis from 'ioredis'
import { Image } from 'src/entities/image'

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
    private redis: Redis
    private readonly queueName = 'image-generation-queue'

    onModuleInit() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        })
    }

    onModuleDestroy() {
        if (this.redis) {
            this.redis.disconnect()
        }
    }

    async enqueue(task: Image.BaseType): Promise<void> {
        await this.redis.rpush(this.queueName, JSON.stringify(task))
        console.log('Task was pushed into queue')
    }

    async dequeue(timeout = 0): Promise<Image.BaseType | null> {
        const result = await this.redis.blpop(this.queueName, timeout)
        if (result && result[1]) {
            return JSON.parse(result[1])
        }
        return null
    }

    async getQueueLength(): Promise<number> {
        return await this.redis.llen(this.queueName)
    }
}
