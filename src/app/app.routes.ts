import { NgModule } from '@angular/core';
import { RouterModule,Routes} from '@angular/router';
import { LoginScreen } from '../page/login-screen/login-screen';
import { SenderScreen } from '../page/sender-screen/sender-screen';
import { RecieverScreen } from '../page/reciever-screen/reciever-screen';

export const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch:'full' }, 
  { path: 'login', component: LoginScreen},
  { path: 'sender', component: SenderScreen},
  { path: 'reciever', component: RecieverScreen},
  { path: '**', redirectTo: 'login' }               
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }