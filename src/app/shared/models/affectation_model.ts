export interface AffectationRequest {
  userId: number;
  projectId: number;
  startDate: string;
  endDate: string;
  teamLeader: boolean; // ✅ Lowercase 't'
}
export interface Affectation {
  id: number;
  startDate: string;
  endDate: string;
  isTeamLeader: boolean;
  user: any; // Adjust based on your User model
  project: any; // Adjust based on your Project model
}
