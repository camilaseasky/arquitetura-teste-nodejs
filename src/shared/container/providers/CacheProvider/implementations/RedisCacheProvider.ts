import Redis, { Redis as redisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: redisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parseData = JSON.parse(data) as T;

    return parseData;
  }

  public async invalidade(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidadePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    // monta o pipeline
    keys.forEach(key => {
      pipeline.del(key);
    });

    // executa o pipeline de uma vez
    await pipeline.exec();
  }
}
