import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './agent-dashboard.component.html'
})
export class AgentDashboardComponent implements OnInit {
  private apiUrl = 'http://localhost:3000';

  assignedRequests: any[] = [];
  pendingApplications: any[] = [];
  pendingClaims: any[] = [];
  totalCommission = 125000;

  showReviewModal = false;
  showAppReviewModal = false;
  selectedClaim: any = null;
  selectedApplication: any = null;
  agentNotes = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Load assigned requests for this agent
    this.http.get<any[]>(`${this.apiUrl}/insuranceRequests?agentId=${currentUser.id}`)
      .subscribe(data => {
        this.assignedRequests = data.filter(r => r.status === 'agent_assigned' || r.status === 'recommendations_sent');
      });

    // Load pending applications for this agent
    this.http.get<any[]>(`${this.apiUrl}/policyApplications?agentId=${currentUser.id}&status=submitted_to_agent`)
      .subscribe(data => {
        this.pendingApplications = data;
      });

    // Load pending claims for this agent
    this.http.get<any[]>(`${this.apiUrl}/claims?agentId=${currentUser.id}&status=pending_agent_review`)
      .subscribe(data => {
        this.pendingClaims = data;
      });
  }

  reviewClaim(claim: any) {
    this.selectedClaim = claim;
    this.agentNotes = '';
    this.showReviewModal = true;
  }

  forwardToAdmin() {
    if (!this.selectedClaim) return;

    const updatedClaim = {
      ...this.selectedClaim,
      status: 'agent_reviewed',
      agentNotes: this.agentNotes,
      agentReviewDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.http.put(`${this.apiUrl}/claims/${this.selectedClaim.id}`, updatedClaim)
      .subscribe(() => {
        this.showReviewModal = false;
        this.loadData();
        alert('Claim forwarded to admin for approval!');
      });
  }

  reviewApplication(app: any) {
    this.selectedApplication = app;
    this.agentNotes = '';
    this.showAppReviewModal = true;
  }

  escalateApplication() {
    if (!this.selectedApplication) return;

    const updatedApp = {
      ...this.selectedApplication,
      status: 'submitted_to_admin', // Escalated
      agentNotes: this.agentNotes,
      agentVerifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.http.put(`${this.apiUrl}/policyApplications/${this.selectedApplication.id}`, updatedApp)
      .subscribe(() => {
        // Also update request status
        this.http.patch(`${this.apiUrl}/insuranceRequests/${this.selectedApplication.requestId}`, {
          status: 'under_admin_review',
          updatedAt: new Date().toISOString()
        }).subscribe();

        this.showAppReviewModal = false;
        this.loadData();
        alert('Application escalated to admin with your verification!');
      });
  }
}
