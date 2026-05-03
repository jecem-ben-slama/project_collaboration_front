export interface AffectationRequest {
  userId: number;
  projectId: number;
  startDate: string;
  endDate: string;
  teamLeader: boolean; 
}
export interface Affectation {
  id: number;
  startDate: string;
  endDate: string;
  isTeamLeader: boolean;
  user: any; 
  project: any; 
}
