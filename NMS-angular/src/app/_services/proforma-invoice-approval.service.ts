import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
// import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProformaInvoiceApprovalService {
  baseUrl = environment.apiUrl + 'ProformaInvoiceApproval/';
  baseUrl2 = environment.apiUrl + 'ProformaInvoiceReport/';
  constructor(
      private http: HttpClient,
      private loginService: LoginService
    ) { }
    GetDateWiseSubmittedProformaInvoice(dateRange: any) {
        return this.http.post(this.baseUrl + 'GetDateWiseSubmittedProformaInvoice', dateRange);
    }
    GetAllPendingPorformaInvoices() {
      return this.http.get(this.baseUrl + 'GetAllPendingPorformaInvoices');
    }
    ApproveProformaInvoice(dtls: any) {
      return this.http.post(this.baseUrl + 'ApproveProformaInvoice', dtls);
    }
    RejectProformaInvoice(dtls: any) {
      return this.http.post(this.baseUrl + 'RejectProformaInvoice', dtls);
    }
    //Ashiq added
    getDateWiseApprovalProformaInvoice(dateRange: any){
      return this.http.post(this.baseUrl + 'GetDateWiseApprovalProformaInvoice', dateRange);
    }
    getDateWiseProformaByImporter(model: any) {
      return this.http.post(this.baseUrl2 + 'GetDateWiseProformaByImporter', model);
  }
}
