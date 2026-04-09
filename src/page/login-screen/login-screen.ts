import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../app/services/auth/auth.service';
import Swal from 'sweetalert2';
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
      const loginData = this.loginForm.getRawValue();

      Swal.fire({
        title: 'กำลังเข้าสู่ระบบ...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      this.authService.login(loginData).subscribe({
        next: (res: any) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('AccessToken', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));

            Swal.close();

            const userRole = res.user.role;

            if (userRole === 'admin') {
              console.log('Redirecting to Admin (Receiver)...');
              this.router.navigate(['/reciever']);
            } else {
              console.log('Redirecting to User (Sender)...');
              this.router.navigate(['/sender']);
            }
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'เข้าสู่ระบบไม่สำเร็จ',
            text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
          });
        },
      });
    }
  }

  resetForm() {
    this.loginForm.reset();
  }
}
