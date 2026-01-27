import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Policy {
    id?: number;
    policyNumber: string;
    type: string;
    coverageAmount: number;
    premium: number;
    startDate: string;
    endDate: string;
    status: string;
}

@Component({
    selector: 'app-customer-policies',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './customer-policies.component.html'
})
export class CustomerPoliciesComponent implements OnInit {
    policies: Policy[] = [];
    filteredPolicies: Policy[] = [];

    showAddModal = false;
    showEditModal = false;
    showViewModal = false;

    selectedPolicy: Policy | null = null;
    currentPolicy: Policy = this.getEmptyPolicy();

    searchTerm = '';
    filterStatus = '';
    filterType = '';

    ngOnInit() {
        this.loadPolicies();
    }

    loadPolicies() {
        this.policies = [
            {
                id: 1,
                policyNumber: 'POL-2024-001',
                type: 'Health',
                coverageAmount: 50000,
                premium: 150,
                startDate: '2024-01-01',
                endDate: '2025-01-01',
                status: 'Active'
            },
            {
                id: 2,
                policyNumber: 'POL-2024-002',
                type: 'Auto',
                coverageAmount: 25000,
                premium: 120,
                startDate: '2024-02-01',
                endDate: '2025-02-01',
                status: 'Active'
            },
            {
                id: 3,
                policyNumber: 'POL-2023-015',
                type: 'Life',
                coverageAmount: 100000,
                premium: 200,
                startDate: '2023-06-01',
                endDate: '2024-06-01',
                status: 'Expired'
            },
            {
                id: 4,
                policyNumber: 'POL-2024-003',
                type: 'Home',
                coverageAmount: 75000,
                premium: 180,
                startDate: '2024-03-01',
                endDate: '2025-03-01',
                status: 'Pending'
            }
        ];
        this.filteredPolicies = [...this.policies];
    }

    filterPolicies() {
        this.filteredPolicies = this.policies.filter(policy => {
            const matchesSearch = !this.searchTerm ||
                policy.policyNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                policy.type.toLowerCase().includes(this.searchTerm.toLowerCase());

            const matchesStatus = !this.filterStatus || policy.status === this.filterStatus;
            const matchesType = !this.filterType || policy.type === this.filterType;

            return matchesSearch && matchesStatus && matchesType;
        });
    }

    getActivePolicies(): number {
        return this.policies.filter(p => p.status === 'Active').length;
    }

    getExpiringPolicies(): number {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        return this.policies.filter(p => {
            const endDate = new Date(p.endDate);
            return p.status === 'Active' && endDate <= thirtyDaysFromNow && endDate >= today;
        }).length;
    }

    getTotalCoverage(): string {
        const total = this.policies
            .filter(p => p.status === 'Active')
            .reduce((sum, p) => sum + p.coverageAmount, 0);
        return (total / 1000).toFixed(0) + 'K';
    }

    viewPolicy(policy: Policy) {
        this.selectedPolicy = policy;
        this.showViewModal = true;
    }

    editPolicy(policy: Policy) {
        this.currentPolicy = { ...policy };
        this.showEditModal = true;
        this.showAddModal = false;
    }

    deletePolicy(policy: Policy) {
        if (confirm(`Are you sure you want to delete policy ${policy.policyNumber}?`)) {
            this.policies = this.policies.filter(p => p.id !== policy.id);
            this.filterPolicies();
        }
    }

    savePolicy() {
        if (this.showAddModal) {
            // Add new policy
            const newId = Math.max(...this.policies.map(p => p.id || 0)) + 1;
            this.currentPolicy.id = newId;
            this.policies.push({ ...this.currentPolicy });
        } else if (this.showEditModal) {
            // Update existing policy
            const index = this.policies.findIndex(p => p.id === this.currentPolicy.id);
            if (index !== -1) {
                this.policies[index] = { ...this.currentPolicy };
            }
        }
        this.filterPolicies();
        this.closeModal();
    }

    closeModal() {
        this.showAddModal = false;
        this.showEditModal = false;
        this.currentPolicy = this.getEmptyPolicy();
    }

    getEmptyPolicy(): Policy {
        return {
            policyNumber: '',
            type: '',
            coverageAmount: 0,
            premium: 0,
            startDate: '',
            endDate: '',
            status: 'Pending'
        };
    }
}
