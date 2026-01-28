import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

interface RequestStatus {
    step: number;
    status: 'pending' | 'in_progress' | 'completed';
    title: string;
    description: string;
    icon: string;
    timestamp?: string;
}

@Component({
    selector: 'app-customer-requests',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    templateUrl: './customer-requests.component.html',
    styleUrls: ['./customer-requests.component.scss']
})
export class CustomerRequestsComponent implements OnInit {
    currentUser: any = null;
    requests: any[] = [];
    selectedRequest: any = null;
    loading = true;

    workflowSteps: RequestStatus[] = [
        {
            step: 1,
            status: 'completed',
            title: 'Request Submitted',
            description: 'Your insurance request has been received',
            icon: 'file-check',
            timestamp: ''
        },
        {
            step: 2,
            status: 'in_progress',
            title: 'Agent Assignment',
            description: 'An expert agent is being assigned to your request',
            icon: 'user-check',
            timestamp: ''
        },
        {
            step: 3,
            status: 'pending',
            title: 'Policy Recommendations',
            description: 'Agent will suggest suitable policy packages',
            icon: 'clipboard-list',
            timestamp: ''
        },
        {
            step: 4,
            status: 'pending',
            title: 'Application & Documents',
            description: 'Complete application with required documents',
            icon: 'file-text',
            timestamp: ''
        },
        {
            step: 5,
            status: 'pending',
            title: 'Admin Review',
            description: 'Admin reviews and approves your application',
            icon: 'shield-check',
            timestamp: ''
        },
        {
            step: 6,
            status: 'pending',
            title: 'Policy Activation',
            description: 'Your policy is activated and ready',
            icon: 'check-circle',
            timestamp: ''
        }
    ];

    constructor(
        private authService: AuthService,
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser) {
            this.loadRequests();
        }
    }

    loadRequests() {
        this.loading = true;
        this.http.get<any[]>(`http://localhost:3000/insuranceRequests?customerId=${this.currentUser.id}`)
            .subscribe({
                next: (requests) => {
                    this.requests = requests.sort((a, b) =>
                        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
                    );
                    this.loading = false;

                    // Auto-select first request if exists
                    if (this.requests.length > 0 && !this.selectedRequest) {
                        this.selectRequest(this.requests[0]);
                    }
                },
                error: (err) => {
                    console.error('Error loading requests', err);
                    this.loading = false;
                }
            });
    }

    selectRequest(request: any) {
        this.selectedRequest = request;
        this.updateWorkflowStatus(request);
    }

    updateWorkflowStatus(request: any) {
        const statusMap: any = {
            'pending_agent_assignment': 1,
            'agent_assigned': 2,
            'recommendations_sent': 3,
            'application_in_progress': 4,
            'under_admin_review': 5,
            'approved': 6,
            'active': 6
        };

        const currentStep = statusMap[request.status] || 1;

        this.workflowSteps.forEach((step, index) => {
            if (step.step < currentStep) {
                step.status = 'completed';
            } else if (step.step === currentStep) {
                step.status = 'in_progress';
            } else {
                step.status = 'pending';
            }
        });
    }

    getStatusBadgeClass(status: string): string {
        const classes: any = {
            'pending_agent_assignment': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'agent_assigned': 'bg-blue-100 text-blue-800 border-blue-200',
            'recommendations_sent': 'bg-purple-100 text-purple-800 border-purple-200',
            'application_in_progress': 'bg-orange-100 text-orange-800 border-orange-200',
            'under_admin_review': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'approved': 'bg-green-100 text-green-800 border-green-200',
            'active': 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
        return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    }

    getStatusLabel(status: string): string {
        const labels: any = {
            'pending_agent_assignment': 'Pending Agent',
            'agent_assigned': 'Agent Assigned',
            'recommendations_sent': 'Recommendations Ready',
            'application_in_progress': 'Application In Progress',
            'under_admin_review': 'Under Review',
            'approved': 'Approved',
            'active': 'Active'
        };
        return labels[status] || status;
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
        return new Date(dateString).toLocaleDateString();
    }

    browseMorePolicies() {
        this.router.navigate(['/browse-policies']);
    }

    viewRecommendations(request: any) {
        this.router.navigate(['/customer/recommendations'], { queryParams: { requestId: request.id } });
    }
}
