import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import { LoginModule } from './login/login.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterService } from './_services/register.service';
import { JwtModule } from '@auth0/angular-jwt';
import { PortalModule } from './portal/portal.module';
import { ImporterRoleGuard } from './_guard/importerRole.guard';
import { AdminRoleGuard } from './_guard/adminRole.guard';
import { SuperAdminRoleGuard } from './_guard/superAdminRole.guard';
import { PortalRoutingModule } from './portal/portal-routing.module';
import { LoginService } from './_services/login.service';
import { LoginRoutingModule } from './login/login-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { CurrencyService } from './_services/currency.service';
import { AnnualRequirementService } from './_services/annual-requirement.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ServiceProxyModule } from './shared/service-proxies/service-proxy.module';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { ImporterDashBoardService } from './_services/importer-dashboard.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AdminDashboardService } from './_services/admin-dashboard.service';
import { ProformaInvoiceReportService } from './_services/proforma-invoice-report.service';
import {NgSelectModule} from '@ng-select/ng-select';
export function tokenGetter() {
   return localStorage.getItem('token');
}
@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      NgxLoadingModule.forRoot({}),
      RouterModule,
      HttpClientModule,
      AppRoutingModule,
      //Ashiq -added
      FormsModule,
      NgSelectModule,
      ModalModule.forRoot(),
      TabsModule.forRoot(),
      TooltipModule,
      BsDropdownModule.forRoot(),
      TableModule,
      PaginatorModule,
      AutoCompleteModule,
      ServiceProxyModule,
      //
      InternationalPhoneNumberModule,
      NgMultiSelectDropDownModule.forRoot(),
      PortalRoutingModule,
      LoginModule,
      PortalModule,
      LoginRoutingModule,
      PortalRoutingModule,
      ModalModule.forRoot(),
      JwtModule.forRoot({
          config: {
             tokenGetter,
             whitelistedDomains: ['localhost:5000', 'localhost:41682', 'localhost:2930',
             'localhost:49815', 'localhost:8416', 'localhost:86', 'localhost:3451',
             'localhost:20396', 'localhost:82', 'localhost:29312'],
             blacklistedRoutes: ['localhost:5000/api/auth', 'localhost:41682/api/auth', 'localhost:3451/api/auth',
             'localhost:2930/api/auth', 'localhost:49815/api/auth', 'localhost:49815/api/auth',
             'localhost:86/api/auth', 'localhost:82/api/auth', 'localhost:20396/api/auth', 'localhost:29312/api/auth']
         }
      })
   ],
   providers: [RegisterService, ImporterRoleGuard, AdminRoleGuard, SuperAdminRoleGuard, LoginService, CurrencyService,
      AnnualRequirementService, ImporterDashBoardService, AdminDashboardService, ProformaInvoiceReportService],
   bootstrap: [
      AppComponent
   ],
   exports: [
    ]
})
export class AppModule { }
