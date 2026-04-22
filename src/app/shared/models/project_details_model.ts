export interface AssignedUser {
  id: number;
  name: string | null;
  email: string;
  role: string;
  categoryLabel: string;
  teamLeader: boolean;
}

export interface ProjectOverview {
  id: number;
  name: string | null;
  description: string;
  status: string;
  leaderName: string | null;
  assignedUsers: AssignedUser[];
  readOnly?: boolean;
}

export interface AffectationRequest {
  userId: number;
  projectId: number;
  startDate: string;
  endDate: string;
  teamLeader: boolean;
}
