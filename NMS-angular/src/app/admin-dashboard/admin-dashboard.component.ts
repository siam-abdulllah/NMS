import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../_services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminDashboardInfo: IAdminDashboardInfo;
  constructor(
    private adminDashboardService: AdminDashboardService
  ) { }

  ngOnInit() {
    this. getDashboardInfo();
    this.adminDashboardInfo = {
      pendingProformaApproval: 0,
      approvedProforma: 0,
      rejectedProforma: 0,
      totalProforma: 0,
      partialApprovedProforma: 0,
      totalImporter: 0,
      totalEmployee: 0
    };
  }
  getDashboardInfo() {
    this.adminDashboardService.getDashboardInfo().subscribe(resp => {
      this.adminDashboardInfo = resp as IAdminDashboardInfo;
    }, error => {
      console.log(error);
    });
  }
}
interface IAdminDashboardInfo {
  pendingProformaApproval: number | undefined | null;
  totalProforma: number | undefined | null;
  approvedProforma: number  | undefined | null;
  rejectedProforma: number | undefined | null;
  partialApprovedProforma: number | undefined | null;
  totalImporter: number | undefined | null;
  totalEmployee: number | undefined | null;
}
