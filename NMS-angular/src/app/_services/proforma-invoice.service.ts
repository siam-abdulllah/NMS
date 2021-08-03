import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
// import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProformaInvoiceService {
  baseUrl = environment.apiUrl + 'AnnualRequirement/';
  baseUrl2 = environment.apiUrl + 'ProformaInvoice/';
  constructor(
      private http: HttpClient,
      private loginService: LoginService) { }
  getProductListFromAnnualReq(importerDto: any) {
    return this.http.post(this.baseUrl2 + 'GetAnnReqProdDtlsByImp', importerDto);
  }
  getAnnReqProdDtlsByImpEditMode(remainingAmountforPIProductDto: any) {
    return this.http.post(this.baseUrl2 + 'GetAnnReqProdDtlsByImpEditMode', remainingAmountforPIProductDto);
  }
  getCrntYearTotlProformaInvAmtByProd(proformaInvProdTotalAmtDto: any) {
    return this.http.post(this.baseUrl2 + 'GetCrntYearTotlProformaInvAmtByProd', proformaInvProdTotalAmtDto);
  }
  saveProformaInvoiceMst(proMst: any) {
    return this.http.post(this.baseUrl2 + 'SaveProformaInvoiceMst', proMst);
  }
  saveProformaInvoiceDtl(model: any) {
    return this.http.post(this.baseUrl2 + 'SaveProformaInvoiceDtl', model);
  }
  UploadProformaFiles(formData: FormData, id: number) {
    return this.http.post(this.baseUrl2 + 'UploadProformaFiles/' + id, formData);
  }
  getAllProformaInvoiceMstByUser(importer: any) {
    return this.http.post(this.baseUrl2 + 'getAllProformaInvoiceMstByUser', importer);
  }
  getProformaDtlsByProformaMst(proformaMstIdDto: any) {
    return this.http.post(this.baseUrl2 + 'getProformaDtlsByProformaMst', proformaMstIdDto);
  }
  updatePiFile(formData: FormData, poMstId: number) {
    return this.http.post(this.baseUrl2 + 'UpdatePiFile/' + poMstId, formData);
  }
  updateLitFile(formData: FormData, poMstId: number) {
    return this.http.post(this.baseUrl2 + 'UpdateLitFile/' + poMstId, formData);
  }
  updateTestFile(formData: FormData, poMstId: number) {
    return this.http.post(this.baseUrl2 + 'UpdateTestFile/' + poMstId, formData);
  }
  updateOtherFile(formData: FormData, poMstId: number) {
    return this.http.post(this.baseUrl2 + 'UpdateOtherFile/' + poMstId, formData);
  }
  updateProformaInvoiceMst(proMstUpdtDto: any) {
    return this.http.post(this.baseUrl2 + 'UpdateProformaInvoiceMst', proMstUpdtDto);
  }
  updateProformaInvoiceDtl(proforInDtlUpdtDto: any, mstId: number) {
    return this.http.post(this.baseUrl2 + 'UpdateProformaInvoiceDtl/' + mstId, proforInDtlUpdtDto);
  }
  submitProformaInvoice(porMstId: any) {
    return this.http.post(this.baseUrl2 + 'SubmitProformaInvoice', porMstId);
  }
  IsProformaSubmitted(porMst: any) {
    return this.http.post(this.baseUrl2 + 'IsProformaSubmitted', porMst);
  }
  ProformaInvoiceMstReport(poMst: any) {
    return this.http.post(this.baseUrl2 + 'ProformaInvoiceMstReport', poMst);
  }
  proformaInvoiceNoAvailable(model: any) {
    return this.http.post(this.baseUrl2 + 'IsProformaInvoiceNoExist', model);
  }
}
