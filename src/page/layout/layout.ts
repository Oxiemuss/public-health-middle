import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,RouterModule],
  standalone: true,
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
