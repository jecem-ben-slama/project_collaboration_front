export interface Note {
  id: number;
  projectId: number;
  userId: number; // Matches Postman
  userEmail: string; // Matches Postman
  userName: string; // Matches Postman
  content: string;
  createdAt: string;
  updatedAt?: string;
}
