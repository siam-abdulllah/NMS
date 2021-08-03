import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  baseUrl1 = environment.apiUrl + 'currency/';
  baseUrl = environment.apiUrl + 'CurrencyRate/';

  jwtHelper = new JwtHelperService();
  decodedToken: any;
  constructor(private http: HttpClient) { }
  getCurrency() {
    return this.http.get(this.baseUrl1 + 'getcurrency');
  }

  createCurrencyRate(model: any) {
    return this.http.post(this.baseUrl + 'CreateCurrencyRate', model);
  }

  getAllCurrencyRates(fltr: any) {
    return this.http.post(this.baseUrl + 'GetAllCurrencyRates', fltr);
  }

  getCurrencyRateById(id: number) {
    return this.http.get(this.baseUrl + 'GetCurrencyRate/' + id);
  }
  editCurrencyRate(model: any, id: number) {
    return this.http.put(this.baseUrl + 'EditCurrencyRate/' + id, model);
  }
  deleteCurrencyRate(id: number) {
    return this.http.delete(this.baseUrl + 'DeleteCurrencyRate/' + id);
  }
}
