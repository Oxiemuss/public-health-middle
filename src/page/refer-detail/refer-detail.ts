import { Component, OnInit,Input, Output, EventEmitter, output} from '@angular/core';
import { ReferCase } from '../../app/services/interface/refer.model';
import { CommonModule } from '@angular/common';



@Component({
  standalone : true,
  selector: 'app-refer-detail',
  imports: [CommonModule],
  templateUrl: './refer-detail.html',
  styleUrl: './refer-detail.css',
})
export class ReferDetail implements OnInit{

ngOnInit(){
  
}
@Input() item!:ReferCase;
@Output() onClose = new EventEmitter<void>();
@Output() onAccept = new EventEmitter<ReferCase>();

}
