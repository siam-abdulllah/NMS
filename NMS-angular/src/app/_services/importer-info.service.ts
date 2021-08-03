import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImporterInfoService {

  baseUrl = environment.apiUrl + 'ImporterInfo/';
  decodedToken: any;
  constructor(private http: HttpClient) { }

  getAllImporterInfos(fltr: any) {
    return this.http.post(this.baseUrl + 'GetAllImporterInfos', fltr);
  }
  getAllImporterInfosPdf() {
    return this.http.get(this.baseUrl + 'GetAllImporterInfosPdf');
  }
  getImportersToExcel() {
    return this.http.get(this.baseUrl + 'GetImportersToExcel');
  }
  getImporterInfoById(model: any) {
    return this.http.post(this.baseUrl + 'getImporterInfoById', model);
  }
  getdeleteImporter(importerId: any){
    return this.http.delete(this.baseUrl + 'DeleteImporter/'+ importerId);
  }
}
