import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RegisterData, UserRole } from '../../../core/models';
import { AuthService } from '../../../core/services';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    registerData: RegisterData = {
        email: '',
        password: '',
        name: '',
        role: UserRole.CUSTOMER,
        phone: ''
    };

    confirmPassword = '';
    loading = false;
    error = '';
    returnUrl: string = '';
    pendingProduct: any = null;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['product']) {
                this.pendingProduct = {
                    id: params['product'],
                    type: params['type'],
                    name: params['productName'] || 'Insurance Product'
                };
                this.returnUrl = params['returnUrl'] || '/customer';
            }
        });
    }

    onSubmit(): void {
        if (this.registerData.password !== this.confirmPassword) {
            this.error = 'Passwords do not match';
            return;
        }

        this.loading = true;
        this.error = '';

        this.authService.register(this.registerData).subscribe({
            next: (user) => {
                // If there's a pending product application, create it now
                if (this.pendingProduct && user.role === UserRole.CUSTOMER) {
                    this.createInsuranceRequest(user);
                } else {
                    this.redirectUser(user);
                }
            },
            error: (err: any) => {
                this.error = 'Registration failed. Please try again.';
                this.loading = false;
            }
        });
    }

    private createInsuranceRequest(user: any) {
        const request = {
            requestNumber: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
            customerId: user.id,
            customerName: user.name,
            insuranceType: this.pendingProduct.type,
            status: 'pending_agent_assignment',
            agentId: null,
            agentName: null,
            requestedCoverage: 500000, // Default coverage if not specified
            requestDate: new Date().toISOString(),
            description: `Request for ${this.pendingProduct.name}`
        };

        this.http.post('http://localhost:3000/insuranceRequests', request)
            .subscribe({
                next: () => {
                    alert('Registration successful! Your insurance request has been submitted.');
                    this.router.navigate([this.returnUrl]);
                },
                error: (err: any) => {
                    console.error('Error creating request', err);
                    // Still redirect but user might check dashboard
                    this.router.navigate([this.returnUrl]);
                }
            });
    }

    private redirectUser(user: any) {
        switch (user.role) {
            case UserRole.ADMIN:
                this.router.navigate(['/admin']);
                break;
            case UserRole.AGENT:
                this.router.navigate(['/agent']);
                break;
            case UserRole.CUSTOMER:
                this.router.navigate(['/customer']);
                break;
            default:
                this.router.navigate(['/']);
        }
    }
}
