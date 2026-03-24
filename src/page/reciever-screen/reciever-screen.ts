import { Component, inject, OnInit } from '@angular/core';
import { ReferCase } from '../../app/services/interface/refer.model';
import { Refer } from '../../app/services/refer/refer';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reciever-screen',
  standalone: true,
  templateUrl: './reciever-screen.html',
  imports: [
    CommonModule, DatePipe , FormsModule ,
  ],
})
export class RecieverScreen implements OnInit {
  private referService = inject(Refer);

  referCase: ReferCase[] = [];
  filteredCase: ReferCase [] = [];
  loading = false;
  todayCount = 0;
  searchTerm :string = "";


  ngOnInit() {
    this.loadReferrals();
  }

  loadReferrals() {
    this.loading = true;
    this.referService.getAllReferData().subscribe({
      next: (data) => {
        this.referCase = data;
        this.filteredCase = data;
        // console.log('✅ ข้อมูลที่ได้จาก API:', data);
        this.calculateTodayCount();
        
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  calculateTodayCount() {
    const today = new Date().toDateString();
    this.todayCount = this.referCase.filter(item => 
      new Date(item.created_at).toDateString() === today && 
      item.status === 'pending'
    ).length;
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

  onSearch(){
    const search = this.searchTerm.trim().toLocaleLowerCase();
    if (!search) {
      this.filteredCase = [...this.referCase]
      return;
    }

    this.filteredCase = this.referCase.filter(item => 
    
      item.cid.includes(search) || 
      item.patient_name.toLowerCase().includes(search)
    );
  }
  
}
