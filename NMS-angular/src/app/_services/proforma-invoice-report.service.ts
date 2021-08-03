import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Alert } from 'selenium-webdriver';
// import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProformaInvoiceReportService {
  baseUrl = environment.apiUrl + 'ProformaReport/';
  constructor(
      private http: HttpClient
    ) { }

    getDateWiseProformaByImporter(model: any) {
      return this.http.post(this.baseUrl + 'GetDateWiseProformaByImporter', model);
    }
    getImporterWiseCurrentYearProforma(model: any) {
      return this.http.post(this.baseUrl + 'GetImporterWiseCurrentYearProforma', model);
    }
    getCurrentYearProformaInfo(model: any) {
      return this.http.post(this.baseUrl + 'GetCurrentYearProformaInfo', model);
    }
    getDateWiseProformaInfos(model: any) {
      return this.http.post(this.baseUrl + 'GetDateWiseProformaInfos', model);
    }

}
