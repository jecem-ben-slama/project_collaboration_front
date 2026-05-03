export interface TopContributor {
  userName: string;
  assignmentCount: number;
}

export interface DashboardStats {
  totalProjects: number;
  totalEmployees: number;
  totalNotes: number;
  avgTeamSize: number;
  projectsByStatus: { [key: string]: number };
  topContributors: TopContributor[];
  projectTrends: { [month: string]: number };
  noteTrends: { [date: string]: number }; 
  notesPerUser: { [user: string]: number };
}
