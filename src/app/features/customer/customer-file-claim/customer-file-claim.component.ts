import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClaimStatus, CreateClaimData } from '../../../core/models';
import { AuthService, ClaimService, PolicyService } from '../../../core/services';

@Component({
    selector: 'app-customer-file-claim',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './customer-file-claim.component.html'
})
export class CustomerFileClaimComponent implements OnInit {
    private router = inject(Router);
    private authService = inject(AuthService);
    private claimService = inject(ClaimService);
    private policyService = inject(PolicyService);

    steps = ['Select Policy', 'Claim Details', 'Documents', 'Review'];
    currentStep = 0;

    policies: any[] = [];
    uploadedFiles: any[] = [];
    showSuccessModal = false;
    claimNumber = '';
    submitting = false;

    claimData: any = {
        policyId: null,
        type: '',
        incidentDate: '',
        amount: null,
        description: ''
    };

    ngOnInit() {
        this.loadPolicies();
    }

    loadPolicies() {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.policyService.getPoliciesByCustomer(user.id).subscribe(policies => {
                this.policies = policies.filter(p => p.status === 'active');
            });
        }
    }

    selectPolicy(policy: any) {
        this.claimData.policyId = policy.id;
    }

    getSelectedPolicy(): any | undefined {
        return this.policies.find(p => p.id === this.claimData.policyId);
    }

    canProceed(): boolean {
        switch (this.currentStep) {
            case 0:
                return this.claimData.policyId !== null;
            case 1:
                return !!(this.claimData.type && this.claimData.incidentDate &&
                    this.claimData.amount && this.claimData.description);
            case 2:
                return true;
            case 3:
                return true;
            default:
                return false;
        }
    }

    nextStep() {
        if (this.canProceed() && this.currentStep < this.steps.length - 1) {
            this.currentStep++;
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    onFileSelected(event: any) {
        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                this.uploadedFiles.push({
                    name: files[i].name,
                    size: (files[i].size / 1024).toFixed(1) + ' KB'
                });
            }
        }
    }

    removeFile(index: number) {
        this.uploadedFiles.splice(index, 1);
    }

    submitClaim() {
        const user = this.authService.getCurrentUser();
        const policy = this.getSelectedPolicy();

        if (!user || !policy) return;

        this.submitting = true;

        const claim: CreateClaimData = {
            policyId: policy.id,
            policyNumber: policy.policyNumber,
            customerId: user.id,
            customerName: user.name,
            agentId: policy.agentId,
            agentName: policy.agentName,
            type: this.claimData.type,
            amount: this.claimData.amount,
            description: this.claimData.description,
            incidentDate: this.claimData.incidentDate,
            status: ClaimStatus.PENDING_AGENT_REVIEW
        };

        this.claimService.createClaim(claim).subscribe({
            next: (newClaim) => {
                this.claimNumber = newClaim.claimNumber;
                this.showSuccessModal = true;
                this.submitting = false;

                // Create notification for agent
                if (policy.agentId) {
                    this.http_post_notification(policy.agentId, 'New Claim Filed',
                        `${user.name} has filed a new claim (${newClaim.claimNumber}) for policy ${policy.policyNumber}.`);
                }
            },
            error: (err) => {
                console.error('Error submitting claim', err);
                this.submitting = false;
                alert('Failed to submit claim. Please try again.');
            }
        });
    }

    private http_post_notification(userId: string, title: string, message: string) {
        const notification = {
            userId,
            title,
            message,
            type: 'info',
            read: false,
            createdAt: new Date().toISOString()
        };
    }
}
