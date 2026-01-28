import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-calculators',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './calculators.component.html'
})
export class CalculatorsComponent {
    activeCalculator = '';

    // Life Insurance Calculator
    lifeInsurance = {
        age: 30,
        annualIncome: 500000,
        existingCoverage: 0,
        dependents: 2,
        liabilities: 0,
        yearsToRetirement: 30,
        result: 0
    };

    // Health Insurance Calculator
    healthInsurance = {
        age: 30,
        familyMembers: 4,
        city: 'metro',
        existingConditions: false,
        roomType: 'shared',
        result: 0
    };

    // Car Insurance Calculator
    carInsurance = {
        carValue: 500000,
        carAge: 2,
        city: 'metro',
        coverageType: 'comprehensive',
        addOns: [] as string[],
        result: 0
    };

    // Term Insurance Calculator
    termInsurance = {
        age: 30,
        gender: 'male',
        smoker: false,
        coverageAmount: 10000000,
        term: 30,
        result: 0
    };

    // Home Insurance Calculator
    homeInsurance = {
        propertyValue: 5000000,
        propertyType: 'apartment',
        location: 'metro',
        constructionType: 'rcc',
        age: 5,
        result: 0
    };

    // Investment Calculator
    investmentCalculator = {
        monthlyInvestment: 5000,
        years: 20,
        expectedReturn: 12,
        result: { totalInvested: 0, totalReturns: 0, maturityAmount: 0 }
    };

    selectCalculator(type: string) {
        this.activeCalculator = type;
    }

    calculateLifeInsurance() {
        // Human Life Value Method
        const yearsOfIncome = this.lifeInsurance.yearsToRetirement;
        const futureValue = this.lifeInsurance.annualIncome * yearsOfIncome;
        const dependentFactor = 1 + (this.lifeInsurance.dependents * 0.2);

        this.lifeInsurance.result = Math.round(
            (futureValue * dependentFactor) +
            this.lifeInsurance.liabilities -
            this.lifeInsurance.existingCoverage
        );
    }

    calculateHealthInsurance() {
        let basePremium = 5000;

        // Age factor
        if (this.healthInsurance.age > 45) basePremium *= 1.5;
        else if (this.healthInsurance.age > 35) basePremium *= 1.3;

        // Family members
        basePremium *= this.healthInsurance.familyMembers;

        // City factor
        if (this.healthInsurance.city === 'metro') basePremium *= 1.2;

        // Existing conditions
        if (this.healthInsurance.existingConditions) basePremium *= 1.4;

        // Room type
        if (this.healthInsurance.roomType === 'private') basePremium *= 1.3;
        else if (this.healthInsurance.roomType === 'single') basePremium *= 1.5;

        this.healthInsurance.result = Math.round(basePremium);
    }

    calculateCarInsurance() {
        let premium = this.carInsurance.carValue * 0.03; // 3% base

        // Car age depreciation
        premium *= (1 - (this.carInsurance.carAge * 0.05));

        // City factor
        if (this.carInsurance.city === 'metro') premium *= 1.2;

        // Coverage type
        if (this.carInsurance.coverageType === 'third-party') premium *= 0.4;

        // Add-ons
        const addOnCost = this.carInsurance.addOns.length * 2000;
        premium += addOnCost;

        this.carInsurance.result = Math.round(premium);
    }

    calculateTermInsurance() {
        let basePremium = (this.termInsurance.coverageAmount / 1000) * 0.5;

        // Age factor
        const ageFactor = 1 + ((this.termInsurance.age - 25) * 0.02);
        basePremium *= ageFactor;

        // Gender factor
        if (this.termInsurance.gender === 'female') basePremium *= 0.9;

        // Smoker factor
        if (this.termInsurance.smoker) basePremium *= 1.5;

        // Term factor
        basePremium *= (this.termInsurance.term / 30);

        this.termInsurance.result = Math.round(basePremium / 12); // Monthly premium
    }

    calculateHomeInsurance() {
        let premium = this.homeInsurance.propertyValue * 0.004; // 0.4% base

        // Property type
        if (this.homeInsurance.propertyType === 'independent') premium *= 1.3;

        // Location
        if (this.homeInsurance.location === 'metro') premium *= 1.2;

        // Construction type
        if (this.homeInsurance.constructionType === 'wood') premium *= 1.5;

        // Age factor
        premium *= (1 + (this.homeInsurance.age * 0.02));

        this.homeInsurance.result = Math.round(premium);
    }

    calculateInvestment() {
        const monthlyRate = this.investmentCalculator.expectedReturn / 100 / 12;
        const months = this.investmentCalculator.years * 12;

        // Future value of SIP
        const futureValue = this.investmentCalculator.monthlyInvestment *
            (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

        this.investmentCalculator.result.totalInvested =
            this.investmentCalculator.monthlyInvestment * months;
        this.investmentCalculator.result.maturityAmount = Math.round(futureValue);
        this.investmentCalculator.result.totalReturns =
            this.investmentCalculator.result.maturityAmount -
            this.investmentCalculator.result.totalInvested;
    }

    toggleAddOn(addOn: string) {
        const index = this.carInsurance.addOns.indexOf(addOn);
        if (index > -1) {
            this.carInsurance.addOns.splice(index, 1);
        } else {
            this.carInsurance.addOns.push(addOn);
        }
    }

    hasAddOn(addOn: string): boolean {
        return this.carInsurance.addOns.includes(addOn);
    }
}
