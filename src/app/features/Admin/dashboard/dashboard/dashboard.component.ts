import { Component, OnInit } from '@angular/core';

import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DashboardStats } from '../../../../shared/models/dashboard_stats_model';
import { StatsService } from '../../../../core/services/stats.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stats!: DashboardStats;
  isLoading = true;

  // 1. Project Growth (Bar Chart)
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'New Projects',
        backgroundColor: '#4f46e5',
        borderRadius: 6,
      },
    ],
  };

  // 2. Note Trends (Line Chart)
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Journal Activity',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.mapCharts(data);
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  private mapCharts(data: DashboardStats) {
    // Map Project Bar Chart
    this.barChartData.labels = Object.keys(data.projectTrends);
    this.barChartData.datasets[0].data = Object.values(data.projectTrends);

    // Map Note Line Chart
    this.lineChartData.labels = Object.keys(data.noteTrends);
    this.lineChartData.datasets[0].data = Object.values(data.noteTrends);
  }

  getPercentage(value: number): number {
    return (value / this.stats.totalProjects) * 100;
  }
}
