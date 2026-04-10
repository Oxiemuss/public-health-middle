import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreen } from '../page/login-screen/login-screen';
import { SenderScreen } from '../page/sender-screen/sender-screen';
import { RecieverScreen } from '../page/reciever-screen/reciever-screen';
import { HisScreen } from '../page/his-screen/his-screen';
import { HcScreen } from '../page/hc-screen/hc-screen';
import { Layout } from '../page/layout/layout';
import { RegisScreen } from '../page/regis-screen/regis-screen';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginScreen ,canActivate: [authGuard],},
  { path: 'register', component: RegisScreen },
  {
    path: 'sender',
    component: SenderScreen,
    canActivate: [authGuard],
    data: { expectedRole: 'user' },
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    data: { expectedRole: 'admin' },
    children: [
      { path: 'reciever', component: RecieverScreen },
      { path: 'history', component: HisScreen },
      { path: 'hclist', component: HcScreen },
      { path: '', pathMatch: 'full', redirectTo: 'reciever' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
