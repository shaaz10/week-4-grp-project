import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
    selector: 'app-customer-application-form',
    standalone: true,
    imports: [CommonModule, NavbarComponent, RouterLink, FormsModule],
    templateUrl:'./customer-application-form.component.html'
})
export class CustomerApplicationFormComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    requestId: string = '';
    packageName: string = '';
    premium: number = 0;
    coverage: number = 0;

    fullName: string = '';
    phone: string = '';
    selectedFileName: string = '';
    submitting = false;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.requestId = params['requestId'];
            this.packageName = params['packageName'];
            this.premium = +params['premium'];
            this.coverage = +params['coverage'];

            const user = this.authService.getCurrentUser();
            if (user) {
                this.fullName = user.name;
                this.phone = user.phone || '';
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFileName = file.name;
        }
    }

    submitApplication() {
        const user = this.authService.getCurrentUser();
        if (!user) {
            alert('Session expired. Please login again.');
            this.router.navigate(['/login']);
            return;
        }

        this.submitting = true;

        //1. Load the request to get agent details
        this.http.get<any>(`http://localhost:3000/insuranceRequests/${this.requestId}`)
            .subscribe(request => {

                const application = {
                    applicationNumber: `APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
                    requestId: this.requestId,
                    customerId: user.id,
                    customerName: user.name,
                    agentId: request.agentId,
                    agentName: request.agentName,
                    insuranceType: request.insuranceType,
                    packageName: this.packageName,
                    premium: this.premium,
                    coverageAmount: this.coverage,
                    status: 'submitted_to_agent',
                    documents: [this.selectedFileName],
                    submittedDate: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                //2. Post the application
                this.http.post('http://localhost:3000/policyApplications', application)
                    .subscribe(() => {
                        //3. Update the request status
                        this.http.patch(`http://localhost:3000/insuranceRequests/${this.requestId}`, {
                            status: 'application_in_progress',
                            updatedAt: new Date().toISOString()
                        }).subscribe(() => {
                            //4. Create a notification for the agent if we had a proper notification logic
                            // For now just finish
                            this.submitting = false;
                            alert('Application submitted successfully! Your agent will review it shortly.');
                            this.router.navigate(['/customer/requests']);
                        });
                    });
            });
    }
}
