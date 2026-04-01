import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ReferCase } from '../../app/services/interface/refer.model';
import { Refer } from '../../app/services/refer/refer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferDetail } from '../refer-detail/refer-detail';
import { ThaiDatePipe } from '../../app/pipes/thai-date-pipe';

@Component({
  standalone: true,
  selector: 'app-his-screen',
  imports: [CommonModule, FormsModule, ReferDetail, ThaiDatePipe],
  templateUrl: './his-screen.html',
  styleUrl: './his-screen.css',
})
export class HisScreen implements OnInit {
  private referService = inject(Refer);
  private cdr = inject(ChangeDetectorRef);

  private stopLoading() {
    this.loading = false;
    this.isUpdating = false;
    this.cdr.detectChanges();
  }

  selectedCase: ReferCase | null = null;
  referCase: ReferCase[] = [];
  filteredCase: ReferCase[] = [];
  loading = false;
  isUpdating = false;
  searchTerm: string = '';

  ngOnInit() {
    const cache = this.referService.getHisCacheData();

    if (cache && cache.length > 0) {
      const hisData = cache.filter((item) => item.status === 'เสร็จแล้ว');
      this.referCase = [...hisData];
      this.filteredCase = [...hisData];
      this.cdr.detectChanges();
    }
    this.loadReferrals();
  }

  loadReferrals(isManual = false) {
    if (isManual) {
      this.isUpdating = true;
    } else if (this.referCase.length === 0) {
      this.loading = true;
    }

    this.referService
      .getAllHisData()
      .pipe(
        finalize(() => {
          this.stopLoading();
        }),
      )
      .subscribe({
        next: (data) => {
          if (data) {
            const hisData = data.filter((item) => item.status === 'เสร็จแล้ว');

            this.referCase = [...hisData];

            if (!this.searchTerm) {
              this.filteredCase = [...hisData];
            } else {
              this.onSearch();
            }

            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('โหลดข้อมูลศูนย์บริการพลาด:', err);
          this.stopLoading();
        },
      });
  }

  onSearch() {
    const search = this.searchTerm.trim().toLowerCase();
    if (!search) {
      this.filteredCase = [...this.referCase];
      return;
    }

    this.filteredCase = this.referCase.filter(
      (item) =>
        (item.cid && item.cid.includes(search)) ||
        (item.patient_name && item.patient_name.toLowerCase().includes(search)),
    );
  }
}
