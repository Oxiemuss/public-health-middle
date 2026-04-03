// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // เช็กก่อนว่ารันอยู่ใน Browser ไหม?
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('AccessToken');
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(cloned);
    }
  }

  // ถ้าเป็นฝั่ง Server หรือไม่มี Token ก็ปล่อยผ่านไปปกติ
  return next(req);
};