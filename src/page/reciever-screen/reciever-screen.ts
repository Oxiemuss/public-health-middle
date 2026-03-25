import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReferCase } from '../../app/services/interface/refer.model';
import { Refer } from '../../app/services/refer/refer';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reciever-screen',
  standalone: true,
  templateUrl: './reciever-screen.html',
  imports: [CommonModule, DatePipe, FormsModule],
})
export class RecieverScreen implements OnInit {
  private referService = inject(Refer);
  private cdr = inject(ChangeDetectorRef);

  private stopLoading() {
    this.loading = false;
    this.isUpdating = false;
    this.cdr.detectChanges();
  }

  referCase: ReferCase[] = [];
  filteredCase: ReferCase[] = [];
  loading = false;
  isUpdating = false;
  caseCount = 0;
  searchTerm: string = '';

  ngOnInit() {
    const cache = this.referService.getCacheData();

    if (cache && cache.length > 0) {
      this.referCase = cache;
      this.filteredCase = [...cache];
      this.loading = false;
      this.calculateCaseCount();
      this.cdr.detectChanges();
      this.stopLoading();
    } else {
      this.loadReferrals();
    }
  }

  loadReferrals(isManual = false) {
    if (isManual) {
      this.isUpdating = true; 
      setTimeout(() => {
        this.stopLoading();
      }, 2000);
    } else {
      this.loading = true; 
    }
    this.referService
      .getAllReferData()
      .pipe(finalize(() => this.stopLoading()))
      .subscribe({
        next: (data) => {
          this.referCase = data;
          this.filteredCase = [...data];
          this.calculateCaseCount();
        },
        error: (err) => {
          console.error(err);
          this.stopLoading();
        },
      });
  }

  calculateCaseCount() {
    this.caseCount = this.referCase.filter((item) => item.status === 'pending').length;
  }

  viewImages(item: ReferCase) {
    // แนะนำ: ใช้ SweetAlert2 จะสวยมากครับพี่
    console.log('ดูรูปของ:', item.patient_name);
    const imgUrl = `https://uazidviekztmbrawgeab.supabase.co/storage/v1/object/public/refer-images/${item.refer_pic}`;
    window.open(imgUrl, '_blank');
  }

  acceptCase(item: ReferCase) {
    if (confirm(`ยืนยันการรับเคสคุณ ${item.patient_name}?`)) {
      // TODO: เรียก Service updateStatus(item.rid, 'approved')
    }
  }

  onSearch() {
    const search = this.searchTerm.trim().toLocaleLowerCase();
    if (!search) {
      this.filteredCase = [...this.referCase];
      return;
    }

    this.filteredCase = this.referCase.filter(
      (item) => item.cid.includes(search) || item.patient_name.toLowerCase().includes(search),
    );
  }
}
