import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }
  const token = localStorage.getItem('AccessToken');

  if (token) {
    return true;
  } else {
    console.warn('Access Denied: No Token Found');
    return router.parseUrl('/login');
  }
};
