import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProformaInvoiceApprovalService } from '../_services/proforma-invoice-approval.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Pipe } from '@angular/core';

@Pipe({ name: 'round' })
export class RoundPipe {
    transform(input: number) {
        return Math.round(input);
    }
}
@Component({
  selector: 'nocReport',
  templateUrl: './noc-report.component.html',
  styleUrls: ['./noc-report.component.css']
})
export class NocReportComponent implements OnInit {
  @ViewChild('createOrEditModal', { static: false }) createOrEditModal: TemplateRef<any>;
 // @ViewChild('content', { static: false }) content: ElementRef;

  active = false;
  saving = false;
  viewCertificate = false;
  bsValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  fromDate: any;
  toDate: any;
  filterText = '';
  id: number;
  displayName: string;
  p: any = 1;
  records: IProformaInfoDto[] = [];
  item: IProformaInfoDto;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  modalRef: BsModalRef;
  //declare model.property
  proformaInvoiceNo: any;
  submissionDate: any;
  proformaDate:any;
  proformaSubmissionDate: any;
  approvalDate:any;
  portOfLoading: any;
  countryOfOrigin:any;
  //letterNoFixed = '33.01.0000.111.05.303.12-' + this.datePipe.transform(new Date, "yMd-hms");
  letterNoFixed='৩৩.০১.০০০০.১১১.০৫';
  nocCertDate = new Date;
  printingDate = this.datePipe.transform(new Date, "dd/MM/yyyy");
  //
  d=this.printingDate;
  finalEnlishToBanglaNumber={'/':'/','0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
  retStr='';
  //
  letterNo = '৩৩.০১.০০০০.১১১.০৫.';
  letterNoInput = '';
  toAddress: any;
  subject: any;
  orgName: any;
  importerAddress: any;
  onulipiId:any;
  proformaInvoiceDtls: IProformaInvoiceDtl[];
  proformaInvoiceDtlsLength: any;
  nocTypes = [
    {id: 1, name: 'Fish Meal/DDGS/ CGM/CPC/etc.' },
    {id: 2, name: 'Veterinary Medicine/Vaccine/ DAR Items'},
    {id: 3, name: 'Poultry Meal'},
    {id: 4, name: 'Others'},
  
];

selectedNocType=1;
selectedNocId: number;
  constructor(
    private _proformaApprovalService: ProformaInvoiceApprovalService,
    private modalService: BsModalService,
    private datePipe: DatePipe) { }
    changeNocDate(value: Date){
      debugger;
      if(value==null)
      {
        return false;
      }
      this.printingDate=this.getDigitBanglaFromEnglish(this.datePipe.transform(value, "dd/MM/yyyy"));
    }
  ngOnInit() {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue'}, { dateInputFormat: 'DD/MM/YYYY'});
    this.bsValue = new Date();
    this.printingDate = this.datePipe.transform(this.nocCertDate, "dd/MM/yyyy");
    this.printingDate=this.getDigitBanglaFromEnglish(this.printingDate);
    // this.dropdownList = [
    //   { item_id: 1, item_text: 'কমিশনার, কাস্টমস হাউজ, চট্টগ্রাম, বাংলাদেশ ।' },
    //   { item_id: 2, item_text: 'সহকারী পরিচালক, প্রাণীসম্পদ কয়ারেনটাইন স্টেশন, চট্টগ্রাম, বাংলাদেশ ।' },
    //   { item_id: 3, item_text: 'সভাপতি, আহকাব, সেন্টার পয়েন্ট, ইউনিট -১২  ডি, ১৪/এ, তেজকুনীপাড়া, ফার্মগেট বা/এ, তেজগাঁও, ঢাকা -১২২৫ ।' },
    //   { item_id: 4, item_text: 'জেলা প্রাণীসম্পদ কর্মকর্তা, মানিকগঞ্জ ।' }
    // ];
    // this.selectedItems = [
    //   { item_id: 1, item_text: 'কমিশনার, কাস্টমস হাউজ, চট্টগ্রাম, বাংলাদেশ ।' },
    //   { item_id: 2, item_text: 'সহকারী পরিচালক, প্রাণীসম্পদ কয়ারেনটাইন স্টেশন, চট্টগ্রাম, বাংলাদেশ ।' },
    //   { item_id: 3, item_text: 'সভাপতি, আহকাব, সেন্টার পয়েন্ট, ইউনিট -১২  ডি, ১৪/এ, তেজকুনীপাড়া, ফার্মগেট বা/এ, তেজগাঁও, ঢাকা -১২২৫ ।' },
    //   { item_id: 4, item_text: 'জেলা প্রাণীসম্পদ কর্মকর্তা, মানিকগঞ্জ ।' }
    // ];
    // this.dropdownSettings = {
    //   singleSelection: false,
    //   idField: 'item_id',
    //   textField: 'item_text',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      keyboard: false,
      class: 'modal-lg',
      ignoreBackdropClick: true
    });
  }
  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

  resetDateRange() {
    this.fromDate = "";
    this.toDate = "";
    this.viewCertificate = false;
    this.subject = '';
  }
  getDigitBanglaFromEnglish(englishNumber){
    for (var x in this.finalEnlishToBanglaNumber) {
      englishNumber = englishNumber.replace(new RegExp(x, 'g'), this.finalEnlishToBanglaNumber[x]);
    }
    return englishNumber;
  }
  //
  getAll() {
    const proformaApprovalDateRange: IProformaApprovalDateRangeForNocDto = {
      fromDate: this.fromDate,
      toDate: this.toDate,
    };

    this._proformaApprovalService.getDateWiseApprovalProformaInvoice(proformaApprovalDateRange).subscribe(result => {
      this.records = result as IProformaInfoDto[];
    });
  }
  // //
  // {id: 1, name: 'Chittagong/Chattogram' },
  // {id: 2, name: 'Sonamasjid'},
  // {id: 3, name: 'Benapole'},
  // {id: 4, name: 'Mongla'},
  // {id: 5, name: 'Hili'},
  // {id: 6, name: 'Darshana'},
  // {id: 7, name: 'Shahjalal International Airport'}
  // //

  setAndSave(r: IProformaInfoDto) {
    debugger;
    this.proformaInvoiceNo = r.proformaInvoiceNo;
    this.proformaDate=this.datePipe.transform(r.proformaDate, "dd/MM/yyyy");
    this.submissionDate =this.datePipe.transform(r.submissionDate, "dd/MM/yyyy");
    this.proformaSubmissionDate = r.submissionDate;
    this.proformaSubmissionDate = this.datePipe.transform(this.proformaSubmissionDate, "dd/MM/yyyy");
    this.proformaSubmissionDate=this.getDigitBanglaFromEnglish(this.proformaSubmissionDate);
    this.approvalDate = this.datePipe.transform( r.approvalDate, "dd/MM/yyyy");
    this.approvalDate=this.getDigitBanglaFromEnglish(this.approvalDate);
    //this.letterNoFixed= this.datePipe.transform( r.approvalDate, "dd.MM.yyyy");
    this.letterNoFixed='৩৩.০১.০০০০.১১১.০৫';
    this.portOfLoading = r.portOfLoading;
    this.countryOfOrigin=r.countryOfOrigin;
    this.toAddress = r.importerInfo.address + ', \n' + r.importerInfo.upazila + ', \n' + r.importerInfo.district;
    this.orgName = r.importerInfo.orgName;
    this.importerAddress = r.importerInfo.address;
    this.proformaInvoiceDtls = r.proformaInvoiceDtls;
    this.proformaInvoiceDtlsLength=Math.round(r.proformaInvoiceDtls.length/2);
    if(r.portOfEntry=='Chittagong/Chattogram'){
      this.onulipiId=1;
    }
    else if(r.portOfEntry=='Sonamasjid'){
      this.onulipiId=2;
    }
    else if(r.portOfEntry=='Benapole'){
      this.onulipiId=3;
    }
    else if(r.portOfEntry=='Mongla'){
      this.onulipiId=4;
    }
    else if(r.portOfEntry== 'Hili'){
      this.onulipiId=5;
    }
    else if(r.portOfEntry=='Darshana'){
      this.onulipiId=6;
    }
    else if(r.portOfEntry=='Shahjalal International Airport'){
      this.onulipiId=7;
    }
    else if(r.portOfEntry=='Banglabandha'){
      this.onulipiId=8;
    }
    else if(r.portOfEntry=='Birol'){
      this.onulipiId=9;
    }
    else if(r.portOfEntry=='Rohanpur'){
      this.onulipiId=10;
    }
    else if(r.portOfEntry=='Vomra'){
      this.onulipiId=11;
    }
    else if(r.portOfEntry=='Burimari'){
      this.onulipiId=12;
    }
    else{
      this.onulipiId=0;

    }
    this.modalRef.hide();
    this.viewCertificate = true;
  }

  resetFilter() {
    this.filterText = '';
    this.p = 1;
  }
  openSelectProformaInvoiceModal(selectedNocTypeValue: any) {
    this.selectedNocId=selectedNocTypeValue;
    this.getAll();
    this.openModal(this.createOrEditModal);
  }

  public captureScreen() {
   // let doc = new jsPDF();
  //   doc.addHTML(this.content.nativeElement, function() {
  //     doc.save("obrz.pdf");
  //  });
  debugger;
  var data = document.getElementById('content');
  html2canvas(data).then(canvas => {  
    // Few necessary setting options
    var imgWidth = 200;
    var pageHeight = 220;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL('image/png')  
    let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
    var position = 10;  
   // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, pageHeight);
    //pdf.save('noc.pdf'); // Generated PDF
     //------siam view pdf--------//
     pdf.setProperties({
      title: "noc.pdf"
  });
     var blob = pdf.output("blob");
      window.open(URL.createObjectURL(blob));  
       //------siam view pdf--------//
  });
  }
  captureSc() {
    this.printingDate = this.datePipe.transform(this.nocCertDate, "dd/MM/yyyy");
    this.printingDate=this.getDigitBanglaFromEnglish(this.printingDate);
  debugger;
  var x = document.getElementById('content');
  if (x.style.display === "none") {
    x.style.display = "block";
  } 
    const divContents = document.getElementById('content').innerHTML;
    const a = window.open();
    // tslint:disable-next-line: max-line-length
    a.document.write('<html> <style>@page { size: auto;  margin-top: 0mm;margin-bottom: 0mm; };</style>');
    a.document.write('<body style="font-size:22px;padding-top:10px;font-family:kalpurush,arial,sans-serif;">');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.title = 'NOC_Report';
    a.document.close();
    if (x.style.display !== "none") {
      x.style.display = "none";
    }
    a.print();
  }

}

interface IProformaApprovalDateRangeForNocDto {
  fromDate: Date | undefined | null;
  toDate: Date | undefined | null;
}

//
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
