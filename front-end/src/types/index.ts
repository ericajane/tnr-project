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

export interface Cat {
  id: string;
  name?: string;
  colonyId: string;
  status: 'trapped' | 'neutered' | 'returned' | 'deceased';
  trapDate?: string;
  neuterDate?: string;
  sex: 'male' | 'female' | 'unknown';
  color?: string;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  streetNumberAndName?: string;
  city?: string;
  zip?: string;
}

export interface Caretaker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
  notes: Note[];
  colonyIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
  role?: string;
  active: boolean;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface Colony {
  id: string;
  name: string;
  location?: string;
  lat?: number;
  lng?: number;
  caretakerId?: string;
  caretaker?: Caretaker;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}
