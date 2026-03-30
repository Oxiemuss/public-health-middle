import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ReferCase } from '../../app/services/interface/refer.model';
import { Refer } from '../../app/services/refer/refer';
import { CommonModule,} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferDetail } from '../refer-detail/refer-detail';
import { ThaiDatePipe } from '../../app/pipes/thai-date-pipe';

@Component({
  standalone: true,
  selector: 'app-his-screen',
  imports: [CommonModule, FormsModule, ReferDetail,ThaiDatePipe],
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
    this.loadReferrals();
  }

  loadReferrals(isManual = false) {
    if (isManual) {
      this.isUpdating = true;
    } else {
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
          // 🎯 จุดสำคัญ: กรองเอาเฉพาะเคสที่ status เป็น 'finish'
          const finishedData = data.filter((item) => item.status === 'เสร็จแล้ว');

          this.referCase = finishedData;
          this.filteredCase = [...finishedData];

          console.log('ประวัติงานที่สำเร็จแล้ว:', finishedData.length, 'เคส');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('โหลดประวัติล้มเหลว:', err);
        },
      });
  }

  onSearch() {
    const search = this.searchTerm.trim().toLowerCase();
    if (!search) {
      this.filteredCase = [...this.referCase];
      return;
    }

    // ค้นหาจากรายการที่ 'finish' แล้วเท่านั้น
    this.filteredCase = this.referCase.filter(
      (item) =>
        (item.cid && item.cid.includes(search)) ||
        (item.patient_name && item.patient_name.toLowerCase().includes(search)),
    );
  }
}
