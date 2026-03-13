import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-screen',
standalone: true,
templateUrl: './login-screen.html'
})
export class LoginScreen {
  role: 'SENDER' | 'RECEIVER' = 'SENDER'; 

  constructor(private router: Router) {}

  onLogin() {
    if (this.role === 'SENDER') {
      this.router.navigate(['/sender']);
    } else {
      this.router.navigate(['/reciever']);
    }
  }
}
