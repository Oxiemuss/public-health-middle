import { Component, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { Refer } from '../../app/services/refer/refer';
import { ThaiDatePipe } from '../../app/pipes/thai-date-pipe';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { ClickOutside } from '../../app/click-outside';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterModule, ThaiDatePipe, CommonModule, ClickOutside],
  standalone: true,
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  private referService = inject(Refer);
  private router = inject(Router);

  showNotify = false;
  seenNotify = false;
  isNotifyOpen = false;
  caseCount = 0;
  referCase: any[] = [];
  full_name: string = 'ไม่ระบุ';
  h_name: string = 'ไม่ระบุ';
  currentUser: any = null;

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.updateNotification();
    this.getUserData();
  }

  updateNotification() {
    this.referService.getAllReferData().subscribe((data) => {
      const pendingCases = data.filter((item) => item.status === 'pending');
      this.referCase = pendingCases;

      if (isPlatformBrowser(this.platformId)) {
        const lastCheck = localStorage.getItem('last_notify_check');

        if (!lastCheck) {
          this.showNotify = pendingCases.length > 0;
        } else {
          const lastCheckDate = new Date(lastCheck).getTime();
          const hasNewCase = pendingCases.some(
            (item) => new Date(item.created_at).getTime() > lastCheckDate,
          );
          this.showNotify = hasNewCase;
        }
      } else {
        this.showNotify = false;
      }

      this.caseCount = pendingCases.length;
    });
  }

  toggleNotify() {
    this.isNotifyOpen = !this.isNotifyOpen;

    if (this.isNotifyOpen && this.isBrowser) {
      this.seenNotify = true;
      const now = new Date().toISOString();
      localStorage.setItem('last_notify_check', now);
      this.showNotify = false;
    }
  }

  onLogout() {
    if (this.isBrowser) {
      Swal.fire({
        title: 'ยืนยันการออกจากระบบ?',
        text: 'คุณต้องการออกจากระบบรับส่งผู้ป่วยใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ออกจากระบบ',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();

          Swal.fire({
            title: 'ออกจากระบบ',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }
      });
    }
  }

  getUserData() {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.currentUser = user;
        this.h_name = user.h_name;
        this.full_name = user.full_name;
      }
    }
  }
}
