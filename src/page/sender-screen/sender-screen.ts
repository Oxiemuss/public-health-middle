import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sender-screen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
  ],
  templateUrl: './sender-screen.html',
})
export class SenderScreen implements OnInit {


  ngOnInit() {
  }

  onSubmit() {

  }


}
