export interface Note {
  id: number;
  projectId: number;
  userId: number; 
  userEmail: string; 
  userName: string; 
  content: string;
  createdAt: string;
  updatedAt?: string;
}
