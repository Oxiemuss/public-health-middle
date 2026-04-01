import { Component, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Refer } from '../../app/services/refer/refer';
import { ThaiDatePipe } from '../../app/pipes/thai-date-pipe';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { ClickOutside } from '../../app/click-outside';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterModule, ThaiDatePipe, CommonModule,ClickOutside],
  standalone: true,
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  private referService = inject(Refer);

  showNotify = false;
  seenNotify = false;
  isNotifyOpen = false;
  caseCount = 0;
  referCase: any[] = [];

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.updateNotification();
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
}
