import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginCredentials } from '../../../core/models';
import { AuthService } from '../../../core/services';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    credentials: LoginCredentials = {
        email: '',
        password: ''
    };

    loading = false;
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit(): void {
        this.loading = true;
        this.error = '';

        this.authService.login(this.credentials).subscribe({
            next: (response: any) => {
                const user = response[0]; // JSON server returns array
                if (user) {
                    // Redirect based on role
                    switch (user.role) {
                        case 'admin':
                            this.router.navigate(['/admin']);
                            break;
                        case 'agent':
                            this.router.navigate(['/agent']);
                            break;
                        case 'customer':
                            this.router.navigate(['/customer']);
                            break;
                        default:
                            this.router.navigate(['/']);
                    }
                } else {
                    this.error = 'Invalid email or password';
                    this.loading = false;
                }
            },
            error: (err) => {
                this.error = 'Login failed. Please try again.';
                this.loading = false;
            }
        });
    }
}
