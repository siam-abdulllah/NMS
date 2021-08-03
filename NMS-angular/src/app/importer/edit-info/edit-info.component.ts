import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImporterInfoService } from 'src/app/_services/importer-info.service';
import { LoginService } from 'src/app/_services/login.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { RegisterService } from 'src/app/_services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css']
})
export class EditInfoComponent implements OnInit {
  editInfoForm: FormGroup;
  importerInfo: IImporterInfo;
  nidFile: any;
  public loading = false;

  constructor(
    private importerService: ImporterInfoService,
    private loginService: LoginService,
    private alertify: AlertifyService,
    private registerService: RegisterService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createEditInfoForm();
    this.getImporterInfoById();
    this.importerInfo = {
      address : '',
      contactName: '',
      contactNo: '',
      district: '',
      division: '',
      dlsLicenseNo: '',
      dlsLicenseScan: '',
      dlsLicenseType: '',
      email: '',
      id: 0,
      ircScan: '',
      nidNo: '',
      nidScan: '',
      orgName: '',
      position: '',
      upazila: '',
      userLogin: {
        username: '',
        createdBy: '',
        createdDate: null,
        createdTerminal: '',
        id: 0,
        passwordHash: '',
        passwordSalt: '',
        updatedBy: '',
        updatedDate: null,
        updatedTerminal: '',
        userType: ''
      }
    };
  }
  createEditInfoForm() {
    this.editInfoForm = new FormGroup({
      contactName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      position: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      contactNo : new FormControl('', [Validators.required, Validators.maxLength(20)]),
      email : new FormControl('', [Validators.required, Validators.maxLength(50), Validators.email]),
      nidNo: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      nidScan: new FormControl(''),
      username: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(/.*[a-zA-Z]+.*/)])
    });
  }
  getImporterInfoById() {
    const impId = this.loginService.getEmpOrImpName();
    const imp: IImporterIdDto = {
      importerId: impId
    };
    this.importerService.getImporterInfoById(imp).subscribe(resp => {
      this.importerInfo = resp as IImporterInfo;
      this.editInfoForm.get('contactName').setValue(this.importerInfo.contactName);
      this.editInfoForm.get('position').setValue(this.importerInfo.position);
      this.editInfoForm.get('contactNo').setValue(this.importerInfo.contactNo);
      this.editInfoForm.get('email').setValue(this.importerInfo.email);
      this.editInfoForm.get('nidNo').setValue(this.importerInfo.nidNo);
      this.editInfoForm.get('username').setValue(this.importerInfo.userLogin.username);
    });
  }
  validateNIDFileUpload(file: File) {
    if (file) {
      const fileName = file.name;
      const fileSize = file.size;
      const allowedFile = '.pdf';
      if (fileName.substr(fileName.length - allowedFile.length,
        allowedFile.length).toLowerCase() !== allowedFile.toLowerCase()) {
        return 'invalidFileFormat';
      }
      if (fileSize > 1024000) {
        return 'invalidFileSize';
      }
    }
    return 'fileOk';
  }
  onSelectedNidFile(event) {
    this.loading = true;
    const imp = this.loginService.getEmpOrImpName();
    const f = event.target.files[0];
    const result = this.validateNIDFileUpload(f);
    if (result === 'invalidFileFormat') {
      this.editInfoForm.controls.nidScan.reset();
      this.alertify.error('Invalid File Format');
      return;
    }
    if (result === 'invalidFileSize') {
      this.editInfoForm.controls.nidScan.reset();
      this.alertify.error('Invalid File Size');
      return;
    }
    const nidFormData = new FormData();
    nidFormData.append('nidFile', f);
    this.registerService.updateNidFile(nidFormData, imp).subscribe(resp => {
      this.alertify.success('NID updated successfullt.');
      const impInfo = resp as IImporterInfo;
      this.loading = false;
    }, error => {
        console.log(console.error);
        this.loading = false;
    });
  }
  updateInfo() {
    this.loading = true;
    this.importerInfo.contactName = this.editInfoForm.get('contactName').value;
    this.importerInfo.position = this.editInfoForm.get('position').value;
    this.importerInfo.contactNo = this.editInfoForm.get('contactNo').value;
    this.importerInfo.email = this.editInfoForm.get('email').value;
    this.importerInfo.nidNo = this.editInfoForm.get('nidNo').value;
    this.importerInfo.nidScan = this.editInfoForm.get('nidScan').value;
    this.importerInfo.userLogin.username = this.editInfoForm.get('username').value;
    this.registerService.updateInfo(this.importerInfo).subscribe(resp => {
      this.importerInfo = resp as IImporterInfo;
      this.loading = false;
      this.alertify.success('Importer Info Updated Successfully');
       }, error => {
         this.loading = false;
         this.alertify.error(error.error);
       });
  }
  backToImporterInfo() {
    this.router.navigate(['portal/editimporterinfo']);
  }
}
interface IImporterIdDto {
  importerId: number;
}
interface IImporterInfo {
  id: number;
  orgName: string;
  contactName: string;
  position: string;
  contactNo: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  dlsLicenseType: string;
  dlsLicenseNo: string;
  dlsLicenseScan: string;
  nidNo: string;
  nidScan: string;
  ircScan: string;
  userLogin: IUserLogin;
}
interface IUserLogin {
 id: number;
 username: string;
 passwordHash: string;
 passwordSalt: string;
 createdBy: string;
 createdTerminal: string;
 createdDate: Date;
 updatedBy: string;
 updatedTerminal: string;
 updatedDate: Date;
 userType: string;
}
