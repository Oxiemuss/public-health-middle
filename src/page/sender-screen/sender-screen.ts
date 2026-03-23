import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Refer } from '../../app/services/refer/refer';

@Component({
  selector: 'app-sender-screen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sender-screen.html',
})
export class SenderScreen implements OnInit {
  private fb = inject(FormBuilder);
  private referService = inject(Refer);

  senderForm!: FormGroup;

  isUploadingIdCard = false;
  isUploadingReferral = false;
  isSubmiting = false;

  selectedReferralFile: File | null = null;
  selectedIdCardFile: File | null = null;

  referralPreview: string | null = null;
  idCardPreview: string | null = null;

  referralFile: File | null = null;
  idCardFile: File | null = null;

  // ตั้งค่ารหัสสถานพยาบาลตามที่ระบุ
  readonly FROM_HCODE = '08216';
  readonly TO_HCODE = '11291';

  ngOnInit() {
    this.initForm();
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
  
  // 2. ปรับฟังก์ชัน onFileChange
  onFileChange(event: any, type: 'referral' | 'idcard') {
  const file = event.target.files[0];
  if (file) {
    // 1. เช็ค type แล้วเปิด Loading เฉพาะจุด
    if (type === 'referral') {
      this.isUploadingReferral = true;
      this.selectedReferralFile = file;
    } else {
      this.isUploadingIdCard = true;
      this.selectedIdCardFile = file;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // 2. จำลองหน่วงเวลาเล็กน้อย (Optional) เพื่อให้ User เห็นว่าระบบกำลังประมวลผล
      setTimeout(() => {
        if (type === 'referral') {
          this.referralPreview = reader.result as string;
          this.isUploadingReferral = false; // ปิด Loading เฉพาะจุด
        } else {
          this.idCardPreview = reader.result as string;
          this.isUploadingIdCard = false; // ปิด Loading เฉพาะจุด
        }
      }, 500); // หน่วงไว้ 0.5 วินาทีให้ดูมี animation
    };

    reader.onerror = () => {
      this.isUploadingReferral = false;
      this.isUploadingIdCard = false;
    };

    reader.readAsDataURL(file);
  }
}

onSubmit() {
  if (this.senderForm.valid) {
    // 🚩 เริ่ม Loading ทันทีที่กดปุ่ม
    this.isSubmiting = true;

    const val = this.senderForm.getRawValue();
    const formData = new FormData();

    // ข้อมูลพื้นฐาน (เหมือนเดิมของพี่)
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

    if (this.referralFile) {
      formData.append('refer_pic', this.referralFile);
    }

    if (this.idCardFile) {
      formData.append('cid_card_pic', this.idCardFile);
    }

    // ส่งข้อมูล
    this.referService.sendReferData(formData).subscribe({
      next: (res) => {
        // ✅ สำเร็จ (Status 200/201)
        alert('ส่งข้อมูลผู้ป่วยสำเร็จ!');
        this.resetForm();
        this.isSubmiting = false; // 🚩 ปิด Loading
      },
      error: (err) => {
        // ❌ เกิด Error
        console.error('Error details:', err);
        alert('ไม่สามารถส่งข้อมูลได้ กรุณาเช็ค Error ใน Console');
        this.isSubmiting = false; // 🚩 ปิด Loading เพื่อให้กดส่งใหม่ได้
      },
    });
  }
}

  resetForm() {
    this.senderForm.reset();
    this.referralPreview = null;
    this.idCardPreview = null;
    this.referralFile = null;
    this.idCardFile = null;
  }
}
