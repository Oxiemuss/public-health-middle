import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Refer } from '../../app/services/refer/refer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sender-screen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sender-screen.html',
})
export class SenderScreen implements OnInit {
  private fb = inject(FormBuilder);
  private referService = inject(Refer); // ชื่อ Service ของพี่
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  senderForm!: FormGroup;
  currentUser: any = null;

  // 🚩 ลบ isSubmiting, isUploading ออกไปเลยครับ เพราะใช้ Swal คุมแล้ว
  referralFile: File | null = null;
  idCardFile: File | null = null;
  referralPreview: string | null = null;
  idCardPreview: string | null = null;

  h_name: string = 'ไม่ระบุหน่วยงาน';
  full_name: string = 'ไม่ระบุ';
  FROM_HCODE = '00000';
  readonly TO_HCODE = '11291';

  ngOnInit() {
    this.initForm();
    this.getUserData();
    
    this.setupAgeCalculation();
  }

  initForm() {
    this.senderForm = this.fb.group({
      cid: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      full_name: ['', Validators.required],
      birth_day: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
      birth_month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      birth_year: ['', [Validators.required, Validators.min(2400)]],
      age: [{ value: '', disabled: true }],
      tel: ['', Validators.required],
      p_address: ['', Validators.required],
      rlt_name: [''],
      rlt_contact_number: [''],
    });
  }

  setupAgeCalculation() {
    this.senderForm.get('birth_year')?.valueChanges.subscribe((year) => {
      if (year && year.toString().length === 4) {
        const currentYearBE = new Date().getFullYear() + 543;
        const age = currentYearBE - year;
        this.senderForm.patchValue({ age: age >= 0 ? age : 0 }, { emitEvent: false });
      }
    });
  }

  getUserData() {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.currentUser = user;
        this.FROM_HCODE = user.hcode;
        this.h_name = user.h_name;
        this.full_name = user.full_name;
      }
    }
  }

  onFileChange(event: any, type: 'referral' | 'idcard') {
    const file = event.target.files[0];
    if (file) {
      // 🚩 ล้าง URL เดิมก่อนสร้างใหม่ (Cleanup Memory)
      if (type === 'referral' && this.referralPreview) URL.revokeObjectURL(this.referralPreview);
      if (type === 'idcard' && this.idCardPreview) URL.revokeObjectURL(this.idCardPreview);

      const previewUrl = URL.createObjectURL(file);

      if (type === 'referral') {
        this.referralFile = file;
        this.referralPreview = previewUrl;
      } else {
        this.idCardFile = file;
        this.idCardPreview = previewUrl;
      }
      this.cdr.detectChanges();
    }
  }

  onSubmit() {
    if (this.senderForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูลผู้ป่วยให้ครบตามช่องที่กำหนด',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // 🚩 เริ่มต้นส่งข้อมูล - เปิด Swal Loading
    Swal.fire({
      title: 'กำลังส่งข้อมูล...',
      text: 'ระบบกำลังดำเนินการบันทึกข้อมูลและอัปโหลดไฟล์',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const val = this.senderForm.getRawValue();
    const formData = new FormData();

    // Mapping ข้อมูล
    formData.append('cid', val.cid);
    formData.append('full_name', val.full_name);

    const yearCE = val.birth_year - 543;
    const birth_date = `${yearCE}-${val.birth_month.toString().padStart(2, '0')}-${val.birth_day.toString().padStart(2, '0')}`;

    formData.append('birth_date', birth_date);
    formData.append('tel', val.tel);
    formData.append('p_address', val.p_address);
    formData.append('from_hcode', this.FROM_HCODE);
    formData.append('to_hcode', this.TO_HCODE);
    formData.append('rlt_name', val.rlt_name || '');
    formData.append('rlt_contact_number', val.rlt_contact_number || '');
    formData.append('status', 'pending');
    
    // 🚩 เพิ่มคนสร้าง (ดึง ID จาก currentUser)
    if (this.currentUser?.id) {
      formData.append('create_by', this.currentUser.id);
    }

    if (this.referralFile) formData.append('refer_pic', this.referralFile);
    if (this.idCardFile) formData.append('cid_card_pic', this.idCardFile);

    // 🚩 ยิง Service
    this.referService.sendReferData(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'ส่งข้อมูลสำเร็จ!',
          text: 'ข้อมูลผู้ป่วยถูกส่งเข้าสู่ระบบแล้ว',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.resetForm();
        });
      },
      error: (err) => {
        console.error('Error details:', err);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: err.error?.message || 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  resetForm() {
    // 🚩 ล้าง URL Preview ออกจาก Memory Browser (ป้องกันเครื่องอืด)
    if (this.referralPreview) URL.revokeObjectURL(this.referralPreview);
    if (this.idCardPreview) URL.revokeObjectURL(this.idCardPreview);

    this.senderForm.reset();
    this.referralPreview = null;
    this.idCardPreview = null;
    this.referralFile = null;
    this.idCardFile = null;
    this.cdr.detectChanges();
  }
}