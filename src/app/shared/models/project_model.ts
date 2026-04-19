import { User } from "./user_model";

export interface Project {
  id: number; // [cite: 274, 286]
  name: string; // [cite: 274, 279]
  description: string; // [cite: 274, 279]
  categoryId: number; // [cite: 274, 279]
  categoryName?: string; // Returned in getById [cite: 295]
  ownerId: number; // [cite: 274, 286]
  startDate: string; // [cite: 274, 279]
  endDate: string; // [cite: 274, 279]
  status: 'IN_PROGRESS' | 'COMPLETED' | string; // [cite: 274, 279]
  createdAt?: string; // [cite: 274, 286]
  updatedAt?: string; // [cite: 279]
  members?: User[]; // Returned in full details [cite: 295]
  assignedAt?: string; // Specific to assigned user view [cite: 299]
}
