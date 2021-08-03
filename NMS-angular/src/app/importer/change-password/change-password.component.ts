import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImporterInfoService } from 'src/app/_services/importer-info.service';
import { LoginService } from 'src/app/_services/login.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { RegisterService } from 'src/app/_services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  loading = false;
  changePasswordForm: FormGroup;
  verifyCrntPass = false;
  constructor(
    private importerService: ImporterInfoService,
    private loginService: LoginService,
    private alertify: AlertifyService,
    private registerService: RegisterService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createChangePasswordForm();
    this.changePasswordForm.get('newPassword').disable();
    this.changePasswordForm.get('confirmPassword').disable();
  }
  createChangePasswordForm() {
    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('',  [Validators.required, Validators.minLength(5), Validators.maxLength(10)]),
      confirmPassword : new FormControl('', [Validators.required])
    }, this.passwordMatchValidator);
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword').value === g.get('confirmPassword').value ? null : {mismatch: true };
  }
  backToImporterInfo() {
    this.router.navigate(['portal/editimporterinfo']);
  }
  verifyCurrentPassword() {
    const impId = this.loginService.getEmpOrImpName();
    const importer: IVerifyCrntPassDto = {
      importerId: impId,
      currentPassword: this.changePasswordForm.get('currentPassword').value
    };
    this.registerService.verifyCurrentPassword(importer).subscribe(resp => {
      if (resp) {
        this.changePasswordForm.get('newPassword').enable();
        this.changePasswordForm.get('confirmPassword').enable();
        this.verifyCrntPass = false;
      } else {
        this.changePasswordForm.get('newPassword').disable();
        this.changePasswordForm.get('confirmPassword').disable();
        this.verifyCrntPass = true;
      }
    }, err => {
      console.log(err);
    });
  }
  changePassword() {
    this.loading = true;
    const impId = this.loginService.getEmpOrImpName();
    const importer: IChangePassDto = {
      importerId: impId,
      newPassword: this.changePasswordForm.get('newPassword').value
    };
    this.registerService.changePassword(importer).subscribe(resp => {
      this.loading = false;
      if (resp) {
        this.alertify.success('Password Updated Successful');
      }
    }, err => {
      this.loading = false;
      console.log(err);
      this.alertify.error(err.error);
    });
  }

}
interface IVerifyCrntPassDto {
  importerId: number;
  currentPassword: string;
}
interface IChangePassDto {
  importerId: number;
  newPassword: string;
}
