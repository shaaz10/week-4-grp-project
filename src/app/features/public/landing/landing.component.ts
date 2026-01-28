import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
    mobileMenuOpen = false;

    stats = [
        { value: '10M+', label: 'Happy Customers' },
        { value: '51+', label: 'Insurance Partners' },
        { value: '98%', label: 'Claim Settlement' },
        { value: '24/7', label: 'Customer Support' }
    ];

    products = [
        {
            title: 'Health Insurance',
            description: 'Comprehensive health coverage for you and your family with cashless hospitalization.',
            discount: 'Upto 25% Discount'
        },
        {
            title: 'Term Life Insurance',
            description: 'Secure your family\'s future with affordable term life insurance plans.',
            discount: 'Starting ₹400/month'
        },
        {
            title: 'Car Insurance',
            description: 'Complete protection for your vehicle with instant policy issuance.',
            discount: 'Upto 85% Discount'
        },
        {
            title: '2 Wheeler Insurance',
            description: 'Affordable bike insurance with quick claim settlement and roadside assistance.',
            discount: 'Lowest Price Guarantee'
        },
        {
            title: 'Investment Plans',
            description: 'Grow your wealth with market-linked investment insurance plans.',
            discount: 'Upto 20% Cheaper'
        },
        {
            title: 'Home Insurance',
            description: 'Protect your home and belongings from unforeseen events.',
            discount: 'Insure Life & Cover'
        },
        {
            title: 'Travel Insurance',
            description: 'Travel worry-free with comprehensive coverage for domestic and international trips.',
            discount: ''
        },
        {
            title: 'Child Savings Plans',
            description: 'Secure your child\'s future education and dreams with smart savings plans.',
            discount: 'Premium Waiver'
        }
    ];

    features = [
        {
            title: 'Fast Claims Processing',
            description: 'Most claims processed within 24-48 hours with our streamlined digital system.'
        },
        {
            title: '24/7 Customer Support',
            description: 'Our dedicated team is always available when you need us most.'
        },
        {
            title: 'Competitive Rates',
            description: 'Get premium coverage without premium prices. Save up to 30% when you bundle.'
        }
    ];

    testimonials = [
        {
            quote: 'Hartford made the claims process so simple. When my car was damaged, they had a check to me within 48 hours. Incredible service!',
            name: 'Sarah Mitchell',
            title: 'Auto Insurance Customer',
            rating: 5,
            photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
        },
        {
            quote: 'We\'ve been with Hartford for 15 years. Their rates are competitive, and their customer service is unmatched in the industry.',
            name: 'Robert & Linda Chen',
            title: 'Home Insurance Customers',
            rating: 5,
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
        },
        {
            quote: 'As a small business owner, Hartford\'s commercial coverage gives me peace of mind. Their team truly understands business needs.',
            name: 'Michael Thompson',
            title: 'Business Insurance Customer',
            rating: 5,
            photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
        }
    ];

    trustBadges = [
        { icon: '🏆', title: 'A+ Rated', subtitle: 'AM Best Rating' },
        { icon: '⭐', title: '4.8/5 Stars', subtitle: '50K+ Reviews' },
        { icon: '🔒', title: 'Secure', subtitle: 'SSL Encrypted' },
        { icon: '✅', title: 'Licensed', subtitle: 'All 50 States' }
    ];

    toggleMobileMenu(): void {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }
}
