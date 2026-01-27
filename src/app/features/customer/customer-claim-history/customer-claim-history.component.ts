import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

//Claim Interface
interface Claim {
  id: number;
  claimNumber: string;
  policyNumber: string;
  type: string;
  amount: number;
  status: string;
  dateSubmitted: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-customer-claim-history',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl:'./customer-claim-history.component.html' 
})
export class CustomerClaimHistoryComponent implements OnInit {
  //Claims Array
  claims: Claim[] = [];

  ngOnInit() {
    this.loadClaims();
  }

  //LoadClaims
  loadClaims() {
    this.claims = [
      {
        id: 1,
        claimNumber: 'CLM-2024-001',
        policyNumber: 'POL-2024-001',
        type: 'Medical',
        amount: 1200,
        status: 'Approved',
        dateSubmitted: '2024-01-15',
        lastUpdated: '2024-01-17'
      },
      {
        id: 2,
        claimNumber: 'CLM-2024-002',
        policyNumber: 'POL-2024-002',
        type: 'Accident',
        amount: 3500,
        status: 'Pending',
        dateSubmitted: '2024-01-20',
        lastUpdated: '2024-01-20'
      },
      {
        id: 3,
        claimNumber: 'CLM-2024-003',
        policyNumber: 'POL-2024-001',
        type: 'Medical',
        amount: 850,
        status: 'Under Review',
        dateSubmitted: '2024-01-22',
        lastUpdated: '2024-01-23'
      }
    ];
  }

  //Returns the total number of approved claims.
  getApprovedClaims(): number {
    return this.claims.filter(c => c.status === 'Approved').length;
  }

  //Returns the number of claims that are still in progress
  getPendingClaims(): number {
    return this.claims.filter(c => c.status === 'Pending' || c.status === 'Under Review').length;
  }

  //Calculates the total claimed amount across all claims.
  getTotalClaimed(): number {
    return this.claims.reduce((sum, c) => sum + c.amount, 0);
  }

  //Triggered when user clicks "View" on a claim.
  viewClaim(claim: Claim) {
    alert('View claim details: ' + claim.claimNumber);
  }
}
