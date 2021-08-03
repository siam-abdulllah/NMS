import { Component, OnInit } from '@angular/core';
import { ImporterInfoService } from 'src/app/_services/importer-info.service';
import { LoginService } from 'src/app/_services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-importer-info',
  templateUrl: './edit-importer-info.component.html',
  styleUrls: ['./edit-importer-info.component.css']
})
export class EditImporterInfoComponent implements OnInit {
  importerInfo: IImporterInfo;
  constructor(
    private importerService: ImporterInfoService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
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
  getImporterInfoById() {
    const impId = this.loginService.getEmpOrImpName();
    const imp: IImporterIdDto = {
      importerId: impId
    };
    this.importerService.getImporterInfoById(imp).subscribe(resp => {
      this.importerInfo = resp as IImporterInfo;
    });
  }
  changePassword() {
    this.router.navigate(['portal/chngpass']);
  }
  editImporterInfo() {
    this.router.navigate(['portal/editinfo']);
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
interface IUserLogin{
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
