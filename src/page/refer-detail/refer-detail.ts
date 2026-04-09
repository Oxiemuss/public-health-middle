import { Component, OnInit, Input, Output, EventEmitter, output } from '@angular/core';
import { ReferCase } from '../../app/services/interface/refer.model';
import { CommonModule } from '@angular/common';
import { ThaiDatePipe } from '../../app/pipes/thai-date-pipe';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-refer-detail',
  imports: [CommonModule,ThaiDatePipe],
  templateUrl: './refer-detail.html',
  styleUrl: './refer-detail.css',
})
export class ReferDetail implements OnInit {
  ngOnInit() {}
  @Input() item!: ReferCase;
  @Input() showAction : boolean = true;
  @Output() onClose = new EventEmitter<void>();
  @Output() onAccept = new EventEmitter<ReferCase>();

  isSubmitting = false;
  confirm() {
    this.isSubmitting = true; 
    this.onAccept.emit(this.item);
  }

viewImage(fileName: string,) {
    const imgUrl = `https://uazidviekztmbrawgeab.supabase.co/storage/v1/object/public/refer-images/${fileName}`;
    
    Swal.fire({
      imageUrl: imgUrl,
      confirmButtonText: 'ปิดหน้าต่าง',
      confirmButtonColor: '#3b82f6',
      width: '90%',
      backdrop: `rgba(15, 23, 42, 0.9)`,
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      }
    });
  }

}
