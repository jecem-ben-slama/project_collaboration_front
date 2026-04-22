export interface AssignedUser {
  id: number;
  name: string | null;
  email: string;
  role: string;
  categoryLabel: string;
}

export interface ProjectOverview {
  id: number;
  name: string | null;
  description: string;
  status: string;
  leaderName: string | null;
  assignedUsers: AssignedUser[];
}

export interface AffectationRequest {
  userId: number;
  projectId: number;
  startDate: string;
  endDate: string;
  teamLeader: boolean;
}
