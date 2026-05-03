import { User } from "./user_model";

export interface Project {
  id?: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName?: string;
  ownerId: number;
  startDate: string;
  endDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | string;
  createdAt?: string;
  updatedAt?: string;members?: User[];
  assignedAt?: string;
}
