import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyService } from '../_services/currency.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { AlertifyService } from '../_services/alertify.service';
import { ProformaInvoiceService } from '../_services/proforma-invoice.service';
import { LoginService } from '../_services/login.service';
import { saveAs } from 'file-saver';
import { read } from 'fs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FileDownloadService } from 'src/app/helpers/file-download.service';
import { IFileDto } from 'src/app/common/FileDto';
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-proforma-invoice',
  templateUrl: './proforma-invoice.component.html',
  styleUrls: ['./proforma-invoice.component.css']
})
export class ProformaInvoiceComponent implements OnInit {
  @ViewChild('proformaInvDtlModal', { static: false }) proformaInvDtlModal: TemplateRef<any>;
  @ViewChild('proformaInvMstSearchModal', { static: false }) proformaInvMstSearchModal: TemplateRef<any>;
  @ViewChild('proformaConfirmModal', { static: false }) proformaConfirmModal: TemplateRef<any>;
  @ViewChild('proformaSubmissionConfirmModal', { static: false }) proformaSubmissionConfirmModal: TemplateRef<any>;
  @ViewChild('annualReqProdModal', { static: false }) annualReqProdModal: TemplateRef<any>;
  proformaInvoiceDtlModalRef: BsModalRef;
  proformaInvMstSearchModalRef: BsModalRef;
  proformaSubmissionConfirmRef: BsModalRef;
  proformaConfirmModalRef: BsModalRef;
  annualReqProdModalRef: BsModalRef;
  proformaInvoiceForm: FormGroup;
  proformaInvoiceDtlForm: FormGroup;
  saveButtonTitle = 'Save';
  proformaUpdateMode = false;
  public loading = false;
  currencies: ICurrency[] = [];
  proformaInvoiceDtls: IProformaInvoiceDtl[] = [];
  proformaInvDtlModalTitle = '';
  addMode = false;
  editMode = false;
  updateProd: IProformaInvoiceDtl;
  annualReqMsts: IAnnualRequirementMst[];
  annProds: IAnnReqProdDtlsForProforDto[] = [];
  exchngDisabled = true;
  proformaInvProdTotalAmtDto: ProfInvTotalAmtDtoByProdDto;
  piScanFile: any;
  litScanFile: any;
  testReportFile: any;
  otherDocFile: any;
  piMstId: number;
  proformaInvoiceMsts: IProformaInvoiceMst[] = [];
  fileDownloadInitiated: boolean;
  totalAmountValidationErrorMsg = false;
  noOfUnitValidationErrorMsg=false;
  totalAmountValidation: IPiTotalAmountValidationDto;
  updateBtnDisable = false;
  submitButtonDisable = true;
  isSubmitted = false;
  baseUrl = environment.apiUrl + 'ProformaInvoice/';
  saveUpdateMsg = '';
  searchText = '';
  p: any = 1;
  pa: any = 1;
  pd: any = 1;
  proformaNoSpinner = false;
  proformaNoOk = false;
  proformaNoNotOk = false;
  proformaNoValidity = false;
  config = {
    keyboard: false,
    class: 'modal-lg',
    ignoreBackdropClick: true
  };
  currentDateString = new Date();
  todayDate = this.currentDateString.getDate() + '/' + (this.currentDateString.getMonth() + 1) + '/' + this.currentDateString.getFullYear();
  //
  //portOfEntry Type
portOfEntrys = [
  {id: 1, name: 'Chittagong/Chattogram' },
  {id: 2, name: 'Sonamasjid'},
  {id: 3, name: 'Benapole'},
  {id: 4, name: 'Mongla'},
  {id: 5, name: 'Hili'},
  {id: 6, name: 'Darshana'},
  {id: 7, name: 'Shahjalal International Airport'},
  {id: 8, name: 'Banglabandha'},
  {id: 9, name: 'Birol'},
  {id: 10, name: 'Rohanpur'},
  {id: 11, name: 'Vomra'},
  {id: 12, name: 'Burimari'}
];
//selectedProductType=1;
//portOfEntry='Chittagong/Chattogram';
selectedportOfEntryId: number;
 //
 remainingAmountUnit : number;
 remainingAmountTon : number;
 bsConfig: Partial<BsDatepickerConfig>;
 bsValue: Date = new Date();
 
