import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reciever-screen',
  standalone: true,
  templateUrl: './reciever-screen.html',
})
export class RecieverScreen implements OnInit {
referrals: any[] = []; // เก็บข้อมูลที่ดึงมาจาก Supabase

  ngOnInit() {
    this.loadReferrals();
  }

  loadReferrals() {
    // ใช้ HttpClient หรือ Supabase Client ดึงข้อมูล
  
  }

  viewImage(url: string) {
    // Logic สำหรับเปิด Modal ดูรูปภาพ
    window.open(url, '_blank'); 
  }

  acceptCase(id: string) {
    // Logic สำหรับการเปลี่ยนสถานะเป็น 'Accepted'
    alert('รับเคสเรียบร้อยแล้ว');
  }
}
