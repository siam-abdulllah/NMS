import { Component, OnInit } from '@angular/core';
import { LoginService } from '../_services/login.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { $ } from 'protractor';
import { ImporterDashBoardService } from '../_services/importer-dashboard.service';

@Component({
  selector: 'app-importer-dashboard',
  templateUrl: './importer-dashboard.component.html',
  styleUrls: ['./importer-dashboard.component.css']
})
export class ImporterDashboardComponent implements OnInit {
  importerDashboardInfo: IImporterDashboardInfo;
  constructor(
    private alertify: AlertifyService,
    private router: Router,
    private importerDashbardService: ImporterDashBoardService,
    private loginService: LoginService) { }

  ngOnInit() {
    this.getDashboardInfo();
    this.importerDashboardInfo = {
      pendingProformaApproval: 0,
      approvedProforma: 0,
      rejectedProduct: 0,
      totalProforma: 0
    };
  }
  getDashboardInfo() {
    const imdId = this.loginService.getEmpOrImpName();
    const imp: IImporterIdDto = {
      importerId: imdId
    };
    this.importerDashbardService.getDashboardInfo(imp).subscribe(resp => {
      this.importerDashboardInfo = resp as IImporterDashboardInfo;
    }, error => {
      console.log(error);
    });
  }
}
interface IImporterIdDto {
  importerId: number;
}
interface IImporterDashboardInfo {
  pendingProformaApproval: number | undefined | null;
  totalProforma: number | undefined | null;
  approvedProforma: number  | undefined | null;
  rejectedProduct: number | undefined | null;
}
