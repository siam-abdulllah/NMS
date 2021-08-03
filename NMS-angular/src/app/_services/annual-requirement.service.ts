import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import {map} from 'rxjs/operators';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnualRequirementService {
  baseUrl = environment.apiUrl + 'AnnualRequirement/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  constructor(private http: HttpClient) { }
  saveAnnualRequirementMst(model: any) {
    return this.http.post(this.baseUrl + 'SaveAnnualRequirementMst', model);
  }
  updateAnnualRequirementMst(model: any) {
    return this.http.post(this.baseUrl + 'UpdateAnnualRequirementMst', model);
  }
  submitAnnualRequirement(model: any) {
    return this.http.post(this.baseUrl + 'SubmitAnnualRequirement', model);
  }
  saveAnnualRequirementDtl(model: any) {
      return this.http.post(this.baseUrl + 'SaveAnnualRequirementDtl', model);
  }
  searchAnnualRequirements(model: any) {
    return this.http.post(this.baseUrl + 'GetAnnualRequirementsByImporter', model);
  }
  getAllAnnualRequirementsNew(fltr: any){
    return this.http.post(this.baseUrl + 'GetAllAnnualRequirements', fltr);
  }
  getAllAnnualRequirements(){
    return this.http.get(this.baseUrl + 'GetAllAnnualRequirements');
  }
  getAnnualReqDtlByMstAndImporterId(mst: any) {
    return this.http.post(this.baseUrl + 'GetAnnualReqDtlByMstAndImporterId', mst);
  }
  getImporterInfoByAnnualReq(mst: any) {
    return this.http.post(this.baseUrl + 'GetImporterInfoByAnnualReq', mst);
  }
  IsAnnualRequirementAlreadySubmittedThisYear(model: any) {
    return this.http.post(this.baseUrl + 'IsAnnualRequirementAlreadySubmittedThisYear', model);
  }
  IsAnnualRequirementExist(model: any) {
    return this.http.post(this.baseUrl + 'IsAnnualRequirementExist', model);
  }
}
