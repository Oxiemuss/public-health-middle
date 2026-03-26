import { Component, OnInit , ChangeDetectorRef, inject} from '@angular/core';
import { finalize } from 'rxjs';
import { ReferCase } from '../../app/services/interface/refer.model';
import { Refer } from '../../app/services/refer/refer';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-his-screen',
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './his-screen.html',
  styleUrl: './his-screen.css',
})
export class HisScreen implements OnInit {
  private referService = inject(Refer);
  private cdr = inject(ChangeDetectorRef);

  referCase: ReferCase[] = [];
  filteredCase: ReferCase[] = [];
  loading = false;
  isUpdating = false;
  searchTerm: string = '';

  ngOnInit() {
    // ดึงข้อมูลมาแสดงผล (หน้าประวัติมักจะดึงใหม่เสมอเพื่อให้ข้อมูลล่าสุด)
    this.loadReferrals();
  }

  loadReferrals(isManual = false) {
    if (isManual) {
      this.isUpdating = true;
    } else {
      this.loading = true;
    }

    this.referService
      .getAllReferData()
      .pipe(
        finalize(() => {
          this.stopLoading();
        })
      )
      .subscribe({
        next: (data) => {
          // 🎯 จุดสำคัญ: กรองเอาเฉพาะเคสที่ status เป็น 'finish'
          const finishedData = data.filter(item => item.status === 'finish');
          
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

  private stopLoading() {
    this.loading = false;
    this.isUpdating = false;
    this.cdr.detectChanges();
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
        (item.patient_name && item.patient_name.toLowerCase().includes(search))
    );
  }

  // หน้าประวัติอาจจะไม่ต้องมี acceptCase แล้ว แต่อาจจะมีปุ่ม "ดูรายละเอียด" แทน
  viewDetail(item: ReferCase) {
    console.log('ดูรายละเอียดเคสที่จบแล้ว:', item.rid);
  }
}
