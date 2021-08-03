import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ImporterDashBoardService {

  baseUrl = environment.apiUrl + 'Dashboard/';
  constructor(private http: HttpClient) { }
  getDashboardInfo(model: any) {
    return this.http.post(this.baseUrl + 'GetImporterDashboardInfo', model);
  }
}
