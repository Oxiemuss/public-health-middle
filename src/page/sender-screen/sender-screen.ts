import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  senderForm!: FormGroup;

  isUploadingIdCard = false;
  isUploadingReferral = false;
  isSubmiting = false;

  referralFile: File | null = null;
  idCardFile: File | null = null;

  referralPreview: string | null = null;
  idCardPreview: string | null = null;

  // ตั้งค่ารหัสสถานพยาบาลตามที่ระบุ
  readonly FROM_HCODE = '08231';
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

  onFileChange(event: any, type: 'referral' | 'idcard') {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // สร้าง URL จาก Memory ทันที

      if (type === 'referral') {
        this.referralFile = file;
        this.referralPreview = previewUrl;
        this.isUploadingReferral = false;
      } else {
        this.idCardFile = file;
        this.idCardPreview = previewUrl;
        this.isUploadingIdCard = false;
      }
      this.cdr.detectChanges();
    }
  }

  onSubmit() {
    if (this.senderForm.valid) {
      this.isSubmiting = true;
      const val = this.senderForm.getRawValue();
      const formData = new FormData();

      // ข้อมูลพื้นฐาน
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

      // 2. 🟢 ตอนนี้ค่ามาแน่นอนเพราะเราเก็บไว้ใน referralFile แล้ว
      if (this.referralFile) {
        formData.append('refer_pic', this.referralFile);
      }

      if (this.idCardFile) {
        formData.append('cid_card_pic', this.idCardFile);
      }

      this.referService.sendReferData(formData).subscribe({
        next: () => {
          // alert('ส่งข้อมูลผู้ป่วยสำเร็จ!');
          this.resetForm();
          this.isSubmiting = false;
        },
        error: (err) => {
          console.error('Error details:', err);
          // alert('ไม่สามารถส่งข้อมูลได้');
          this.isSubmiting = false;
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
