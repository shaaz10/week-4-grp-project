import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-agents',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-stone-900 p-6">
      <div class="mb-6">
        <a routerLink="/admin" class="text-gold hover:text-gold-light">← Back to Dashboard</a>
      </div>
      <h1 class="text-3xl font-display text-white mb-4">Agents Management</h1>
      <div class="card-premium">
        <p class="text-stone-400">Agent management interface coming soon...</p>
      </div>
    </div>
  `
})
export class AdminAgentsComponent { }
