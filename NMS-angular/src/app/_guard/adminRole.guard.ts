import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../_services/login.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private alertfy: AlertifyService) {}
  canActivate(): boolean {
    if (!this.loginService.loggedIn()) {
        this.alertfy.error('UnAuthorized Access!!!');
        this.router.navigate(['/login']);
        return false;
    }
    if (this.loginService.getUserRole() === 'Admin' || this.loginService.getUserRole() === 'SA') {
      //  console.log(this.loginService.getUserRole());
        return true;
    }
    this.alertfy.error('UnAuthorized Access!!!');
    this.router.navigate(['login']);
    return false;
  }
}
