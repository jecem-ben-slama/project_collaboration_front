export interface ProjectAssignment {
  projectId: number; 
  userId: number; 
  assignedAt?: string;
  startDate?: string; 
  endDate?: string; 
  teamLeader?: boolean; 
}
