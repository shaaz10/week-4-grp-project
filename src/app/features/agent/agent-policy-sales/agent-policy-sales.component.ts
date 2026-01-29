import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-agent-policy-sales',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './agent-policy-sales.component.html'
})
export class AgentPolicySalesComponent { }
