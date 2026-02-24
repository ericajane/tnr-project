/**
 * Shared TypeScript types.
 * Add domain types here as the NestJS API contracts are defined.
 */

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
