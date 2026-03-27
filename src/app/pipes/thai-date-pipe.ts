import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiDate',
  standalone: true,
})
export class ThaiDatePipe implements PipeTransform {
private thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  private thaiMonthsShort = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  transform(value: any, format: 'short' | 'full' | 'birth' = 'short'): string {
    if (!value) return '-';
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear() + 543;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (format === 'full') {
      // ตัวอย่าง: 25 มีนาคม 2569 | 00:00 น.
      return `${day} ${this.thaiMonths[monthIndex]} ${year} เวลา ${hours}:${minutes} น.`;
    } 
    
    if (format === 'short') {
      // ตัวอย่าง: 25 มี.ค. 69 00:00 น. (เอาเฉพาะ 2 หลักท้ายปี)
      const shortYear = year.toString().slice(-2);
      return `${day} ${this.thaiMonthsShort[monthIndex]} ${shortYear} เวลา ${hours}:${minutes} น.`;
    }

    if (format === 'birth') {
      // สำหรับวันเกิด: 01 ม.ค. 2500
      return `${day} ${this.thaiMonthsShort[monthIndex]} ${year}`;
    }

    return `${day}/${monthIndex + 1}/${year}`;
  }
}
