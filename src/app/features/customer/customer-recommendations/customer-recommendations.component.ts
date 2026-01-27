import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
    selector: 'app-customer-recommendations',
    standalone: true,
    imports: [CommonModule, NavbarComponent, RouterLink],
    templateUrl: './customer-recommendations.component.html',
    animations: [
        trigger('fadeInUp', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ]),
        trigger('staggerFade', [
            transition(':enter', [
                query('div', [
                    style({ opacity: 0, transform: 'translateY(20px)' }),
                    stagger('100ms', [
                        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ], { optional: true })
            ])
        ])
    ]
})
export class CustomerRecommendationsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private http = inject(HttpClient);

    requestId: string | null = null;
    request: any = null;
    recommendation: any = null;
    loading = true;
    acceptingPolicy = false;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.requestId = params['requestId'];
            if (this.requestId) {
                this.loadData();
            } else {
                // Handle error or redirect
                this.router.navigate(['/customer/requests']);
            }
        });
    }

    loadData() {
        this.loading = true;

        this.http.get<any>(`http://localhost:3000/insuranceRequests/${this.requestId}`)
            .subscribe({
                next: (req) => {
                    this.request = req;
                    this.loadRecommendations();
                },
                error: (err) => {
                    console.error('Error loading request', err);
                    this.loading = false;
                }
            });
    }

    loadRecommendations() {
        this.http.get<any[]>(`http://localhost:3000/policyRecommendations?requestId=${this.requestId}`)
            .subscribe({
                next: (recs) => {
                    if (recs && recs.length > 0) {
                        this.recommendation = recs[recs.length - 1];
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading recommendations', err);
                    this.loading = false;
                }
            });
    }

    selectPolicy(pkg: any) {
        if (confirm(`Are you sure you want to proceed with the "${pkg.name}" plan? This will initiate the application process.`)) {
            this.router.navigate(['/customer/apply'], {
                queryParams: {
                    requestId: this.requestId,
                    packageName: pkg.name,
                    premium: pkg.premium,
                    coverage: pkg.coverage
                }
            });
        }
    }
    getCoverageAmount(amount: number): string {
        if (amount === -1) return 'Unlimited';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }
}
