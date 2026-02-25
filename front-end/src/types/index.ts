/**
 * Shared TypeScript types.
 * Add domain types here as the NestJS API contracts are defined.
 */

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface Note {
  note: string;
  createdAt: string;
  author: string;
}

export interface Colony {
  id: string;
  name: string;
  location?: string;
  lat?: number;
  lng?: number;
  caretakerId?: string;
  caretakerName?: string;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}
