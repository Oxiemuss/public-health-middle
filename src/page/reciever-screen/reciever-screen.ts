import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReferCase } from '../../app/services/interface/refer.model';
import { Refer } from '../../app/services/refer/refer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, finalize, combineLatest, map } from 'rxjs';
import { ThaiDatePipe } from '../../app/pipes/thai-date-pipe';
import { ReferDetail } from '../refer-detail/refer-detail';

@Component({
  selector: 'app-reciever-screen',
  standalone: true,
  templateUrl: './reciever-screen.html',
  imports: [CommonModule, FormsModule, ReferDetail, ThaiDatePipe],
})
export class RecieverScreen implements OnInit {
  private referService = inject(Refer);
  private cdr = inject(ChangeDetectorRef);


  private stopLoading() {
    this.loading = false;
    this.isUpdating = false;
    this.isProcess = false;
    this.cdr.detectChanges();
  }

  selectedCase: ReferCase | null = null;
  referCase: ReferCase[] = [];
  filteredCase: ReferCase[] = [];
  loading = false;
  isUpdating = false;
  isProcess = false;
  caseCount = 0;
  searchTerm: string = '';

  ngOnInit() {
    const cache = this.referService.getCacheData();

    if (cache && cache.length > 0) {
      const pendingCache = cache.filter((item: any) => item.status === 'pending');

      this.referCase = pendingCache;
      this.filteredCase = [...pendingCache];
      this.calculateCaseCount();
      this.cdr.detectChanges();
    }
    this.loadReferrals();
  }

  loadReferrals(isManual = false) {

    if (isManual) {
      this.isUpdating = true;
    } else if(this.referCase.length === 0) {
      this.loading = true;
    }

    this.referService
      .getAllReferData()
      .pipe(
        finalize(() => {
          this.stopLoading();
        }),
      )
      .subscribe({
        next: (data) => {
          const pendingCase = (data || []).filter((item) => item.status === 'pending');

          this.referCase = pendingCase;
          this.filteredCase = [...pendingCase];

          this.calculateCaseCount();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.referCase = [];
          this.filteredCase = [];
          this.stopLoading();
        },
      });
  }

  calculateCaseCount() {
    this.caseCount = this.referCase.filter((item) => item.status === 'pending').length;
  }

  // viewImages(item: ReferCase) {
  //   // แนะนำ: ใช้ SweetAlert2 จะสวยมากครับพี่
  //   console.log('ดูรูปของ:', item.patient_name);
  //   const imgUrl = `https://uazidviekztmbrawgeab.supabase.co/storage/v1/object/public/refer-images/${item.refer_pic}`;
  //   window.open(imgUrl, '_blank');
  // }

  handleAcceptCase(item: any) {
    this.isProcess = true;
    const body = {
      rid: item.rid,
      status: 'เสร็จแล้ว',
    };

    this.referService.updateReferStatus(body).subscribe({
      next: (res) => {
        console.log('อัปเดตสำเร็จ:', res);
        this.selectedCase = null;
        this.loadReferrals(true);
        this.isProcess = false;
      },
      error: (err) => {
        console.error('อัปเดตพลาด:', err);
        alert('ไม่สามารถอัปเดตสถานะได้');
        this.isProcess = false;
      },
    });
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
