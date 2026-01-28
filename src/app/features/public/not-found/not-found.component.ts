import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-stone-900 flex items-center justify-center px-6 transition-colors duration-300">
      <div class="text-center">
        <h1 class="text-9xl font-display text-gradient mb-4">404</h1>
        <h2 class="text-3xl font-display text-gray-900 dark:text-white mb-4">Page Not Found</h2>
        <p class="text-gray-600 dark:text-stone-400 mb-8 font-light">The page you're looking for doesn't exist.</p>
        <a routerLink="/" class="btn-primary inline-block">
          Return Home
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundComponent { }
