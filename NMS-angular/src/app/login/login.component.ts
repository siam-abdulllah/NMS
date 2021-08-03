import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { LoginService } from '../_services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  loginForm: FormGroup;
  public loading = false;
  invalidUserCred = false;
  constructor(private router: Router,
              private alertify: AlertifyService,
              private loginService: LoginService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.body.classList.add('loginBGImage');
  }
  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('loginBGImage');
   // this.body.classList.remove('sidebar-mini');
  }
  login() {
    this.loading = true;
    this.loginService.login(this.loginForm.value).subscribe(next => {
      this.loading = false;
     // this.alertify.success('logged in successfully');
    }, error => {
      this.loading = false;
      this.invalidUserCred = true;
      // this.alertify.error('Wrong Username or Password!');
    }, () => {
      if (this.loginService.decodedToken.role === 'Admin' || this.loginService.decodedToken.role === 'SA') {
        this.router.navigate(['/portal/admin']);
      }
      if (this.loginService.decodedToken.role === 'Importer') {
      this.router.navigate(['/portal/importer']);
      }
    }
    );
  }
  NavigateToRegister() {
    this.router.navigate(['/register']);
  }

}
