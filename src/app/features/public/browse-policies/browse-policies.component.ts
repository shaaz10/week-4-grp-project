import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

interface InsuranceProduct {
    id: string;
    name: string;
    type: string;
    description: string;
    features: string[];
    coverageRange: string;
    premiumRange: string;
    icon: string;
    popular: boolean;
    discount?: string;
}

@Component({
    selector: 'app-browse-policies',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
    templateUrl: './browse-policies.component.html'
})
export class BrowsePoliciesComponent {
    selectedCategory = 'all';
    searchTerm = '';

    categories = [
        { id: 'all', name: 'All Insurance', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { id: 'health', name: 'Health', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { id: 'life', name: 'Life', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { id: 'auto', name: 'Auto', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
        { id: 'home', name: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: 'travel', name: 'Travel', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    products: InsuranceProduct[] = [
        {
            id: '1',
            name: 'Comprehensive Health Insurance',
            type: 'health',
            description: 'Complete health coverage for you and your family with cashless hospitalization',
            features: ['Cashless Hospitalization', 'Pre & Post Hospitalization', 'Day Care Procedures', 'No Claim Bonus'],
            coverageRange: '₹3L - ₹1Cr',
            premiumRange: '₹5,000 - ₹25,000/year',
            icon: 'health',
            popular: true,
            discount: 'Upto 25% Discount'
        },
        {
            id: '2',
            name: 'Term Life Insurance',
            type: 'life',
            description: 'Pure life cover at affordable premiums to secure your family\'s future',
            features: ['High Coverage', 'Tax Benefits', 'Flexible Tenure', 'Affordable Premiums'],
            coverageRange: '₹25L - ₹2Cr',
            premiumRange: '₹500 - ₹5,000/month',
            icon: 'life',
            popular: true,
            discount: 'Save 30%'
        },
        {
            id: '3',
            name: 'Comprehensive Car Insurance',
            type: 'auto',
            description: 'Complete protection for your vehicle with zero depreciation cover',
            features: ['Zero Depreciation', 'Roadside Assistance', 'Engine Protection', 'NCB Protection'],
            coverageRange: 'IDV Based',
            premiumRange: '₹8,000 - ₹30,000/year',
            icon: 'auto',
            popular: false
        },
        {
            id: '4',
            name: 'Home Insurance',
            type: 'home',
            description: 'Protect your home and belongings from unforeseen events',
            features: ['Structure Cover', 'Contents Cover', 'Personal Liability', 'Natural Calamities'],
            coverageRange: '₹10L - ₹1Cr',
            premiumRange: '₹3,000 - ₹15,000/year',
            icon: 'home',
            popular: false
        },
        {
            id: '5',
            name: 'Critical Illness Insurance',
            type: 'health',
            description: 'Lump sum payout on diagnosis of critical illnesses',
            features: ['36 Critical Illnesses', 'Lump Sum Benefit', 'Tax Benefits', 'Worldwide Coverage'],
            coverageRange: '₹5L - ₹50L',
            premiumRange: '₹3,000 - ₹20,000/year',
            icon: 'health',
            popular: false,
            discount: 'Limited Offer'
        },
        {
            id: '6',
            name: 'Travel Insurance',
            type: 'travel',
            description: 'Stay protected during your domestic and international travels',
            features: ['Medical Emergency', 'Trip Cancellation', 'Lost Baggage', '24/7 Assistance'],
            coverageRange: '₹1L - ₹10L',
            premiumRange: '₹200 - ₹2,000/trip',
            icon: 'travel',
            popular: false
        },
        {
            id: '7',
            name: 'Two Wheeler Insurance',
            type: 'auto',
            description: 'Comprehensive coverage for your bike or scooter',
            features: ['Own Damage Cover', 'Third Party Liability', 'Personal Accident', 'Add-ons Available'],
            coverageRange: 'IDV Based',
            premiumRange: '₹1,500 - ₹5,000/year',
            icon: 'auto',
            popular: false,
            discount: 'Instant Discount'
        },
        {
            id: '8',
            name: 'Senior Citizen Health Insurance',
            type: 'health',
            description: 'Specialized health insurance for senior citizens above 60 years',
            features: ['Pre-existing Diseases', 'No Medical Tests', 'Lifetime Renewability', 'Day Care Cover'],
            coverageRange: '₹2L - ₹25L',
            premiumRange: '₹15,000 - ₹50,000/year',
            icon: 'health',
            popular: false
        }
    ];

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService
    ) { }

    get filteredProducts() {
        return this.products.filter(product => {
            const matchesCategory = this.selectedCategory === 'all' || product.type === this.selectedCategory;
            const matchesSearch = !this.searchTerm ||
                product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }

    requestQuote(product: InsuranceProduct) {
        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
            // Create insurance request directly
            const request = {
                requestNumber: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
                customerId: currentUser.id,
                customerName: currentUser.name,
                insuranceType: product.type,
                status: 'pending_agent_assignment',
                agentId: null,
                agentName: null,
                requestedCoverage: product.coverageRange === 'IDV Based' ? 500000 : parseInt(product.coverageRange.replace(/[^0-9]/g, '')) * 100000,
                requestDate: new Date().toISOString(),
                description: `Request for ${product.name}`
            };

            this.http.post('http://localhost:3000/insuranceRequests', request)
                .subscribe({
                    next: () => {
                        alert('Insurance request submitted successfully! An agent will contact you soon.');
                        this.router.navigate(['/customer']);
                    },
                    error: (err: any) => {
                        console.error('Error creating request', err);
                        alert('Failed to submit request. Please try again.');
                    }
                });
        } else {
            // Navigate to register with product info
            this.router.navigate(['/register'], {
                queryParams: {
                    product: product.id,
                    type: product.type,
                    productName: product.name,
                    returnUrl: '/customer'
                }
            });
        }
    }
}
