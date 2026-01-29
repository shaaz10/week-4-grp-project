import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-agent-claims',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl:'agent-claims.component.html' 
})
export class AgentClaimsComponent { }
