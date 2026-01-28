
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

Chart.register(...registerables);

@Component({
    selector: 'app-admin-analytics',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <app-navbar></app-navbar>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header class="mb-8 animate-fade-in-down">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">System Analytics</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Comprehensive overview of platform performance, user growth, and financial health.</p>
        </header>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
           <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
             <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1">$2.4M</h3>
                </div>
                <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                     <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
             </div>
             <div class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                <span>+18.2%</span>
                <span class="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
             </div>
           </div>

           <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
             <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                    <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1">12,450</h3>
                </div>
                <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                     <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
             </div>
             <div class="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400">
                <span>+543</span>
                <span class="text-gray-500 dark:text-gray-400 ml-2">new this month</span>
             </div>
           </div>

           <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
             <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Agents</p>
                    <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1">145</h3>
                </div>
                <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                     <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
             </div>
             <div class="mt-4 flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                <span>92%</span>
                <span class="text-gray-500 dark:text-gray-400 ml-2">utilization rate</span>
             </div>
           </div>

           <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
             <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Claim Ratio</p>
                    <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1">68.4%</h3>
                </div>
                <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                     <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                </div>
             </div>
            <div class="mt-4 flex items-center text-sm text-red-600 dark:text-red-400">
                <span>-2.1%</span>
                <span class="text-gray-500 dark:text-gray-400 ml-2">improvement</span>
             </div>
           </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <!-- Main Revenue/Profit Chart -->
            <div class="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Financial Performance</h3>
                </div>
                <div class="relative h-96">
                    <canvas #financialChart></canvas>
                </div>
            </div>

            <!-- Top Agents Leaderboard -->
            <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in" style="animation-delay: 0.1s;">
                 <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Performing Agents</h3>
                 <div class="relative h-96">
                    <canvas #agentsChart></canvas>
                 </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <!-- User Demographics -->
             <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in" style="animation-delay: 0.2s;">
                 <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">User Demographics</h3>
                 <div class="relative h-72">
                    <canvas #demographicsChart></canvas>
                 </div>
             </div>
             
             <!-- Traffic Sources -->
             <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in" style="animation-delay: 0.3s;">
                 <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Traffic Sources</h3>
                 <div class="relative h-72">
                    <canvas #trafficChart></canvas>
                 </div>
             </div>

             <!-- Claims Status -->
             <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in" style="animation-delay: 0.4s;">
                 <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Claims Overview</h3>
                 <div class="relative h-72">
                    <canvas #claimsChart></canvas>
                 </div>
             </div>
        </div>
      </div>
    </div>
  `
})
export class AdminAnalyticsComponent implements OnInit, AfterViewInit {
    @ViewChild('financialChart') financialChartRef!: ElementRef;
    @ViewChild('agentsChart') agentsChartRef!: ElementRef;
    @ViewChild('demographicsChart') demographicsChartRef!: ElementRef;
    @ViewChild('trafficChart') trafficChartRef!: ElementRef;
    @ViewChild('claimsChart') claimsChartRef!: ElementRef;

    constructor() { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        this.initFinancialChart();
        this.initAgentsChart();
        this.initDemographicsChart();
        this.initTrafficChart();
        this.initClaimsChart();
    }

    initFinancialChart() {
        new Chart(this.financialChartRef.nativeElement, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Total Revenue',
                        data: [150000, 180000, 160000, 210000, 240000, 290000, 310000, 350000, 380000, 420000, 450000, 500000],
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Net Profit',
                        data: [40000, 50000, 45000, 60000, 70000, 90000, 95000, 110000, 120000, 130000, 140000, 160000],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: this.getTextColor() } }
                },
                scales: {
                    y: {
                        ticks: { color: this.getTextColor() },
                        grid: { color: this.getGridColor() }
                    },
                    x: {
                        ticks: { color: this.getTextColor() },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    initAgentsChart() {
        new Chart(this.agentsChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: ['Sarah M.', 'John D.', 'Emily R.', 'Michael C.', 'David W.'],
                datasets: [{
                    label: 'Policies Sold',
                    data: [145, 132, 128, 115, 98],
                    backgroundColor: '#f59e0b',
                    borderRadius: 5
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: this.getTextColor() },
                        grid: { color: this.getGridColor() }
                    },
                    y: {
                        ticks: { color: this.getTextColor() },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    initDemographicsChart() {
        new Chart(this.demographicsChartRef.nativeElement, {
            type: 'doughnut',
            data: {
                labels: ['18-25', '26-35', '36-50', '50+'],
                datasets: [{
                    data: [15, 35, 30, 20],
                    backgroundColor: ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: this.getTextColor(), usePointStyle: true }
                    }
                }
            }
        });
    }

    initTrafficChart() {
        new Chart(this.trafficChartRef.nativeElement, {
            type: 'pie',
            data: {
                labels: ['Direct', 'Social Media', 'Organic Search', 'Referral'],
                datasets: [{
                    data: [40, 25, 20, 15],
                    backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: this.getTextColor(), usePointStyle: true }
                    }
                }
            }
        });
    }

    initClaimsChart() {
        new Chart(this.claimsChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: ['Approved', 'Pending', 'Rejected'],
                datasets: [{
                    label: 'Claims',
                    data: [650, 120, 45],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        ticks: { color: this.getTextColor() },
                        grid: { color: this.getGridColor() }
                    },
                    x: {
                        ticks: { color: this.getTextColor() },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    private getTextColor() {
        return document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563';
    }

    private getGridColor() {
        return document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    }
}
