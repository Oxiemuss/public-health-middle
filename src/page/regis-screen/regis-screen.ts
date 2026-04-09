import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-regis-screen',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './regis-screen.html',
  styleUrl: './regis-screen.css',
})
export class RegisScreen implements OnInit {
  selectedRole: string = '';

  userData = {
    user_name: '',
    pass_word: '',
    full_name: '',
    hcode: '',
    role: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {}

  setRole(role: string) {
    this.selectedRole = this.selectedRole === role ? '' : role;
    console.log('Role', this.selectedRole);
  }

onSubmit() {
  const { user_name, pass_word, full_name, hcode } = this.userData;
  
  // 1. Validation เช็กข้อมูลเบื้องต้น
  if (!user_name || !pass_word || !full_name || !hcode || !this.selectedRole) {
    let missingField = '';
    if (!user_name) missingField = 'ชื่อผู้ใช้งาน';
    else if (!pass_word) missingField = 'รหัสผ่าน';
    else if (!full_name) missingField = 'ชื่อ-นามสกุล';
    else if (!hcode) missingField = 'เลขสถานพยาบาล';
    else if (!this.selectedRole) missingField = 'สถานที่ทำงาน';

    Swal.fire({
      title: 'ข้อมูลไม่ครบถ้วน',
      text: `กรุณากรอกข้อมูลให้ครบถ้วน: ${missingField}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง',
    });
    return;
  }

  // 🚩 2. ยิง Swal Loading ทันที (ป้องกันการกดซ้ำ)
  Swal.fire({
    title: 'กำลังบันทึกข้อมูล...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading(); // แสดงตัวหมุน
    },
  });

  const payload = { ...this.userData, role: this.selectedRole };

  this.authService.register(payload).subscribe({
    next: (res) => {
      // 🚩 3. ปิด Loading และโชว์ Success
      Swal.fire({
        title: 'ลงทะเบียนสำเร็จ!',
        text: 'ยินดีต้อนรับเข้าสู่ระบบ',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        this.router.navigate(['/login']);
      });
    },
    error: (err) => {
      // 🚩 4. ปิด Loading และโชว์ Error
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: err.error?.error || 'ไม่สามารถลงทะเบียนได้ หรือชื่อผู้ใช้อาจมีอยู่แล้ว',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'ลองอีกครั้ง'
      });
    },
  });
}
}
