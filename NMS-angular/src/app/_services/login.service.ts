import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import {map} from 'rxjs/operators';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  constructor(private http: HttpClient) { }
    login(model: any) {
      return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
            const user = response;
            if (user) {
              localStorage.setItem('token', user.token);
              this.decodedToken = this.jwtHelper.decodeToken(user.token);
            }
        })
      );
    }
    loggedIn() {
      const token = localStorage.getItem('token');
      return !this.jwtHelper.isTokenExpired(token);
    }
    getUserId() {
      const token = localStorage.getItem('token');
      const r =  this.jwtHelper.decodeToken(token);
      return r.nameid;
    }
    getUserRole() {
      const token = localStorage.getItem('token');
      const r =  this.jwtHelper.decodeToken(token);
      return r.role;
    }
    getUserName() {
      const token = localStorage.getItem('token');
      const m =  this.jwtHelper.decodeToken(token);
      return m.unique_name;
    }
    getOrganizationName() {
      const token = localStorage.getItem('token');
      const r =  this.jwtHelper.decodeToken(token);
      return r.family_name;
    }
    getPosition() {
      const token = localStorage.getItem('token');
      const r =  this.jwtHelper.decodeToken(token);
      return r.email;
    }
    getEmpOrImpName() {
      const token = localStorage.getItem('token');
      const r =  this.jwtHelper.decodeToken(token);
      return r.certserialnumber;
    }
  }
