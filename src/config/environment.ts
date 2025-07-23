import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Environment variables schema validation
 */
const environmentSchema = z.object({
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
});

/**
 * Environment configuration class
 */
export class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private readonly config: z.infer<typeof environmentSchema>;

  private constructor() {
    this.config = environmentSchema.parse(process.env);
  }

  /**
   * Get singleton instance of EnvironmentConfig
   */
  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  /**
   * Get port number
   */
  public getPort(): number {
    return this.config.PORT;
  }

  /**
   * Get node environment
   */
  public getNodeEnv(): string {
    return this.config.NODE_ENV;
  }

  /**
   * Get API prefix
   */
  public getApiPrefix(): string {
    return this.config.API_PREFIX;
  }

  /**
   * Check if environment is development
   */
  public isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  /**
   * Check if environment is production
   */
  public isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  /**
   * Check if environment is test
   */
  public isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }
}

// Export singleton instance
export const environmentConfig = EnvironmentConfig.getInstance(); 