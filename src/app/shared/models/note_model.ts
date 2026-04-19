export interface Note {
  id: number; 
  projectId: number; 
  authorId: number; 
  authorName?: string; 
  title: string; 
  content: string; 
  createdAt: string; 
  updatedAt?: string;
}