  constructor(
    private currencyService: CurrencyService,
    private modalService: BsModalService,
    private alertify: AlertifyService,
    private proformaService: ProformaInvoiceService,
    private loginService: LoginService,
    private http: HttpClient,
    private fileDownloadService: FileDownloadService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.createProformaInvoiceForm();
    this.createProformaInvoiceDtlForm();
    this.getCurrencies();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-green' }, { dateInputFormat: 'DD/MM/YYYY' });
    this.bsValue = new Date();
  }
  resetFilter() {
    this.searchText = '';
  }
  createProformaInvoiceForm() {

    this.proformaInvoiceForm = new FormGroup({
      applicationNo: new FormControl(''),
      proformaInvoiceNo: new FormControl('', [Validators.required]),
      proformaDate: new FormControl(new Date,[Validators.required]),
      submissionDate: new FormControl(''),
      countryOfOrigin: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      portOfLoading: new FormControl('', [Validators.required]),
      portOfEntry: new FormControl('Chittagong/Chattogram',[Validators.required]),
      piScan: new FormControl('', [Validators.required]),
      litScan: new FormControl('', [Validators.required]),
      //testReport: new FormControl('', [Validators.required]),
      testReport: new FormControl(''),
      otherDoc: new FormControl('')
    });
  }
  createProformaInvoiceDtlForm() {
    this.proformaInvoiceDtlForm = new FormGroup({
      prodName: new FormControl('', [
        Validators.required
      ]),
      prodType: new FormControl('', [
        Validators.required,
        Validators.maxLength(500)
      ]),
      hsCode: new FormControl('', [
        Validators.required,
        Validators.maxLength(20)
      ]),
      manufacturer: new FormControl('', [
        Validators.required,
        Validators.maxLength(100)
      ]),
      packSize: new FormControl('', [
        Validators.required,
        Validators.maxLength(100)
      ]),
      noOfUnits: new FormControl('', [
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern(/^[0-9]+(.[0-9]{1,2})?$/)
      ]),
      totalAmount: new FormControl('', [
        Validators.required,
        Validators.maxLength(6),
        Validators.pattern(/^[0-9]+(.[0-9]{1,2})?$/)
      ]),
      unitPrice: new FormControl('', [
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern(/^[0-9]+(.[0-9]{1,2})?$/)
      ]),
      exchangeRate: new FormControl('', [Validators.required]),
      totalPrice: new FormControl('', Validators.required),
      totalPriceInBdt: new FormControl('', Validators.required)
    });
  }
  openProformaMstSearchModal(template: TemplateRef<any>) {
    this.proformaInvMstSearchModalRef = this.modalService.show(template, this.config);
  }
  openProformaInvDtlModal(template: TemplateRef<any>) {
    this.proformaInvoiceDtlModalRef = this.modalService.show(template, {
      keyboard: false,
      class: 'modal-lg',
      ignoreBackdropClick: true
    });
  }
  openAnnReqProdModal(template: TemplateRef<any>) {
    this.annualReqProdModalRef = this.modalService.show(template, {
      keyboard: false,
      class: 'modal-lg',
      ignoreBackdropClick: true
    });
  }
  openProformaSaveConfirmModal(template: TemplateRef<any>) {
    this.proformaConfirmModalRef = this.modalService.show(template, {
      keyboard: false,
      class: 'modal-md',
      ignoreBackdropClick: true
    });
  }
  openProformaSubmissionConfirmModal(template: TemplateRef<any>) {
    this.proformaSubmissionConfirmRef = this.modalService.show(template, {
      keyboard: false,
      class: 'modal-md',
      ignoreBackdropClick: true
    });
  }
  getCurrencyRate() {
      const currenc = this.proformaInvoiceForm.value.currency;
      let excngRate: number;
      // tslint:disable-next-line: only-arrow-functions
      this.currencies.forEach( function(item, index) {
        if (item.currency === currenc) {
          excngRate = item.exchangeRate;
        }
      });
      return excngRate;
  }
  validateProformaInvFileUpload(file: File) {
    if (file) {
      const fileName = file.name;
      const fileSize = file.size;
      const allowedFile = '.pdf';
      if (fileName.substr(fileName.length - allowedFile.length,
        allowedFile.length).toLowerCase() !== allowedFile.toLowerCase()) {
        return 'invalidFileFormat';
      }
      if (fileSize > 1024000) {
        return 'invalidFileSize';
      }
    }
    return 'fileOk';
  }
  onSelectedPiFile(event) {
    const f = event.target.files[0];
    const result = this.validateProformaInvFileUpload(f);
    if (result === 'invalidFileFormat') {
      this.proformaInvoiceForm.controls.piScan.reset();
      this.alertify.error('Invalid File Format');
      return;
    }
    if (result === 'invalidFileSize') {
      this.proformaInvoiceForm.controls.piScan.reset();
      this.alertify.error('Invalid File Size');
      return;
    }
    if (this.isSubmitted === true) {
        this.alertify.warning('Proforma Invoice already submitted. can not update file.');
        return;
    }
    if (this.proformaUpdateMode === true) {
      const piFormData = new FormData();
      piFormData.append('piFile', f);
      this.proformaService.updatePiFile(piFormData, this.piMstId).subscribe(resp => {
        this.alertify.success('Proforma Invoice updated successfully.');
        const piMst = resp as IProformaInvoiceMst;
      }, error => {
        console.log(console.error);
      });
      return;
    }
    if (result === 'fileOk') {
      this.piScanFile = f;
    }
  }
  onSelectedLitFile(event) {
    const f = event.target.files[0];
    const result = this.validateProformaInvFileUpload(f);
    if (result === 'invalidFileFormat') {
      this.proformaInvoiceForm.controls.litScan.reset();
      this.alertify.error('Invalid File Format');
      return;
    }
    if (result === 'invalidFileSize') {
      this.proformaInvoiceForm.controls.litScan.reset();
      this.alertify.error('Invalid File Size');
      return;
    }
    if (this.isSubmitted === true) {
      this.alertify.warning('Proforma Invoice already submitted. can not update file.');
      return;
    }
    if (this.proformaUpdateMode === true) {
      const litFormData = new FormData();
      litFormData.append('litFile', f);
      this.proformaService.updateLitFile(litFormData, this.piMstId).subscribe(resp => {
        const piMst = resp as IProformaInvoiceMst;
        this.alertify.success('Literature review updated successfully.');
      }, error => {
        console.log(console.error);
      });
      return;
    }
    if (result === 'fileOk') {
      this.litScanFile = f;
    }
  }
  onSelectedTestFile(event) {
    const f = event.target.files[0];
    const result = this.validateProformaInvFileUpload(f);
    if (result === 'invalidFileFormat') {
      this.proformaInvoiceForm.controls.testReport.reset();
      this.alertify.error('Invalid File Format');
      return;
    }
    if (result === 'invalidFileSize') {
      this.proformaInvoiceForm.controls.testReport.reset();
      this.alertify.error('Invalid File Size');
      return;
    }
    if (this.isSubmitted === true) {
      this.alertify.warning('Proforma Invoice already submitted. can not update file.');
      return;
    }
    if (this.proformaUpdateMode === true) {
      const testFormData = new FormData();
      testFormData.append('testFile', f);
      this.proformaService.updateTestFile(testFormData, this.piMstId).subscribe(resp => {
        const piMst = resp as IProformaInvoiceMst;
        this.alertify.success('Test Report updated successfully');
      }, error => {
        console.log(console.error);
      });
      return;
    }
    if (result === 'fileOk') {
      this.testReportFile = f;
    }
  }
  onSelectedOtherDocFile(event) {
    const f = event.target.files[0];
    const result = this.validateProformaInvFileUpload(f);
    if (result === 'invalidFileFormat') {
      this.proformaInvoiceForm.controls.otherDoc.reset();
      this.alertify.error('Invalid File Format');
      return;
    }
    if (result === 'invalidFileSize') {
      this.proformaInvoiceForm.controls.otherDoc.reset();
      this.alertify.error('Invalid File Size');
      return;
    }
    if (this.isSubmitted === true) {
      this.alertify.warning('Proforma Invoice already submitted. can not update file.');
      return;
   }
    if (this.proformaUpdateMode === true) {
      const otherFormData = new FormData();
      otherFormData.append('otherFile', f);
      this.proformaService.updateOtherFile(otherFormData, this.piMstId).subscribe(resp => {
        this.alertify.success('Other Document updated successfully');
        const piMst = resp as IProformaInvoiceMst;
      }, error => {
        console.log(console.error);
      });
      return;
    }
    if (result === 'fileOk') {
      this.otherDocFile = f;
    }
  }
  openProformaDtlModal(mode: string) {
    if (mode === 'add') {
      this.proformaInvDtlModalTitle = 'Add Product';
      this.proformaInvoiceDtlForm.reset();
      this.proformaInvoiceDtlForm.get('prodName').setValue('');
      const exRate = this.getCurrencyRate();
      this.proformaInvoiceDtlForm.get('exchangeRate').setValue(exRate);
    }
    if (mode === 'update') {
      this.proformaInvDtlModalTitle = 'Update Product';
      const exRate =  this.getCurrencyRate();
      this.proformaInvoiceDtlForm.get('exchangeRate').setValue(exRate);

    }
    this.openProformaInvDtlModal(this.proformaInvDtlModal);
    this.editMode = false;
    this.addMode = true;
  }
  openProforMstodal() {
  }
  getCurrencies() {
    this.currencyService.getCurrency().subscribe(
      resp => {
        this.currencies = resp as ICurrency[];
      },
      error => {
        console.log(error);
      }
    );
  }
  addUpdateProduct() {
    if (this.addMode === true) {
      const a: IProformaInvoiceDtl = {
        id: 0,
        mstId: 0,
        prodName: this.proformaInvoiceDtlForm.value.prodName,
        prodType: this.proformaInvoiceDtlForm.value.prodType,
        hsCode: this.proformaInvoiceDtlForm.value.hsCode,
        packSize: this.proformaInvoiceDtlForm.value.packSize,
        manufacturer: this.proformaInvoiceDtlForm.value.manufacturer,
        noOfUnits: this.proformaInvoiceDtlForm.value.noOfUnits,
        unitPrice: this.proformaInvoiceDtlForm.value.unitPrice,
        totalPrice: this.proformaInvoiceDtlForm.value.totalPrice,
        totalPriceInBdt: this.proformaInvoiceDtlForm.value.totalPriceInBdt,
        exchangeRate: this.proformaInvoiceDtlForm.value.exchangeRate,
        totalAmount: this.proformaInvoiceDtlForm.value.totalAmount,
        approvalStatus: null,
        approvedBy: 0,
        remarks: null
      };
      for (const i of this.proformaInvoiceDtls) {
        if (i.prodName === a.prodName && i.packSize === a.packSize) {
          this.alertify.warning('Product Alerady Selected. Please Try Another.');
          return false;
        }
      }
      this.proformaInvoiceDtls.push(a);
      this.proformaInvoiceDtlModalRef.hide();
      this.proformaInvoiceDtlForm.reset();
    }
    if (this.editMode === true) {
      const a: IProformaInvoiceDtl = {
        id: 0,
        mstId: 0,
        prodName: this.proformaInvoiceDtlForm.value.prodName,
        prodType: this.proformaInvoiceDtlForm.value.prodType,
        hsCode: this.proformaInvoiceDtlForm.value.hsCode,
        packSize: this.proformaInvoiceDtlForm.value.packSize,
        manufacturer: this.proformaInvoiceDtlForm.value.manufacturer,
        noOfUnits: this.proformaInvoiceDtlForm.value.noOfUnits,
        unitPrice: this.proformaInvoiceDtlForm.value.unitPrice,
        totalPrice: this.proformaInvoiceDtlForm.value.totalPrice,
        totalPriceInBdt: this.proformaInvoiceDtlForm.value.totalPriceInBdt,
        exchangeRate: this.proformaInvoiceDtlForm.value.exchangeRate,
        totalAmount: this.proformaInvoiceDtlForm.value.totalAmount,
        approvalStatus: null,
        approvedBy: 0,
        remarks: null
      };
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).prodType = a.prodType;
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).hsCode = a.hsCode;
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).packSize = a.packSize;
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).manufacturer = a.manufacturer;
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).unitPrice = a.unitPrice;
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).noOfUnits = a.noOfUnits;
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).totalPrice = a.totalPrice;
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).totalPriceInBdt = a.totalPriceInBdt;
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).exchangeRate = a.exchangeRate;
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).totalAmount = a.totalAmount;
      this.proformaInvoiceDtls.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).prodName = a.prodName;
      this.proformaInvoiceDtlModalRef.hide();
      this.proformaInvoiceDtlForm.reset();
    }
  }
  removeProduct(p: IProformaInvoiceDtl) {
    const result = confirm('Are you sure want to remove?');
    if (result === true) {
      for (let i = 0; i < this.proformaInvoiceDtls.length; i++) {
        if (this.proformaInvoiceDtls[i].prodName === p.prodName) {
          this.proformaInvoiceDtls.splice(i, 1);
        }
      }
    } else {
      return;
    }
  }
  editProduct(p: IProformaInvoiceDtl) {
    const remainingAmountforPIProductDto: RemainingAmountforPIProductDto = {
      importerId: this.loginService.getEmpOrImpName(),
      prodName:p.prodName,
      packSize:p.packSize,
      hsCode:p.hsCode
    };
    this.proformaService.getAnnReqProdDtlsByImpEditMode(remainingAmountforPIProductDto).subscribe( resp => {
      this.annProds = resp as IAnnReqProdDtlsForProforDto[];
      console.log("remainingAmount: " + this.annProds[0].remainingAmount);
      this.loading = false;
      this.remainingAmountUnit=this.annProds[0].remainingAmount;
      this.remainingAmountTon=this.annProds[0].remainingAmount;
      if(p.id){
        this.remainingAmountUnit += p.noOfUnits;
        this.remainingAmountTon +=p.totalAmount;
      }
      console.log("remainingAmountNew: " + this.remainingAmountUnit);
    }, error => {
      console.log(error);
    });
    
    //
    this.updateProd = p;
    this.proformaInvoiceDtlForm.setValue({
      prodName: p.prodName,
      prodType: p.prodType,
      hsCode: p.hsCode,
      packSize: p.packSize,
      manufacturer: p.manufacturer,
      noOfUnits: p.noOfUnits  || undefined || null,
      unitPrice: p.unitPrice,
      totalPrice: p.totalPrice,
      totalPriceInBdt: p.totalPriceInBdt,
      exchangeRate: p.exchangeRate,
      totalAmount: p.totalAmount || undefined || null
    });
    
    this.openProformaDtlModal('update');
    this.editMode = true;
    this.addMode = false;
  }
  getProductListFromAnnualReq() {
    this.noOfUnitValidationErrorMsg=false;
    this.totalAmountValidationErrorMsg=false;
    this.proformaInvoiceDtlForm.controls['unitPrice'].enable();
    this.loading = true;
    const importerDto: IAnnualReqByImporterDto = {
      importerId: this.loginService.getEmpOrImpName()
    };
    this.proformaService.getProductListFromAnnualReq(importerDto).subscribe( resp => {
      this.annProds = resp as IAnnReqProdDtlsForProforDto[];
      //console.log(this.annProds);
      debugger;
      this.loading = false;
      if(this.annProds.length>0){
        this.openAnnReqProdModal(this.annualReqProdModal);
      }
      else{
        this.alertify.warning('Please Complete Annual Requirement First');
      }
      
    }, error => {
      console.log(error);
    });
  }

  reqProdNameSelect(a: IAnnReqProdDtlsForProforDto) {
    let r = '';
    // tslint:disable-next-line: only-arrow-functions
    this.proformaInvoiceDtls.forEach(function(item, index) {
      if ( item.prodName === a.prodName && item.packSize === a.packSize) {
        r = 'duplicate';
      }
    });
    if (r === 'duplicate') {
      this.alertify.warning('Product Already Selected. Please Try Another Product.');
      return false;
    }
    this.proformaInvoiceDtlForm.get('prodName').setValue(a.prodName);
    this.proformaInvoiceDtlForm.get('packSize').setValue(a.packSize);
    this.proformaInvoiceDtlForm.get('hsCode').setValue(a.hsCode);
    this.proformaInvoiceDtlForm.get('manufacturer').setValue('');
    this.proformaInvoiceDtlForm.get('prodType').setValue(a.prodType);
    //
    if(a.tentativeUnits>0){
      this.proformaInvoiceDtlForm.controls['totalAmount'].disable();
      this.proformaInvoiceDtlForm.controls['noOfUnits'].enable();
      this.proformaInvoiceDtlForm.get('noOfUnits').setValue('');
      this.remainingAmountUnit=a.remainingAmount;
     }
     if(a.totalAmount>0){ 
      this.proformaInvoiceDtlForm.controls['noOfUnits'].disable();
      this.proformaInvoiceDtlForm.controls['totalAmount'].enable();
      this.proformaInvoiceDtlForm.get('totalAmount').setValue('');
      //have confusion
      this.remainingAmountTon=a.remainingAmount;
      }
    //
   // this.proformaInvoiceDtlForm.get('noOfUnits').setValue(a.tentativeUnits);
    this.proformaInvoiceDtlForm.get('totalAmount').setValue('');
    this.proformaInvoiceDtlForm.controls['unitPrice'].disable();
    this.annualReqProdModalRef.hide();
    // let prod: IAnnReqProdDtlsForProforDto;
    // // tslint:disable-next-line: only-arrow-functions
    // this.annProds.forEach(function(item, index) {
    //   if (item.prodName === p) {
    //     prod = item;
    //   }
    // });
  }

  noOfUnitsValidation(){
    this.noOfUnitValidationErrorMsg=false;
    const noOfUnt = this.proformaInvoiceDtlForm.value.noOfUnits;
    if(noOfUnt>this.remainingAmountUnit){
      this.proformaInvoiceDtlForm.get('noOfUnits').setValue('');
      this.noOfUnitValidationErrorMsg=true;
      this.alertify.warning('Invalid Proforma amount');
    }
    else{
      this.noOfUnitValidationErrorMsg=false;
      this.proformaInvoiceDtlForm.controls['unitPrice'].enable();
    }
  }
  totalAmountTonValidation(){
    this.totalAmountValidationErrorMsg=false;
    const totalAmountTon = this.proformaInvoiceDtlForm.value.totalAmount;
    if(totalAmountTon>this.remainingAmountTon){
      this.proformaInvoiceDtlForm.get('totalAmount').setValue('');
      this.totalAmountValidationErrorMsg=true;
      this.alertify.warning('Invalid Proforma amount');
    }
    else{
      this.totalAmountValidationErrorMsg=false;
      this.proformaInvoiceDtlForm.controls['unitPrice'].enable();
    }
  }
  NoOfUnitKeydown() {
    this.proformaInvoiceDtlForm.get('unitPrice').enable();
  }
  calculateTotalPrice() {
    const noOfUn = this.proformaInvoiceDtlForm.value.noOfUnits;
    const tAmt = this.proformaInvoiceDtlForm.value.totalAmount;
    const unitPri = this.proformaInvoiceDtlForm.value.unitPrice;
    if ((noOfUn === undefined || noOfUn === '') || (tAmt === undefined || tAmt === '') || (unitPri === undefined || unitPri === '')) {
      this.proformaInvoiceDtlForm.get('totalPrice').setValue('');
      this.proformaInvoiceDtlForm.get('totalPriceInBdt').setValue('');
    } 
    if(noOfUn>0) {
      const exRate = this.proformaInvoiceDtlForm.value.exchangeRate;
      const totalPri = noOfUn * unitPri;
      const totalPrInBdt = totalPri * exRate;
      this.proformaInvoiceDtlForm.get('totalPrice').setValue(totalPri);
      this.proformaInvoiceDtlForm.get('totalPriceInBdt').setValue(totalPrInBdt);
    }
    if(tAmt>0) {
      const exRate = this.proformaInvoiceDtlForm.value.exchangeRate;
      const totalPri = tAmt * unitPri;
      const totalPrInBdt = totalPri * exRate;
      this.proformaInvoiceDtlForm.get('totalPrice').setValue(totalPri);
      this.proformaInvoiceDtlForm.get('totalPriceInBdt').setValue(totalPrInBdt);
    }
  }
  
  currencySelectChange() {
    const cRate = this.getCurrencyRate();
    if (this.proformaInvoiceDtls.length > 0) {
      // tslint:disable-next-line: only-arrow-functions
      this.proformaInvoiceDtls.forEach(function(item, index) {
        item.exchangeRate = cRate;
        item.totalPriceInBdt = item.totalPrice * item.exchangeRate;
      });
    }
  }
  validateTotalAmtount() {
    this.totalAmountValidationErrorMsg = false;
    const totalAmt = this.proformaInvoiceDtlForm.value.totalAmount;
    const impterId = this.loginService.getEmpOrImpName();
    const prdName = this.proformaInvoiceDtlForm.value.prodName;
    const packSize=this.proformaInvoiceDtlForm.value.packSize;
    let validity = true;
    // tslint:disable-next-line: only-arrow-functions
    if (this.annProds.length > 0) {
      const p = this.annProds.find(
        item => item.prodName === prdName && item.packSize === packSize
      );
      if ( totalAmt > p.remainingAmount) {
        this.totalAmountValidationErrorMsg = true;
        validity = false;
      } else {
        this.totalAmountValidationErrorMsg = false;
        this.proformaInvoiceDtlForm.controls['unitPrice'].enable();

      }

      if (!validity) {
        this.proformaInvProdTotalAmtDto = {
         prodName: prdName,
         packSize:packSize,
         totalAmount: totalAmt,
         importerId: impterId
        };
        this.proformaService.getCrntYearTotlProformaInvAmtByProd(this.proformaInvProdTotalAmtDto).subscribe(resp => {
          this.totalAmountValidation = resp as IPiTotalAmountValidationDto;
          if (this.totalAmountValidation.validationStatus === false) {
            this.totalAmountValidationErrorMsg = true;
            this.proformaInvoiceDtlForm.get('totalAmount').setValue('');
            this.alertify.warning('Invalid Proforma amount');
        } else {
          this.totalAmountValidationErrorMsg = false;
          this.proformaInvoiceDtlForm.controls['unitPrice'].enable();

        }
        });
      }
    } else {
      this.proformaInvProdTotalAmtDto = {
        prodName: prdName,
        packSize: packSize,
         totalAmount: totalAmt,
         importerId: impterId
       };
      this.proformaService.getCrntYearTotlProformaInvAmtByProd(this.proformaInvProdTotalAmtDto).subscribe(resp => {
         this.totalAmountValidation = resp as IPiTotalAmountValidationDto;
         if (this.totalAmountValidation.validationStatus === false) {
           this.totalAmountValidationErrorMsg = true;
           this.proformaInvoiceDtlForm.get('totalAmount').setValue('');
           this.alertify.warning('Invalid Proforma amount');
       } else {
         this.proformaInvoiceDtlForm.controls['unitPrice'].enable();
         this.totalAmountValidationErrorMsg = false;
       }
       });
    }
  }
  confirm(): void {
    this.proformaConfirmModalRef.hide();
    this.saveUpdatePormaInvoice();
  }
  decline(): void {
    this.proformaConfirmModalRef.hide();
  }
  confirmProformaInvoiceSaveOrUpdate() {
    if (this.proformaInvoiceDtls.length < 1) {
      this.loading = false;
      this.alertify.warning('No Product to Save');
      return false;
    }
    if (this.proformaUpdateMode === false) {
      this.saveUpdateMsg = 'সেভ';
    } else {
      this.saveUpdateMsg = 'আপডেট';
    }
    this.openProformaSaveConfirmModal(this.proformaConfirmModal);
  }
  saveUpdatePormaInvoice() {
    this.loading = true;
    const formData = new FormData();
    const impId = this.loginService.getEmpOrImpName();
    if (this.proformaUpdateMode === false) {
      formData.append('piScan', this.piScanFile);
      formData.append('litScan', this.litScanFile);
      formData.append('testScan', this.testReportFile);
      formData.append('otherScan', this.otherDocFile);
      const proMst: IProformaInvoiceMst  = {
        id: 0,
        applicationNo: 0,
        proformaInvoiceNo: this.proformaInvoiceForm.value.proformaInvoiceNo,
        proformaDate: this.proformaInvoiceForm.value.proformaDate,
        submissionDate: new Date(),
        currency: this.proformaInvoiceForm.value.currency,
        countryOfOrigin: this.proformaInvoiceForm.value.countryOfOrigin,
        portOfLoading: this.proformaInvoiceForm.value.portOfLoading,
        portOfEntry: this.proformaInvoiceForm.value.portOfEntry,
        piScan: null,
        litScan: null,
        testReport: null,
        otherDoc: null,
        confirmation: false,
        approvalDate: null,
        approvalStatus: null,
        importerId: impId
      };
      this.proformaService.saveProformaInvoiceMst(proMst).subscribe(resp => {
        const proInveMst = resp as IProformaInvoiceMst;
        // this.piMstId = proInveMst.id;
        const proforInDtl: IProformaInvoiceDtl[] = [];
        for (const d of this.proformaInvoiceDtls) {
          const obj: IProformaInvoiceDtl = {
            id: 0,
            mstId: proInveMst.id,
            prodName: d.prodName,
            prodType: d.prodType,
            hsCode: d.hsCode,
            manufacturer: d.manufacturer,
            exchangeRate: d.exchangeRate,
            noOfUnits: d.noOfUnits,
            unitPrice: d.unitPrice,
            packSize: d.packSize,
            totalAmount: d.totalAmount,
            totalPrice: d.totalPrice,
            totalPriceInBdt: d.totalPriceInBdt,
            approvalStatus: null,
            approvedBy: 0,
            remarks: null
          };
          proforInDtl.push(obj);
        }
        this.proformaService.saveProformaInvoiceDtl(proforInDtl).subscribe(response => {
          const proformaDtl = response as IProformaInvoiceDtl[];
          if (proInveMst.id !== undefined && proInveMst.id > 0) {
            this.proformaService.UploadProformaFiles(formData, proInveMst.id).subscribe(r => {
                this.alertify.success('Proforma Invoice saved successfully');
                this.loading = false;
                this.resetPage();
            }, e => {
              this.alertify.success('Proforma Invoice save failed');
            });
          }
        }, err => {
          this.alertify.success('Proforma Invoice save failed');
          console.log(err);
        });
      }, error => {
        this.alertify.success('Proforma Invoice saved failed');
        console.log(error);
      });
    }
    if ( this.proformaUpdateMode === true) {
      const proMstUpdtDto: IProformaInvoiceMstUpdateDto  = {
        id: this.piMstId,
        currency: this.proformaInvoiceForm.value.currency,
        countryOfOrigin: this.proformaInvoiceForm.value.countryOfOrigin,
        portOfLoading: this.proformaInvoiceForm.value.portOfLoading,
        portOfEntry: this.proformaInvoiceForm.value.portOfEntry,
        proformaInvoiceNo: this.proformaInvoiceForm.value.proformaInvoiceNo
      };
      this.proformaService.updateProformaInvoiceMst(proMstUpdtDto).subscribe(response => {
        const proInveMst = response as IProformaInvoiceMst;
        // this.piMstId = proInveMst.id;
        const proforInDtlUpdtDto: IProformaInvoiceDtl[] = [];
        for (const d of this.proformaInvoiceDtls) {
          const obj: IProformaInvoiceDtl = {
            id: 0,
            mstId: proInveMst.id,
            prodName: d.prodName,
            prodType: d.prodType,
            hsCode: d.hsCode,
            manufacturer: d.manufacturer,
            exchangeRate: d.exchangeRate,
            noOfUnits: d.noOfUnits,
            unitPrice: d.unitPrice,
            packSize: d.packSize,
            totalAmount: d.totalAmount,
            totalPrice: d.totalPrice,
            totalPriceInBdt: d.totalPriceInBdt,
            approvalStatus: null,
            approvedBy: 0,
            remarks: null
          };
          proforInDtlUpdtDto.push(obj);
        }
        this.proformaService.updateProformaInvoiceDtl(proforInDtlUpdtDto, this.piMstId).subscribe(resp => {
          const ProMstDtl = resp as IProformaInvoiceDtl[];
          this.loading = false;
          this.resetPage();
          this.alertify.success('Proforma Invoice updated successfully');
        }, err => {
          console.log(err);
          this.alertify.error('Proforma Invoice update failed');
        });
      }, error => {
        console.log(error);
        this.loading = false;
        this.alertify.error(error.error);
      });
    }
  }
  getAllProformaInvoiceMstByUser() {
    this.loading = true;
    const importer: IAnnualReqByImporterDto = {
      importerId: 0
    };
    importer.importerId = this.loginService.getEmpOrImpName();
    this.proformaService.getAllProformaInvoiceMstByUser(importer).subscribe(resp => {
      this.proformaInvoiceMsts = resp as IProformaInvoiceMst[];
      if (this.proformaInvoiceMsts.length === 0) {
        this.alertify.warning('No Data Found');
        this.loading = false;
      } else {
        this.loading = false;
        this.openProformaMstSearchModal(this.proformaInvMstSearchModal);
      }
    }, error => {
      console.log(error);
    });
  }
  selectProforma(p: IProformaInvoiceMst) {
    this.proformaNoNotOk = false;
    this.proformaNoSpinner = false;
    this.proformaNoOk = true;
    this.proformaNoValidity = true;
    const pDate = new Date(p.proformaDate);
    const sDate = new Date(p.submissionDate);
    let formattedSubmissionDate: any;
    const formattedProformaDate = pDate.getDate() + '/' + (pDate.getMonth() + 1) + '/' + pDate.getFullYear();
    if (p.submissionDate === undefined || p.submissionDate === null) {
      formattedSubmissionDate = p.submissionDate;
    } else {
      formattedSubmissionDate = sDate.getDate() + '/' + (sDate.getMonth() + 1) + '/' + sDate.getFullYear();
    }
    if (p.confirmation === false) {
      this.isSubmitted = false;
      this.updateBtnDisable = false;
      this.submitButtonDisable = false;
    } else if (p.confirmation === true) {
      this.isSubmitted = true;
      this.submitButtonDisable = true;
      this.updateBtnDisable = true;
    }
    this.saveButtonTitle = 'Update';
    this.proformaUpdateMode = true;
    this.piMstId = p.id;
    this.proformaInvoiceForm.get('applicationNo').setValue(p.applicationNo);
    this.proformaInvoiceForm.get('proformaInvoiceNo').setValue(p.proformaInvoiceNo);
    this.proformaInvoiceForm.get('proformaDate').setValue(formattedProformaDate);
    this.proformaInvoiceForm.get('submissionDate').setValue(formattedSubmissionDate);
    this.proformaInvoiceForm.get('countryOfOrigin').setValue(p.countryOfOrigin);
    this.proformaInvoiceForm.get('currency').setValue(p.currency);
    this.proformaInvoiceForm.get('portOfLoading').setValue(p.portOfLoading);
    this.proformaInvoiceForm.get('portOfEntry').setValue(p.portOfEntry);
    this.proformaInvoiceForm.get('piScan').clearValidators();
    this.proformaInvoiceForm.get('piScan').updateValueAndValidity();
    this.proformaInvoiceForm.get('litScan').clearValidators();
    this.proformaInvoiceForm.get('litScan').updateValueAndValidity();
    this.proformaInvoiceForm.get('testReport').clearValidators();
    this.proformaInvoiceForm.get('testReport').updateValueAndValidity();
    this.proformaInvoiceForm.get('otherDoc').clearValidators();
    this.proformaInvoiceForm.get('otherDoc').updateValueAndValidity();
    this.getProformaDtlsByProformaMst(p.id);
    this.proformaInvMstSearchModalRef.hide();
  }
  getProformaDtlsByProformaMst(poMstId: number) {
    const proforma: IProformaMstIdDto = {
      proformaMstId: 0
    };
    proforma.proformaMstId = poMstId;
    this.proformaService.getProformaDtlsByProformaMst(proforma).subscribe(resp => {
      this.proformaInvoiceDtls = resp as IProformaInvoiceDtl[];
      if (this.proformaInvoiceDtls.length === 0) {
        this.alertify.warning('No Data Found');
      }
    });
  }
  DownloadPiFile(fname: string) {
    this.fileDownloadInitiated = true;
    return this.http.get(this.baseUrl + 'DownloadPiFile/' + fname, { responseType: 'arraybuffer' })
      .subscribe((result: any) => {
        if (result.type !== 'text/plain') {
          var file = new Blob([result], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
         // const blob = new Blob([result]);
          // const saveAs = require('file-saver');
          // const file = 'proforma_invoice_' + fname;
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
  confirmSubmit() {
    this.proformaSubmissionConfirmRef.hide();
    this.submitProformaInvoice();
  }
  declineSubmit() {
    this.proformaSubmissionConfirmRef.hide();
  }
  confirmProformaInvoiceSubmission() {
    this.openProformaSubmissionConfirmModal(this.proformaSubmissionConfirmModal);
  }
  submitProformaInvoice() {
    const proMstId: IProformaMstIdDto = {
      proformaMstId: this.piMstId
    };
    this.proformaService.submitProformaInvoice(proMstId).subscribe( resp => {
      const proM = resp as IProformaInvoiceMst[];
      this.resetPage();
      this.alertify.success('Proforma Invoice submitted successfully');
    }, err => {
      this.alertify.success('Proforma Invoice submission failed');
    });
  }
  IsProformaSubmitted(mId: number) {
    let res: ISubmissionResult = {
      IsSubmitted: false
    };
    const proMst: IProformaMstIdDto = {
      proformaMstId: this.piMstId
    };
    this.proformaService.IsProformaSubmitted(proMst).subscribe(resp => {
      res = resp as ISubmissionResult;
    });
    if (res.IsSubmitted === false) {
      return false;
    } else {
      return false;
    }
  }
  resetPage() {
    // this.proformaInvoiceForm.reset();
    this.createProformaInvoiceForm();
    this.proformaInvoiceForm.get('currency').setValue('');
    this.proformaInvoiceForm.get('proformaDate').setValue('');
    // this.proformaInvoiceDtlForm.reset();
    this.createProformaInvoiceDtlForm();
    this.proformaInvoiceDtls = [];
    this.proformaInvoiceMsts = [];
    this.totalAmountValidationErrorMsg = false;
    this.noOfUnitValidationErrorMsg=false;
    this.totalAmountValidation = {
      annualTotalAmount: 0,
      remainingAmount: 0,
      validationStatus: false,
      proformaTotalAmount: 0
    };
    this.saveButtonTitle = 'Save';
    this.proformaUpdateMode = false;
    this.addMode = false;
    this.editMode = false;
    this.loading = false;
    this.exchngDisabled = true;
    this.updateBtnDisable = false;
    this.submitButtonDisable = true;
    this.isSubmitted = false;
    this.piMstId = null;
    this.p = 1;
    this.pa = 1;
    this.pd = 1;
    this.searchText = '';

    this.proformaNoSpinner = false;
    this.proformaNoOk = false;
    this.proformaNoNotOk = false;
    this.proformaNoValidity = false;
  }
  viewProformaReport(): void {
      this.loading = true;
      const mst: IProformaMstIdDto = {
        proformaMstId: this.piMstId
      };
      let row: any[] = [];
      const rowD: any[] = [];
      const col = ['SL \nNO.','Product Name', 'Type', 'H.S. Code', 'Manufacturer', 'Pack Size',
      'No Of Units', 'Amount(Tons)', 'Unit Price', 'Price', 'Price in Bdt(Tk)'];
      const title = 'Importer Report';
      let slNO = 0;
      this.proformaService.getProformaDtlsByProformaMst(mst).subscribe(result => {
       const r = result as IProformaInvoiceDtl[];
       for (const a of r) {
         row.push(++slNO);
         row.push(a.prodName);
         row.push(a.prodType);
         row.push(a.hsCode);
         row.push(a.manufacturer);
         row.push(a.packSize);
         row.push(a.noOfUnits);
         row.push(a.totalAmount);
         row.push(a.unitPrice);
         row.push(a.totalPrice);
         row.push(a.totalPriceInBdt);
         rowD.push(row);
         row = [];
       }
       let proMstRpt: IProMstRpt;
       this.proformaService.ProformaInvoiceMstReport(mst).subscribe( resp => {
           proMstRpt = resp as IProMstRpt;
           proMstRpt.submissionDate = this.formatReportDate(proMstRpt.submissionDate);
           proMstRpt.proformaDate = this.formatReportDate(proMstRpt.proformaDate);
           this.getReport(col, rowD, title, proMstRpt);
       });
     });
   }
   formatReportDate(d: any) {
    if ((d === undefined) || (d === null)) {
      return 'Not Submitted';
    }
    if ((d !== undefined) && (d !== null)) {
      const convertedDate = new Date(d);
      return convertedDate.getDate() + '/' + (convertedDate.getMonth() + 1) + '/' + convertedDate.getFullYear();
    }
   }
  getReport(col: any[], rowD: any[], title: any, proMstRpt: any) {
    const totalPagesExp = '{total_pages_count_string}';
    const pdf = new jsPDF('l', 'pt', 'A4');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFontType('bold');
    pdf.text('Report Name: ', 50, 90);
    pdf.setFontType('normal');
    pdf.text('Proforma Invoice Report', 150, 90);
    pdf.setFontSize(10);
    pdf.setFontType('bold');
    pdf.text('Organization Name: ', 50, 105);
    pdf.setFontType('normal');
    pdf.text(proMstRpt.orgName + ' , ' + proMstRpt.address, 150, 105);
    pdf.setFontType('bold');
    pdf.text('Proforma Date: ', 650, 105);
    pdf.setFontType('normal');
    pdf.text(proMstRpt.proformaDate, 738, 105);
    pdf.setFontType('bold');
    pdf.text('Submission Date: ', 650, 120);
    pdf.setFontType('normal');
    pdf.text(proMstRpt.submissionDate === undefined || null ?
      'Not Submitted' : proMstRpt.submissionDate , 738, 120);
    pdf.setFontType('bold');
    pdf.text('Application No: ', 50, 120);
    pdf.setFontType('normal');
    pdf.text(proMstRpt.applicationNo, 150, 120);
    pdf.setFontType('bold');
    pdf.text('Proforma Invoice No: ', 230, 120);
    pdf.setFontType('normal');
    pdf.text( proMstRpt.proformaInvoiceNo, 340, 120);
    pdf.setFontSize(10);
    // tslint:disable-next-line: max-line-length
    pdf.setFontType('bold');
    pdf.text('Country: ', 50, 135);
    pdf.setFontType('normal');
    pdf.text(proMstRpt.countryOfOrigin , 150, 135);
    pdf.setFontType('bold');
    pdf.text('Currency: ', 230, 135);
    pdf.setFontType('normal');
    pdf.text(proMstRpt.currency, 340, 135);
    pdf.setFontType('bold');
    pdf.text('Port of Loading: ', 50, 150);
    pdf.setFontType('normal');
    pdf.text( proMstRpt.portOfLoading , 150, 150);
    pdf.setFontType('bold');
    pdf.text('Port of Entry: ' , 230, 150);
    pdf.setFontType('normal');
    pdf.text( proMstRpt.portOfEntry, 340, 150);
    pdf.setLineWidth(1);
    pdf.line(5, 165, 835, 165);
    const pageContent = function (data) {
      // HEADER

      // FOOTER
      let str = 'Page ' + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = str + ' of ' + totalPagesExp;
      }
      pdf.setFontSize(11);
      const pageHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10); // showing current page number
    };
    pdf.autoTable(col, rowD,
      {
        theme: 'grid',
        headStyles: {fillColor: [192, 192, 192]},
        didDrawPage: pageContent,
        margin: { top: 175 },
        bodyStyles: {valign: 'middle', lineColor: [153, 153, 153]},
        styles: {overflow: 'linebreak', cellWidth: 'wrap' , fontSize: 9, textColor: 0},
      });

    // for adding total number of pages // i.e 10 etc
    if (typeof pdf.putTotalPages === 'function') {
      pdf.putTotalPages(totalPagesExp);
    }

    // pdf.save(title + '.pdf');
    pdf.setProperties({
      title: title + ".pdf"
  });
 
 var blob = pdf.output("blob");
  window.open(URL.createObjectURL(blob));
    this.loading = false;
  }
  isUsernameAvailable() {
    if (this.proformaUpdateMode === false) {
      this.proformaNoValidity = false;
      this.proformaNoOk = false;
      this.proformaNoNotOk = false;
      this.proformaNoSpinner = true;
      const proformaNoDto: ProformaInvoiceNoDto = {
        proformaInvoiceNo: this.proformaInvoiceForm.value.proformaInvoiceNo
      };
      this.proformaService.proformaInvoiceNoAvailable(proformaNoDto).subscribe(resp => {
        const res = resp ;
        if (res) {
          this.proformaNoNotOk = false;
          this.proformaNoSpinner = false;
          this.proformaNoOk = true;
          this.proformaNoValidity = true;
    } else {
          this.proformaNoOk = false;
          this.proformaNoSpinner = false;
          this.proformaNoNotOk = true;
          this.proformaNoValidity = false;
        }
      }, error => {
        this.proformaNoValidity = false;
        console.log(error);
      });
    } else {
      this.proformaNoNotOk = false;
      this.proformaNoSpinner = false;
      this.proformaNoOk = true;
      this.proformaNoValidity = true;
    }
  }
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
  approvalDate: Date;
  approvalStatus: boolean;
  importerId: number;
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
}
interface ICurrency {
  id: number;
  currency: string;
  exchangeRate: number;
}
interface IAnnualReqByImporterDto {
  importerId: number;
}
interface RemainingAmountforPIProductDto {
  importerId: number;
  prodName: string;
  packSize: string;
  hsCode: string;
}
interface IProformaMstIdDto {
  proformaMstId: number;
}
interface IAnnualRequirementDtl {
  id: number;
  annReqMstId: number;
  prodName: string;
  prodType: string;
  hsCode: string;
  manufacturer: string;
  countryOfOrigin: string;
  packSize: string;
  tentativeUnits: number;
  unitPrice: number;
  totalPrice: number;
  totalPriceInBdt: number;
  currency: string;
  exchangeRate: number;
  totalAmount: number;
}
interface IAnnualRequirementMst {
  id: number;
  importerId: number;
  submissionDate: string;
  AnnualRequirementDtls: IAnnualRequirementDtl;
}
interface IAnnReqProdDtlsForProforDto {
  productId: number;
  prodName: string;
  prodType: string;
  hsCode: string;
  manufacturer: string;
  packSize: string;
  country: string;
  tentativeUnits: number;
  totalAmount: number;
  remainingAmount: number;
}
interface ProfInvTotalAmtDtoByProdDto {
  importerId: number;
  prodName: string;
  packSize: string;
  totalAmount: number;
}
interface IProformaInvoiceMstUpdateDto {
  id: number;
  currency: string;
  countryOfOrigin: number;
  portOfLoading: string;
  portOfEntry: string;
  proformaInvoiceNo: string;
}
interface IProfInvDtlUpdtDto {
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
}
interface IPiTotalAmountValidationDto {
    annualTotalAmount: number;
    proformaTotalAmount: number;
    remainingAmount: number;
    validationStatus: boolean;
}
interface ISubmissionResult{
  IsSubmitted: boolean;
}

interface IProMstRpt {
  id: number;
  applicationNo: number;
  proformaInvoiceNo: string;
  proformaDate: string;
  submissionDate: string;
  currency: string;
  countryOfOrigin: number;
  portOfLoading: string;
  portOfEntry: string;
  confirmation: boolean;
  importerId: number;
  orgName: string;
  address: string;
}
interface ProformaInvoiceNoDto{
  proformaInvoiceNo: string;
}