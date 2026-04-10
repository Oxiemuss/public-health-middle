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

  // 🚩 1. กรณี: มี User (Login อยู่แล้ว) แต่พยายามจะเข้าหน้า Login
  if (user && state.url === '/login') {
    return user.role === 'admin' 
      ? router.parseUrl('/reciever') // หรือ '/main/reciever' ตาม path ที่พี่ตั้ง
      : router.parseUrl('/sender');
  }

  // 🚩 2. กรณี: ไม่มี User (ยังไม่ได้ Login)
  if (!user) {
    // ถ้าอยู่ที่หน้า login หรือ register อยู่แล้ว ก็ปล่อยให้เข้าได้
    if (state.url === '/login' || state.url === '/register') {
      return true;
    }

    // ถ้าจะเข้าหน้าอื่นโดยไม่มี User ค่อยโชว์ Swal แล้วดีดกลับไป Login
    Swal.fire({
      icon: 'warning',
      title: 'เซสชั่นหมดอายุ',
      text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
      confirmButtonColor: '#3085d6',
      timer: 2000,
      showConfirmButton: false
    });
    return router.parseUrl('/login');
  }

  // 🚩 3. กรณี: มี User แล้ว แต่เช็ก Role (ตามที่พี่เขียนไว้เดิม)
  const userRole = user.role;
  const expectedRole = route.data['expectedRole'];
  
  if (expectedRole && userRole !== expectedRole) {
    return userRole === 'admin' 
      ? router.parseUrl('/reciever') 
      : router.parseUrl('/sender');
  }

  return true;
};
