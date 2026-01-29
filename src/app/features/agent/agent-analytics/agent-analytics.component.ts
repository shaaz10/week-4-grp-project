
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

Chart.register(...registerables);

@Component({
    selector: 'app-agent-analytics',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    templateUrl: 'agent-analytics.component.html',
    styles: []
})
export class AgentAnalyticsComponent implements OnInit, AfterViewInit {
    @ViewChild('revenueChart') revenueChartRef!: ElementRef;
    @ViewChild('policyDistChart') policyDistChartRef!: ElementRef;
    @ViewChild('conversionChart') conversionChartRef!: ElementRef;

    revenueChart: any;
    policyDistChart: any;
    conversionChart: any;

    constructor() { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        this.initRevenueChart();
        this.initPolicyDistChart();
        this.initConversionChart();
    }

    initRevenueChart() {
        const ctx = this.revenueChartRef.nativeElement.getContext('2d');

        // Gradient definitions would happen here if using plain canvas API or chartjs gradient plugins, 
        // but for simplicity we'll use solid colors with alpha for now.

        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue 2024',
                    data: [12000, 19000, 15000, 22000, 24000, 32000, 28000, 45000, 42000, 50000, 55000, 62000],
                    borderColor: '#4f46e5', // Primary equivalent usually
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#4f46e5',
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Revenue 2025 (Target)',
                    data: [15000, 21000, 18000, 25000, 28000, 35000, 31000, 48000, 45000, 53000, 58000, 68000],
                    borderColor: '#9ca3af',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        },
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563',
                            callback: function (value) {
                                return '$' + value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563'
                        }
                    }
                }
            }
        });
    }

    initPolicyDistChart() {
        const ctx = this.policyDistChartRef.nativeElement.getContext('2d');

        this.policyDistChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Health Insurance', 'Vehicle Insurance', 'Life Insurance', 'Home Insurance', 'Travel Insurance'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#4f46e5', // Indigo
                        '#06b6d4', // Cyan
                        '#10b981', // Emerald
                        '#f59e0b', // Amber
                        '#ef4444'  // Red
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563',
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    initConversionChart() {
        const ctx = this.conversionChartRef.nativeElement.getContext('2d');

        this.conversionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Leads',
                    data: [15, 20, 18, 22, 25, 12, 10],
                    backgroundColor: '#93c5fd', // Light Blue
                    borderRadius: 4
                },
                {
                    label: 'Sales',
                    data: [5, 8, 7, 10, 12, 4, 3],
                    backgroundColor: '#2563eb', // Blue
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        },
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563'
                        }
                    }
                }
            }
        });

    }
}
