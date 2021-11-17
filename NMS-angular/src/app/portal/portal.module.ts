import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { PortalComponent } from './portal.component';
import { PortalRoutingModule } from './portal-routing.module';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { ImporterDashboardComponent } from '../importer-dashboard/importer-dashboard.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AnnualRequirementComponent } from '../annual-requirement/annual-requirement.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule} from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeesComponent } from '../employee/create-employee/employees.component';
import { CreateEditEmployeeModalComponent } from '../employee/create-employee/create-edit-employee-modal.component';
import { PaginatorModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { ProformaInvoiceComponent } from '../proforma-invoice/proforma-invoice.component';
import { ViewEmployeeModalComponent } from '../employee/create-employee/view-employee-modal-component.component';
import { ImporterManagementComponent } from '../importer/importer-management/importer-management.component';
import { ViewImporterModalComponent } from '../importer/importer-management/view-importer-modal.component';
import { RoleManagementComponent } from '../role-management/role-management.component';
import { RoleComponent } from '../role-management/role/role.component';
import { UserRoleAssignComponent } from '../role-management/user-role-assign/user-role-assign.component';
import { CreateEditRoleModalComponent } from '../role-management/role/create-edit-role-modal.component';
import { CreateEditUserRoleAssignModalComponent } from '../role-management/user-role-assign/create-edit-user-role-assign-modal.component';
import { UserLookupTableModalComponent } from '../lookUpTabelModals/user-lookup-table-modal.component';
import { RoleLookupTableModalComponent } from '../lookUpTabelModals/role-lookup-table-modal.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { ProformaInvoiceApprovalComponent } from '../proforma-invoice-approval/proforma-invoice-approval.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NocReportComponent, RoundPipe } from '../noc-report/noc-report.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProformaInvoiceLookupTableModalComponent } from '../lookUpTabelModals/proforma-invoice-lookup-table-modal.component';
import {DatePipe} from '@angular/common';
import { ProformaInvoiceReportComponent } from '../proforma-invoice-report/proforma-invoice-report.component';
import { ProformaApprovalSummaryReportComponent } from '../proforma-approval-summary-report/proforma-approval-summary-report.component';
import { EditImporterInfoComponent } from '../importer/edit-importer-info/edit-importer-info.component';
import { CurrencyRateComponent } from '../currency-rate/currency-rate.component';
import { CreateOrEditCurrencyModalComponent } from '../currency-rate/create-or-edit-currency-modal.component';
import { EditInfoComponent } from '../importer/edit-info/edit-info.component';
import { ChangePasswordComponent } from '../importer/change-password/change-password.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditEmployeeInfoComponent } from '../employee/create-employee/edit-employee-info/edit-employee-info.component';
import { AnnualRequirementLookupTableModalComponent } from '../lookUpTabelModals/annual-requirement-lookup-table-modal.component';

@NgModule({
  imports: [
    CommonModule,
    //Ashiq added
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    ModalModule,
	  TabsModule,
	  TooltipModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TableModule,
    PaginatorModule,
    InternationalPhoneNumberModule,
    NgMultiSelectDropDownModule,

    //
    HttpClientModule,
    PortalRoutingModule,
    ReactiveFormsModule,
    NgxLoadingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
  ],
  declarations: [
    PortalComponent,
    AdminDashboardComponent,
    ImporterDashboardComponent,
    PageNotFoundComponent,
    AnnualRequirementComponent,
    CreateEditEmployeeModalComponent,
    EmployeesComponent,
    ViewEmployeeModalComponent,
    ProformaInvoiceComponent,
    ImporterManagementComponent,
    ViewImporterModalComponent,
    RoleManagementComponent,
    RoleComponent,
    UserRoleAssignComponent,
    CreateEditRoleModalComponent,
    CreateEditUserRoleAssignModalComponent,
    UserLookupTableModalComponent,
    RoleLookupTableModalComponent,
    AnnualRequirementLookupTableModalComponent,
    ProformaInvoiceApprovalComponent,
    NocReportComponent,
    ProformaInvoiceLookupTableModalComponent,
    ProformaInvoiceReportComponent,
    ProformaApprovalSummaryReportComponent,
    EditImporterInfoComponent,
    CurrencyRateComponent,
    CreateOrEditCurrencyModalComponent,
    EditInfoComponent,
    ChangePasswordComponent,
    EditEmployeeInfoComponent,
    RoundPipe 
  ],
  providers: [DatePipe]
})
export class PortalModule { }
