import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../app/services/auth/auth.service';
@Component({
  selector: 'app-login-screen',
  standalone: true,
  templateUrl: './login-screen.html',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
})
export class LoginScreen implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  loginForm!: FormGroup;
  role: 'user' | 'admin' | '' = '';
  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      user_name: ['', Validators.required],
      pass_word: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const val = this.loginForm.getRawValue();
      const loginData = {
        user_name: val.user_name,
        pass_word: val.pass_word,
      };
      this.authService.login(loginData).subscribe({
        next: (res: any) => {
          if (res.token) this.resetForm();
          console.log('data', loginData);
        },
        error: (err) => {
          console.error('Error Detail', err);
        },
      });
    }
    this.getRoleFormStorage();
  }

  getRoleFormStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const userDataJson = JSON.parse(userData);

          if (userDataJson.role === 'admin') {
            this.router.navigate(['/reciever']);
          }
          if (userDataJson.role === 'user') {
            this.router.navigate(['/sender']);
          }
        } catch (e) {
          console.error('Error parsing user data from localStorage', e);
        }
      }
    }
  }

  resetForm() {
    this.loginForm.reset();
  }
}
