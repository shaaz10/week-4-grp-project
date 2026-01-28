import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ThemeService } from '../../../core/services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <img src="/assets/hartford-logo.png" alt="The Hartford" class="h-10 transition-transform duration-300 group-hover:scale-105 block dark:hidden">
            <!-- You might want a different logo for dark mode if the current one doesn't work well on dark, or use brightness filter -->
            <img src="/assets/hartford-logo.png" alt="The Hartford" class="h-10 transition-transform duration-300 group-hover:scale-105 hidden dark:block brightness-0 invert">
          </a>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <a routerLink="/" class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Home
            </a>
            <a routerLink="/browse-policies" class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Browse Policies
            </a>
            <a routerLink="/calculators" class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Calculators
            </a>
            <a *ngIf="currentUserRole === 'customer'" routerLink="/customer" class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              My Dashboard
            </a>
            <a *ngIf="currentUserRole === 'agent'" routerLink="/agent" class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Agent Portal
            </a>
            <a *ngIf="currentUserRole === 'agent'" routerLink="/agent/analytics" class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Analytics
            </a>
            <a *ngIf="currentUserRole === 'admin'" routerLink="/admin" class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Admin Portal
            </a>
            <a *ngIf="currentUserRole === 'admin'" routerLink="/admin/analytics" class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Analytics
            </a>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button (click)="themeService.toggleTheme()" class="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all" [attr.aria-label]="themeService.darkMode() ? 'Switch to light mode' : 'Switch to dark mode'">
              <svg *ngIf="!themeService.darkMode()" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
              <svg *ngIf="themeService.darkMode()" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </button>

            <!-- Notifications -->
            <div *ngIf="currentUserName" class="relative group mr-2">
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all relative">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span *ngIf="unreadCount > 0" class="absolute top-1.5 right-1.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <!-- Notifications Dropdown -->
              <div class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <h3 class="font-bold text-gray-900 dark:text-white">Notifications</h3>
                  <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{{ unreadCount }} New</span>
                </div>
                <div class="max-h-96 overflow-y-auto">
                    @for (notif of notifications; track notif.id) {
                        <div class="p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                            <p class="text-sm font-bold text-gray-900 dark:text-white mb-1">{{ notif.title }}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{{ notif.message }}</p>
                            <p class="text-xxs text-gray-400 mt-2">{{ notif.createdAt | date:'shortTime' }}</p>
                        </div>
                    }
                    @if (notifications.length === 0) {
                        <div class="p-8 text-center">
                            <p class="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                        </div>
                    }
                </div>
                <div class="p-3 text-center border-t border-gray-100 dark:border-gray-800">
                  <button class="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">View All Notifications</button>
                </div>
              </div>
            </div>

            <div *ngIf="currentUserName" class="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                {{ currentUserName.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ currentUserName }}</span>
            </div>
            <button *ngIf="currentUserName" (click)="logout()" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
              Sign Out
            </button>
            <a *ngIf="!currentUserName" routerLink="/login" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
              Sign In
            </a>
            <a *ngIf="!currentUserName" routerLink="/register" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit {
  @Input() userName: string = '';
  @Input() userRole: string = '';

  currentUserName: string = '';
  currentUserRole: string = '';
  notifications: any[] = [];
  unreadCount: number = 0;

  protected cdr=inject(ChangeDetectorRef)
  private http = inject(HttpClient);
  public themeService = inject(ThemeService);

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Check if user is logged in from localStorage or AuthService
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserName = currentUser.name;
      this.currentUserRole = currentUser.role;
      this.loadNotifications(currentUser.id);
    } else {
      // Fallback to input properties
      this.currentUserName = this.userName;
      this.currentUserRole = this.userRole;
    }
  }

  loadNotifications(userId: string) {
    this.http.get<any[]>(`http://localhost:3000/notifications?userId=${userId}&_sort=createdAt&_order=desc&_limit=5`)
      .subscribe(data => {
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.read).length;
      });
  }

  logout() {
    this.authService.logout();
    this.cdr.detectChanges();
    this.router.navigate(['/']);
  }
}
