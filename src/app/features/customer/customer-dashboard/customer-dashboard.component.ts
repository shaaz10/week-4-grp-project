import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../../../core/services';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './customer-dashboard.component.html'
})
export class CustomerDashboardComponent implements OnInit, AfterViewInit {
  userName = '';
  userRole = 'customer';
  currentUser: any = null;

  stats = {
    activePolicies: 0,
    totalCoverage: 0,
    pendingClaims: 0,
    nextPayment: 0
  };

  recentActivities: any[] = [];
  policies: any[] = [];
  claims: any[] = [];
  requests: any[] = [];
  pendingRecommendations: any[] = [];

  quickActions = [
    { title: 'My Requests', description: 'Track your applications', icon: '📋', route: '/customer/requests', gradient: 'from-indigo-500 to-indigo-600' },
    { title: 'File New Claim', description: 'Submit insurance claim', icon: '📝', route: '/customer/file-claim', gradient: 'from-blue-500 to-blue-600' },
    { title: 'View Policies', description: 'Manage your policies', icon: '🛡️', route: '/customer/policies', gradient: 'from-green-500 to-green-600' },
    { title: 'Get Quote', description: 'New insurance quote', icon: '🔍', route: '/browse-policies', gradient: 'from-orange-500 to-orange-600' }
  ];

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userName = this.currentUser.name;
      this.loadUserData();
    }
  }

  ngAfterViewInit() {
    // Wait a bit for data to load before creating charts
    setTimeout(() => {
      this.createPremiumChart();
      this.createCoverageChart();
    }, 500);
  }

  loadUserData() {
    const customerId = this.currentUser.id;

    // Load policies
    this.http.get<any[]>(`http://localhost:3000/policies?customerId=${customerId}`).subscribe({
      next: (policies) => {
        this.policies = policies.filter(p => p.status === 'active');
        this.stats.activePolicies = this.policies.length;
        this.stats.totalCoverage = this.policies.reduce((sum, p) => sum + (p.coverageAmount || 0), 0);

        // Calculate next payment from policies
        const activePolicies = this.policies.filter(p => p.status === 'active');
        this.stats.nextPayment = activePolicies.reduce((sum, p) => sum + (p.premium || 0), 0);

        // Add policy activities
        this.policies.forEach(policy => {
          this.recentActivities.push({
            icon: '📄',
            title: 'Policy Active',
            description: `${policy.policyType} - ${policy.policyNumber}`,
            time: this.getTimeAgo(policy.startDate),
            color: 'bg-green-100 text-green-600'
          });
        });
      },
      error: (err) => console.error('Error loading policies', err)
    });

    // Load claims
    this.http.get<any[]>(`http://localhost:3000/claims?customerId=${customerId}`).subscribe({
      next: (claims) => {
        this.claims = claims;
        this.stats.pendingClaims = claims.filter(c => c.status === 'pending' || c.status === 'under_review').length;

        // Add claim activities
        claims.slice(0, 3).forEach(claim => {
          this.recentActivities.push({
            icon: claim.status === 'approved' ? '✅' : '📋',
            title: claim.status === 'approved' ? 'Claim Approved' : 'Claim Filed',
            description: `${claim.claimType} - ${claim.claimNumber}`,
            time: this.getTimeAgo(claim.claimDate),
            color: claim.status === 'approved' ? 'bg-purple-100 text-purple-600' : 'bg-yellow-100 text-yellow-600'
          });
        });
      },
      error: (err) => console.error('Error loading claims', err)
    });

    // Load insurance requests
    this.http.get<any[]>(`http://localhost:3000/insuranceRequests?customerId=${customerId}`).subscribe({
      next: (requests) => {
        this.requests = requests;
        this.pendingRecommendations = requests.filter(r => r.status === 'recommendations_sent');

        // Add request activities
        requests.slice(0, 2).forEach(request => {
          this.recentActivities.push({
            icon: '🔍',
            title: 'Insurance Request',
            description: `${request.insuranceType} - ${request.requestNumber}`,
            time: this.getTimeAgo(request.requestDate),
            color: 'bg-blue-100 text-blue-600'
          });
        });

        // Sort activities by time (most recent first)
        this.recentActivities.sort((a, b) => {
          // Simple sort by description 
          return 0;
        });

        // Keep only the 5 most recent
        this.recentActivities = this.recentActivities.slice(0, 5);
      },
      error: (err) => console.error('Error loading requests', err)
    });
  }

  getTimeAgo(dateString: string): string {
    if (!dateString) return 'Recently';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  createPremiumChart() {
    const ctx = document.getElementById('premiumChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Generate chart data based on actual policies
    const monthlyData = this.policies.length > 0
      ? [this.stats.nextPayment, this.stats.nextPayment, this.stats.nextPayment, this.stats.nextPayment, this.stats.nextPayment, this.stats.nextPayment]
      : [0, 0, 0, 0, 0, 0];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Premium Payments',
          data: monthlyData,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1f2937',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#374151',
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              label: (context) => context.parsed.y !== null ? `₹${context.parsed.y.toLocaleString()}` : ''
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '₹' + value
            },
            grid: {
              color: '#f3f4f6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  createCoverageChart() {
    const ctx = document.getElementById('coverageChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Calculate coverage by type from actual policies
    const coverageByType: any = {};
    this.policies.forEach(policy => {
      const type = policy.policyType || 'Other';
      coverageByType[type] = (coverageByType[type] || 0) + (policy.coverageAmount || 0);
    });

    const labels = Object.keys(coverageByType);
    const data = Object.values(coverageByType);

    // If no policies, show empty state
    if (labels.length === 0) {
      labels.push('No Coverage');
      data.push(0);
    }

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data as number[],
          backgroundColor: [
            '#10b981',
            '#3b82f6',
            '#8b5cf6',
            '#f59e0b',
            '#ef4444'
          ],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: '#1f2937',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#374151',
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                return value > 0 ? `${label}: ₹${value.toLocaleString()}` : 'No coverage yet';
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  payPremium() {
    if (confirm(`Confirming payment of ₹${this.stats.nextPayment.toLocaleString()}...`)) {
      // Mock payment success
      alert('Payment successful! Thank you for choosing The Hartford.');
      this.stats.nextPayment = 0;
      // In a real app, we would update the backend payment records
    }
  }
}
