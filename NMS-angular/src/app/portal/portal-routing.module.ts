import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PortalComponent } from './portal.component';
import { ImporterDashboardComponent } from '../importer-dashboard/importer-dashboard.component';
import { ImporterRoleGuard } from '../_guard/importerRole.guard';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AnnualRequirementComponent } from '../annual-requirement/annual-requirement.component';
import { ProformaInvoiceComponent } from '../proforma-invoice/proforma-invoice.component';
import { EmployeesComponent } from '../employee/create-employee/employees.component';
import { CreateEditEmployeeModalComponent } from '../employee/create-employee/create-edit-employee-modal.component';
import { ImporterManagementComponent } from '../importer/importer-management/importer-management.component';
import { RoleManagementComponent } from '../role-management/role-management.component';
import { AdminRoleGuard } from '../_guard/adminRole.guard';
import { ProformaInvoiceApprovalComponent } from '../proforma-invoice-approval/proforma-invoice-approval.component';
import { NocReportComponent } from '../noc-report/noc-report.component';
import { ProformaInvoiceReportComponent } from '../proforma-invoice-report/proforma-invoice-report.component';
import { ProformaApprovalSummaryReportComponent } from '../proforma-approval-summary-report/proforma-approval-summary-report.component';
import { EditImporterInfoComponent } from '../importer/edit-importer-info/edit-importer-info.component';
import { CurrencyRateComponent } from '../currency-rate/currency-rate.component';
import { SuperAdminRoleGuard } from '../_guard/superAdminRole.guard';
import { EditInfoComponent } from '../importer/edit-info/edit-info.component';
import { ChangePasswordComponent } from '../importer/change-password/change-password.component';
import { EditEmployeeInfoComponent } from '../employee/create-employee/edit-employee-info/edit-employee-info.component';


const potalRoutes: Routes = [
    {
        path: 'portal',
        component: PortalComponent,
        children: [
            {path: '', redirectTo: 'importer', pathMatch: 'full'},
            {path: 'importer', component: ImporterDashboardComponent, canActivate: [ImporterRoleGuard]},
            {path: 'admin', component: AdminDashboardComponent, canActivate: [AdminRoleGuard]},
            {path: 'pagenotfound', component: PageNotFoundComponent },
            {path: 'annualrequirement', component: AnnualRequirementComponent, canActivate: [ImporterRoleGuard] },
            {path: 'proformainvoice', component: ProformaInvoiceComponent, canActivate: [ImporterRoleGuard]},
            {path: 'createemployee', component: CreateEditEmployeeModalComponent, canActivate: [AdminRoleGuard]},
            {path: 'employee', component: EmployeesComponent, canActivate: [SuperAdminRoleGuard]},
            {path: 'importermanagement', component: ImporterManagementComponent, canActivate: [AdminRoleGuard]},
            {path: 'rolemanagement', component: RoleManagementComponent, canActivate: [SuperAdminRoleGuard]},
            {path: 'currencyRate', component: CurrencyRateComponent, canActivate: [AdminRoleGuard]},
            {path: 'proformaapproval', component: ProformaInvoiceApprovalComponent, canActivate: [AdminRoleGuard]},
            {path: 'nocReport', component: NocReportComponent, canActivate: [AdminRoleGuard]},
            {path: 'proformainvoicereport', component: ProformaInvoiceReportComponent, canActivate: [ImporterRoleGuard]},
            {path: 'proformainvoiceapprovalreport', component: ProformaApprovalSummaryReportComponent, canActivate: [AdminRoleGuard]},
            {path: 'editimporterinfo', component: EditImporterInfoComponent, canActivate: [ImporterRoleGuard]},
            {path: 'editemployeeinfo', component: EditEmployeeInfoComponent },
            {path: 'editinfo', component: EditInfoComponent, canActivate: [ImporterRoleGuard]},
            {path: 'chngpass', component: ChangePasswordComponent, canActivate: [ImporterRoleGuard]},
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(potalRoutes)],
    exports: [RouterModule]
})
export class PortalRoutingModule {}
