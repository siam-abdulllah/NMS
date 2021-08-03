import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ProformaInvoiceApprovalService } from '../_services/proforma-invoice-approval.service';
import { FileDownloadService } from '../helpers/file-download.service';
import { AlertifyService } from '../_services/alertify.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { timeout } from 'q';

@Component({
  selector: 'app-proforma-invoice-approval',
  templateUrl: './proforma-invoice-approval.component.html',
  styleUrls: ['./proforma-invoice-approval.component.css']
})
export class ProformaInvoiceApprovalComponent implements OnInit {
  @ViewChild('piInfoDetailModal', { static: false }) piInfoDetailModal: TemplateRef<any>;
  @ViewChild('piApprovalModal', { static: false }) piApprovalModal: TemplateRef<any>;
  public loading = false;
  modalRef: BsModalRef;
  proformaApprovalSearchForm: FormGroup;
  bsValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  porformaInfos: IProformaInfoDto[];
  proformaInfo: IProformaInfoDto;
  fileDownloadInitiated: boolean;
  editedProformaInfo: IProformaInfoDto;
  baseUrl = environment.apiUrl + 'ProformaInvoice/';
  searchText = '';
  p: any = 1;
  apvAmtValidationErrorMsg=false;
  constructor(
    private proformaApprovalService: ProformaInvoiceApprovalService,
    private modalService: BsModalService,
    private fileDownloadService: FileDownloadService,
    private alertify: AlertifyService,
    private http: HttpClient,

    ) {
   }

