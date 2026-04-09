import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (req.url.includes('/login')) {
    return next(req);
  }

  let authReq = req;

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('AccessToken');
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        Swal.fire({
          icon: 'warning',
          title: 'เซสชั่นหมดอายุ',
          text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้งเพื่อความปลอดภัย',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'ตกลง',
          allowOutsideClick: false,
        }).then(() => {
          if (isPlatformBrowser(platformId)) {
            localStorage.clear();
            router.navigate(['/login']);
          }
        });
      }

      return throwError(() => error);
    }),
  );
};
