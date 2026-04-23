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
  noteTrends: { [date: string]: number }; // Daily activity trend
  notesPerUser: { [user: string]: number }; // User documentation engagement
}