  ngOnInit() {
    this.createProformaApprovalSearchForm();
    this.GetAllPendingPorformaInvoices();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue'}, { dateInputFormat: 'DD/MM/YYYY'});
    this.bsValue = new Date();
   // this.proformaApprovalSearchForm.get('toDate').setValue(this.bsValue);
  }
  createProformaApprovalSearchForm() {
    this.proformaApprovalSearchForm = new FormGroup({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      isPending: new FormControl(false)
    });
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
        keyboard: false,
        class: 'modal-lg',
        ignoreBackdropClick: true
    });
  }

  //
  DownloadPiFile(fname: string) {
    this.fileDownloadInitiated = true;
    return this.http.get(this.baseUrl + 'DownloadPiFile/' + fname, { responseType: 'arraybuffer' })
      .subscribe((result: any) => {
        if (result.type !== 'text/plain') {
          var file = new Blob([result], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          //const blob = new Blob([result]);
          //window.open(URL.createObjectURL(blob));
          //const saveAs = require('file-saver');
          //const file = 'proforma_invoice_' + fname;
         //saveAs(blob, file);
          //this.fileDownloadInitiated = false;
        } else {
          this.fileDownloadInitiated = false;
          alert('File not found in Blob!');
        }
      }, error => {
        console.log(error);
      });
  }
  // //

  // DownloadPiFile(fname: string) {
  //   this.fileDownloadInitiated = true;
  //   return this.http.get(this.baseUrl + 'DownloadPiFile/' + fname, { responseType: 'blob' })
  //     .subscribe((result: any) => {
  //       if (result.type !== 'text/plain') {
  //         
  //         const blob = new Blob([result]);
  //         //const fileURL = URL.createObjectURL(blob);
  //         //window.open(fileURL, '_blank');

  //         const saveAs = require('file-saver');
  //         const file = 'proforma_invoice_' + fname;
  //         saveAs(blob, file);
  //         this.fileDownloadInitiated = false;
  //       } else {
  //         this.fileDownloadInitiated = false;
  //         alert('File not found in Blob!');
  //       }
  //     }, error => {
  //       console.log(error);
  //     });
  // }
  DownloadLitFile(fname: string) {
    this.fileDownloadInitiated = true;
    return this.http.get(this.baseUrl + 'DownloadPiFile/' + fname, { responseType: 'arraybuffer' })
      .subscribe((result: any) => {
        if (result.type !== 'text/plain') {
          var file = new Blob([result], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          // const blob = new Blob([result]);
          // const saveAs = require('file-saver');
          // const file = 'literature_review_' + fname;
          // saveAs(blob, file);
          // this.fileDownloadInitiated = false;
        } else {
          this.fileDownloadInitiated = false;
          alert('File not found in Blob!');
        }
      }, error => {
        console.log(error);
      });
  }
  DownloadTestFile(fname: string) {
    this.fileDownloadInitiated = true;
    return this.http.get(this.baseUrl + 'DownloadPiFile/' + fname, { responseType: 'arraybuffer' })
      .subscribe((result: any) => {
        if (result.type !== 'text/plain') {
          var file = new Blob([result], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          // const blob = new Blob([result]);
          // const saveAs = require('file-saver');
          // const file = 'test_report_' + fname;
          // saveAs(blob, file);
          // this.fileDownloadInitiated = false;
        } else {
          this.fileDownloadInitiated = false;
          alert('File not found in!');
        }
      }, error => {
        console.log(error);
      });
  }
  DownloadOtherFile(fname: string) {
    if (fname === '' || fname === undefined || fname === null) {
      this.alertify.warning('No File Found');
    }
    this.fileDownloadInitiated = true;
    return this.http.get(this.baseUrl + 'DownloadPiFile/' + fname, { responseType: 'arraybuffer' })
      .subscribe((result: any) => {
        if (result.type !== 'text/plain') {
          var file = new Blob([result], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          // const blob = new Blob([result]);
          // const saveAs = require('file-saver');
          // const file = 'other_doc_' + fname;
          // saveAs(blob, file);
          // this.fileDownloadInitiated = false;
        } else {
          this.fileDownloadInitiated = false;
          this.alertify.warning('File not found in Blob!');
        }
      }, error => {
        console.log(error);
      });
  }
  GetAllPendingPorformaInvoices() {
    this.proformaApprovalService.GetAllPendingPorformaInvoices().subscribe(resp => {
      
      this.porformaInfos = resp as IProformaInfoDto[];
    }, error => {
      console.log(error);
    });
  }
  GetDateWiseSubmittedProformaInvoice() {
    this.loading = true;
    const proformaApprovalDateRange: IProformaApprovalDateRangeDto = {
      fromDate: this.proformaApprovalSearchForm.value.fromDate,
      toDate: this.proformaApprovalSearchForm.value.toDate,
      isPending: this.proformaApprovalSearchForm.value.isPending
    };
    this.proformaApprovalService.GetDateWiseSubmittedProformaInvoice(proformaApprovalDateRange).subscribe(resp => {
      this.porformaInfos = resp as IProformaInfoDto[];
      this.loading = false;
    }, error => {
      console.log(error);
    });
  }
  showDetails(p: IProformaInfoDto) {
    this.openModal(this.piInfoDetailModal);
    this.proformaInfo = p;
  }
  proformaApproval(p: IProformaInfoDto) {
    this.editedProformaInfo = p;
    this.openModal(this.piApprovalModal);
    this.proformaInfo = p;
    this.porformaInfos.find(
      item => item.id === p.id
    // tslint:disable-next-line: only-arrow-functions
    ).proformaInvoiceDtls.forEach(function(item, index) {
      if(item.totalAmount>0)
      {
        item.approvedAmount=item.totalAmount;
      }
      if(item.noOfUnits>0)
      {
        item.approvedAmount=item.noOfUnits;
      }
     // item.approvedAmount = item.approvedAmount == null ? item.totalAmount : item.approvedAmount;
    });
  }
  apvAmtValidate(apvAmt:any,noOfUnit:any,totalAmt:any){
    
    this.apvAmtValidationErrorMsg=false;
    if( apvAmt!=""){
      if((apvAmt>noOfUnit || apvAmt <= 0)
       && ( apvAmt > totalAmt || apvAmt <= 0))
       {
        this.alertify.error('Invalid Approval Amount');
        this.apvAmtValidationErrorMsg=true;
        }
    
       }

  }
  approve(a: IProformaInvoiceDtl) {
    
    if ((a.approvedAmount > a.totalAmount || a.approvedAmount <= 0)
       && ( a.approvedAmount > a.noOfUnits || a.approvedAmount <= 0)) {
      this.alertify.error('Invalid Approval Amount');
      return false;
    }
    // if ( a.approvedAmount > a.noOfUnits || a.approvedAmount <= 0) {
    //   this.alertify.error('Invalid Approval Amount');
    //   return false;
    // }
    this.loading = true;
    const pi = this.porformaInfos.filter(x => x.proformaInvoiceDtls.find(
      item => item.id === a.id
    ));
    this.porformaInfos.find(
      item => item.id === pi[0].id
    // tslint:disable-next-line: only-arrow-functions
    ).proformaInvoiceDtls.forEach(function(item, index){
      if (item.id === a.id) {
        item.approvalStatus = true;
        item.approvedAmount = a.approvedAmount;
      }
    });
    this.proformaApprovalService.ApproveProformaInvoice(a).subscribe(resp => {
      const dtls = resp as IProformaInvoiceDtl;
      this.loading = false;
      this.alertify.success('Proforma approval successfull');
    }, error => {
      console.log(error);
      this.alertify.error('Proforma approval failed');
    });
  }
  reject(a: IProformaInvoiceDtl) {
    this.loading = true;
    const pi = this.porformaInfos.filter(x => x.proformaInvoiceDtls.find(
      item => item.id === a.id
    ));
    this.porformaInfos.find(
      item => item.id === pi[0].id
    // tslint:disable-next-line: only-arrow-functions
    ).proformaInvoiceDtls.forEach(function(item, index){
      if (item.id === a.id) {
        item.approvalStatus = false;
        item.approvedAmount = 0;
      }
    });
    this.proformaApprovalService.RejectProformaInvoice(a).subscribe(resp => {
      const dtls = resp as IProformaInvoiceDtl;
      this.loading = false;
      this.alertify.success('Proforma reject successfull');
    }, error => {
      console.log(error);
      this.alertify.error('Proforma reject failed');
    });
  }
  updateProformaInfoTable() {
    const proAppvalDateRange: IProformaApprovalDateRangeDto = {
      fromDate: this.proformaApprovalSearchForm.value.fromDate === '' ? undefined : this.proformaApprovalSearchForm.value.fromDate,
      toDate: this.proformaApprovalSearchForm.value.toDate === '' ? undefined : this.proformaApprovalSearchForm.value.toDate,
      isPending: this.proformaApprovalSearchForm.value.isPending
    };
    if (proAppvalDateRange.fromDate === undefined || proAppvalDateRange.fromDate == null ||
      proAppvalDateRange.toDate === undefined || proAppvalDateRange.toDate == null  ) {
      this.GetAllPendingPorformaInvoices();
    } else {
      this.proformaApprovalService.GetDateWiseSubmittedProformaInvoice(proAppvalDateRange).subscribe(resp => {
        this.porformaInfos = resp as IProformaInfoDto[];
      });
    }
  }
  destroyApprovalModal() {
    this.updateProformaInfoTable();
    this.modalRef.hide();
  }

  resetDateRange() {
    this.proformaApprovalSearchForm.reset();
    this.searchText = '';
    this.p = 1;
  }
}
interface IProformaApprovalDateRangeDto {
  fromDate: Date | undefined | null;
  toDate: Date | undefined | null;
  isPending: boolean;
}
interface IProformaInfoDto {
  id: number;
  applicationNo: number;
  proformaInvoiceNo: string;
  proformaDate: Date;
  submissionDate: Date;
  currency: string;
  countryOfOrigin: number;
  portOfLoading: string;
  portOfEntry: string;
  piScan: string;
  litScan: string;
  testReport: string;
  otherDoc: string;
  confirmation: boolean;
  approvalDate: Date;
  approvalStatus: boolean;
  importerId: number;
  importerInfo: IImporterInfo;
  proformaInvoiceDtls: IProformaInvoiceDtl[];
}
interface IProformaInvoiceMst {
  id: number;
  applicationNo: number;
  proformaInvoiceNo: string;
  proformaDate: Date;
  submissionDate: Date;
  currency: string;
  countryOfOrigin: number;
  portOfLoading: string;
  portOfEntry: string;
  piScan: string;
  litScan: string;
  testReport: string;
  otherDoc: string;
  confirmation: boolean;
  importerId: number;
  approvalDate: Date;
  approvalStatus: boolean;
}
interface IProformaInvoiceDtl {
  id: number;
  mstId: number;
  prodName: string;
  prodType: string;
  hsCode: string;
  manufacturer: string;
  packSize: string;
  noOfUnits: number;
  unitPrice: number;
  totalPrice: number;
  totalPriceInBdt: number;
  exchangeRate: number;
  totalAmount: number;
  approvalStatus: boolean;
  approvedBy: number;
  remarks: string;
  approvedAmount: number;
}
interface IImporterInfo {
  id: number;
  orgName: string;
  contactName: string;
  position: string;
  contactNo: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  dlsLicenseType: string;
  dlsLicenseNo: string;
  dlsLicenseScan: string;
  nidNo: string;
  nidScan: string;
  ircScan: string;
  username: string;
  password: string;
}
