import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl = environment.apiUrl + 'EmployeeInfoes/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  constructor(private http: HttpClient) { }

  saveEmployeeInfoes(model: any) {
    return this.http.post(this.baseUrl + 'PostEmployeeInfo', model);
  }

  getEmployeeInfoes(fltr: any) {
    return this.http.post(this.baseUrl + 'GetEmployeeInfos',fltr);
  }

  
  getEmployeeInfoById(id: number) {
    return this.http.get(this.baseUrl + id);
  }
  updateEmployeeInfoes(model: any, id: number) {
    return this.http.put(this.baseUrl + id, model);
  }
  deleteEmployeeInfoes(id: number) {
    return this.http.delete(this.baseUrl + id);
  }

}

