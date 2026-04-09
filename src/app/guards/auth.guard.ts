import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return true;

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    Swal.fire({
      icon: 'warning',
      title: 'เซสชั่นหมดอายุ',
      text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
      confirmButtonColor: '#3085d6',
      timer: 3000 
    });
    return router.parseUrl('/login');
  }

  const userRole = user.role;


  const expectedRole = route.data['expectedRole'];
  
  if (expectedRole && userRole !== expectedRole) {

    return userRole === 'admin' 
      ? router.parseUrl('/reciever') 
      : router.parseUrl('/sender');
  }

  return true;
};
