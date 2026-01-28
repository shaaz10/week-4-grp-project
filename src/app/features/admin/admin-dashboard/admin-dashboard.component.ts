import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

interface InsuranceRequest {
  id: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  insuranceType: string;
  status: string;
  agentId: string | null;
  agentName: string | null;
  description: string;
  requestedCoverage: number;
  requestDate: string;
}

interface PolicyApplication {
  id: string;
  applicationNumber: string;
  requestId: string;
  customerId: string;
  customerName: string;
  agentId: string;
  agentName: string;
  insuranceType: string;
  status: string;
  coverageAmount: number;
  premium: number;
  submittedDate: string;
}

interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  customerName: string;
  agentName: string;
  status: string;
  amount: number;
  agentNotes: string | null;
}

interface Agent {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string[];
  customersCount: number;
  policiesSold: number;
  status: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private apiUrl = 'http://localhost:3000';

  // Data
  pendingRequests: InsuranceRequest[] = [];
  pendingApplications: PolicyApplication[] = [];
  pendingClaims: Claim[] = [];
  agents: Agent[] = [];

  // Stats
  stats = {
    totalRequests: 0,
    totalApplications: 0,
    totalClaims: 0,
    totalPolicies: 0
  };

  // Modals
  showAssignAgentModal = false;
  showApproveApplicationModal = false;
  showApproveClaimModal = false;

  selectedRequest: InsuranceRequest | null = null;
  selectedApplication: PolicyApplication | null = null;
  selectedClaim: Claim | null = null;
  selectedAgentId = '';
  approvedAmount = 0;
  adminNotes = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load pending requests
    this.http.get<InsuranceRequest[]>(`${this.apiUrl}/insuranceRequests?status=pending_agent_assignment`)
      .subscribe(data => {
        this.pendingRequests = data;
        this.stats.totalRequests = data.length;
      });

    // Load pending applications
    this.http.get<PolicyApplication[]>(`${this.apiUrl}/policyApplications?status=submitted_to_admin`)
      .subscribe(data => {
        this.pendingApplications = data;
        this.stats.totalApplications = data.length;
      });

    // Load pending claims (both waiting for agent and waiting for admin)
    this.http.get<Claim[]>(`${this.apiUrl}/claims?status=agent_reviewed&status=pending_agent_review`)
      .subscribe(data => {
        this.pendingClaims = data;
        this.stats.totalClaims = data.length;
      });

    // Load agents
    this.http.get<Agent[]>(`${this.apiUrl}/agents`)
      .subscribe(data => {
        this.agents = data;
      });

    // Load total policies
    this.http.get<any[]>(`${this.apiUrl}/policies`)
      .subscribe(data => {
        this.stats.totalPolicies = data.length;
      });
  }

  openAssignAgentModal(request: InsuranceRequest) {
    this.selectedRequest = request;
    this.selectedAgentId = '';
    this.showAssignAgentModal = true;
  }

  assignAgent() {
    if (!this.selectedRequest || !this.selectedAgentId) return;

    const agent = this.agents.find(a => a.id === this.selectedAgentId);
    if (!agent) return;

    const updatedRequest = {
      ...this.selectedRequest,
      agentId: agent.userId, // Use the login userId
      agentName: agent.name,
      status: 'agent_assigned',
      updatedAt: new Date().toISOString()
    };

    this.http.put(`${this.apiUrl}/insuranceRequests/${this.selectedRequest.id}`, updatedRequest)
      .subscribe(() => {
        this.showAssignAgentModal = false;
        this.loadData();
        alert(`Agent ${agent.name} assigned successfully!`);
      });
  }

  openApproveApplicationModal(application: PolicyApplication) {
    this.selectedApplication = application;
    this.adminNotes = '';
    this.showApproveApplicationModal = true;
  }

  approveApplication() {
    if (!this.selectedApplication) return;

    // Create policy
    const policyNumber = `POL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    const newPolicy = {
      policyNumber,
      applicationId: this.selectedApplication.id,
      type: this.selectedApplication.insuranceType,
      status: 'active',
      customerId: this.selectedApplication.customerId,
      customerName: this.selectedApplication.customerName,
      agentId: this.selectedApplication.agentId,
      agentName: this.selectedApplication.agentName,
      premium: this.selectedApplication.premium,
      coverageAmount: this.selectedApplication.coverageAmount,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      approvedBy: '1',
      approvedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create policy
    this.http.post(`${this.apiUrl}/policies`, newPolicy).subscribe(() => {
      // Update application status
      const updatedApp = {
        ...this.selectedApplication,
        status: 'approved',
        adminNotes: this.adminNotes,
        approvedDate: new Date().toISOString()
      };

      this.http.put(`${this.apiUrl}/policyApplications/${this.selectedApplication!.id}`, updatedApp)
        .subscribe(() => {
          // Update request status
          this.http.patch(`${this.apiUrl}/insuranceRequests/${this.selectedApplication!.requestId}`, {
            status: 'active',
            updatedAt: new Date().toISOString()
          }).subscribe();

          // Send notification to customer
          const notification = {
            userId: this.selectedApplication!.customerId,
            title: 'Policy Approved & Active',
            message: `Congratulations! Your ${this.selectedApplication!.insuranceType} insurance policy (${policyNumber}) has been approved and is now active.`,
            type: 'success',
            read: false,
            createdAt: new Date().toISOString()
          };
          this.http.post(`${this.apiUrl}/notifications`, notification).subscribe();

          this.showApproveApplicationModal = false;
          this.loadData();
          alert(`Policy ${policyNumber} created successfully! Notification sent to customer.`);
        });
    });
  }

  openApproveClaimModal(claim: Claim) {
    this.selectedClaim = claim;
    this.approvedAmount = claim.amount;
    this.adminNotes = '';
    this.showApproveClaimModal = true;
  }

  approveClaim() {
    if (!this.selectedClaim) return;

    const updatedClaim = {
      ...this.selectedClaim,
      status: 'approved',
      approvedAmount: this.approvedAmount,
      adminNotes: this.adminNotes,
      approvedBy: '1',
      approvedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.http.put(`${this.apiUrl}/claims/${this.selectedClaim.id}`, updatedClaim)
      .subscribe(() => {
        // Create payment record
        const payment = {
          paymentNumber: `PAY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          type: 'claim_payout',
          policyId: this.selectedClaim!.id,
          claimId: this.selectedClaim!.id,
          customerId: '3', // Should get from claim
          customerName: this.selectedClaim!.customerName,
          amount: this.approvedAmount,
          status: 'completed',
          paymentMethod: 'bank_transfer',
          paymentDate: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        this.http.post(`${this.apiUrl}/payments`, payment).subscribe(() => {
          this.showApproveClaimModal = false;
          this.loadData();
          alert(`Claim approved! Payment of ₹${this.approvedAmount} processed.`);
        });
      });
  }

  rejectClaim() {
    if (!this.selectedClaim) return;

    const updatedClaim = {
      ...this.selectedClaim,
      status: 'rejected',
      adminNotes: this.adminNotes,
      approvedBy: '1',
      approvedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.http.put(`${this.apiUrl}/claims/${this.selectedClaim.id}`, updatedClaim)
      .subscribe(() => {
        this.showApproveClaimModal = false;
        this.loadData();
        alert('Claim rejected.');
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending_agent_review': return 'With Agent';
      case 'agent_reviewed': return 'Ready for Admin';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending_agent_review': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'agent_reviewed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }
}
