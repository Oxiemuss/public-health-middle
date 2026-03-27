import { Component, OnInit, Input, Output, EventEmitter, output } from '@angular/core';
import { ReferCase } from '../../app/services/interface/refer.model';
import { CommonModule } from '@angular/common';
import { ThaiDatePipe } from '../../app/pipes/thai-date-pipe';

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
}
