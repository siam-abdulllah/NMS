import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { LoginService } from '../_services/login.service';
import { ProformaInvoiceReportService } from '../_services/proforma-invoice-report.service';
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { AlertifyService } from '../_services/alertify.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-proforma-approval-summary-report',
  templateUrl: './proforma-approval-summary-report.component.html',
  styleUrls: ['./proforma-approval-summary-report.component.css']
})
export class ProformaApprovalSummaryReportComponent implements OnInit {
  proformaInvoiceSearchForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  bsValue: Date = new Date();
  searchText = '';
  filterValue='';
  proformaSearchDto: IProformaInvoiceSearchDto;
  porformaInfos: IProformaInfoDto[] = [];
  porformaInfosReport: IProformaInfoDto[] = [];
  loading = false;
  p: any = 1;
  viewBtn=false;
  constructor(
    private loginService: LoginService,
    private proformaReportService: ProformaInvoiceReportService,
    private alertify: AlertifyService,
    private datePipe: DatePipe
  ) { }


  ngOnInit() {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue' }, { dateInputFormat: 'DD/MM/YYYY' });
    this.bsValue = new Date();
    this.getCurrentYearProformaInfo();
    this.createProformaSearchForm();
  }
  createProformaSearchForm() {
    this.proformaInvoiceSearchForm = new FormGroup({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      status: new FormControl('')
    });
  }
  getSearchFilterValue(filterValue :any){
    this.filterValue=filterValue;
    //console.log(this.filterValue);
  }
  getDateWiseProformaByImporter() {
    this.loading = true;
    // tslint:disable-next-line: radix
    const uId = parseInt(this.loginService.getEmpOrImpName());
    const proformaReportSearchDto: IProformaInvoiceSearchDto = {
      userId: uId,
      fromDate: this.proformaInvoiceSearchForm.value.fromDate,
      toDate: this.proformaInvoiceSearchForm.value.toDate,
      status: this.proformaInvoiceSearchForm.value.status,
      searchText: this.filterValue
    };
    this.proformaReportService.getDateWiseProformaInfos(proformaReportSearchDto).subscribe(resp => {
      this.porformaInfos = resp as IProformaInfoDto[];
      this.loading = false;
      if (this.porformaInfos.length <= 0) {
        this.alertify.warning('No Data Found');
      }
    }, error => {
      console.log(error);
    });
  }
  getCurrentYearProformaInfo() {
    this.loading = false;
    const uId = this.loginService.getEmpOrImpName();
    const uIdDto: IUserIdDto = {
      userId: uId
    };
    this.proformaReportService.getCurrentYearProformaInfo(uIdDto).subscribe(resp => {
      this.porformaInfos = resp as IProformaInfoDto[];
      this.loading = false;
    }, error => {
      console.log(error);
    });
  }

  resetDateFilter() {
    this.proformaInvoiceSearchForm.reset();
    this.porformaInfos = [];
    this.searchText = '';
    this.p = 1;
  }

  viewCheckRes(){
    const uId = parseInt(this.loginService.getEmpOrImpName());
    const proformaReportSearchDto: IProformaInvoiceSearchDto = {
      userId: uId,
      fromDate: this.proformaInvoiceSearchForm.value.fromDate,
      toDate: this.proformaInvoiceSearchForm.value.toDate,
      status: this.proformaInvoiceSearchForm.value.status,
      searchText: this.filterValue
    };
    
    this.proformaReportService.getDateWiseProformaInfos(proformaReportSearchDto).subscribe(resp => {
      
      this.porformaInfosReport = resp as IProformaInfoDto[];
      this.loading = false;
      if (this.porformaInfosReport.length > 0) {
        this.viewProformaSummaryReport(true,this.porformaInfosReport);
      }
      else{
        this.alertify.warning('No Data Found');

      }
    }, error => {
      console.log(error);
    });

  }

  viewProformaSummaryReport(enhance, resValue: any) {
    const r = resValue as IProformaInfoDto[];
    let row: any[] = [];
    const rowD: any[] = [];
    debugger;
    let col = ['SL\n No.', 'Name &\n Addrsss of\n the importer', 'Product(s)', 'PI No.','PI\n Date', ' Manufacturer\n /Exporter', 'Country\n of Origin',
      'Pack\n Size','Approved\n Amt. \n(Ton\n/Unit)', 'Status']; // initialization for headers
      const title = 'Proforma Invoice Summary Report'; // title of report
   if( this.proformaInvoiceSearchForm.value.status==='pending')
   {
     col = ['SL\n No.', 'Name &\n Addrsss of\n the importer', 'Product(s)', 'PI No.','PI\n Date', ' Manufacturer\n /Exporter', 'Country\n of Origin',
    'Pack\n Size', 'PI Amt. \n(Ton/Unit)','Approved\n Amt. \n(Ton/Unit)', 'Status']; // initialization for headers
  
   }
    let slNO = 0;
    for (const a of r) {
      row.push(++slNO);
      row.push(a.importerInfo.orgName + '\n' +a.importerInfo.address);
      let productLength = a.proformaInvoiceDtls.length;
      let x = '';
      for (const p of a.proformaInvoiceDtls) {
        productLength--;
        x += p.prodName;
        if (productLength !== 0) {
          x += ',\n';
        }
      }

      row.push(x);
      row.push(a.proformaInvoiceNo);
      const convertedDate = new Date(a.proformaDate);
      let d = '';
      d += convertedDate.getDate() + '/' + (convertedDate.getMonth() + 1) + '/' + convertedDate.getFullYear();
      row.push(d);
      let yLength = a.proformaInvoiceDtls.length;
      let y = '';
      for (const p of a.proformaInvoiceDtls) {
        yLength--;
        y += p.manufacturer;
        if (yLength !== 0) { y += ',\n'; }

      }
      row.push(y);
      row.push(a.countryOfOrigin);
      let bLength = a.proformaInvoiceDtls.length;
      let b = '';
      for (const p of a.proformaInvoiceDtls) {
        bLength--;
        b += p.packSize;
        if (bLength !== 0) {
          b += ',\n';
        }
      }
      row.push(b);
      if( this.proformaInvoiceSearchForm.value.status==='pending')
      {
      let cLength = a.proformaInvoiceDtls.length;
      let c = '';
      for (const p of a.proformaInvoiceDtls) {
        cLength--;
        // const apmt = p.approvedAmount === null || undefined ||
        //   '' ? '--' : (p.approvedAmount === 0 ? '--' : p.approvedAmount );
        let apmt;
        if( p.totalAmount === null || undefined ||'' || 0){
          apmt='--';
        }
        else{
          if(p.noOfUnits>0){ apmt=p.totalAmount + ' Unit';}
          if(p.totalAmount>0){ apmt=p.totalAmount + ' MT';}
        }
        c += apmt;
        if (cLength !== 0) {
          c += '\n';
        }

      }
      row.push(c);
    }


      let eLength = a.proformaInvoiceDtls.length;
      let e = '';
      for (const p of a.proformaInvoiceDtls) {
        eLength--;
        // const apmt = p.approvedAmount === null || undefined ||
        //   '' ? '--' : (p.approvedAmount === 0 ? '--' : p.approvedAmount );
        let apmt;
        if( p.approvedAmount === null || undefined ||'' || 0){
          apmt='--';
        }
        else{
          if(p.noOfUnits>0){ apmt=p.approvedAmount + ' Unit';}
          if(p.totalAmount>0){ apmt=p.approvedAmount + ' MT';}
        }
        e += apmt;
        if (eLength !== 0) {
          e += '\n';
        }

      }
      row.push(e);

      let gLength = a.proformaInvoiceDtls.length;
      let g = '';
      for (const p of a.proformaInvoiceDtls) {
        gLength--;
        const apmt = p.approvedAmount === null || undefined ||
          '' ? 'Pending' : (p.approvedAmount === 0 ? 'Rejected' : 'Approved');

        g += apmt;
        if (gLength !== 0) {
          g += ',\n';
        }

      }
      row.push(g);
      rowD.push(row);
      row = [];
    }
    this.getReport(col, rowD, title, enhance);
  }

  getReport(col: any[], rowD: any[], title: any, enhance) {
    const totalPagesExp = '{total_pages_count_string}';
    const pdf = new jsPDF('l', 'pt', 'a4');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(15);
    pdf.text('Government of the People\'s Republic of Bangladesh', 250, 40);
    pdf.setFontSize(13);
    pdf.text('Department of Livestock Services', 320, 55);
    pdf.setFontType('thin');
    pdf.setFontSize(11);
    pdf.text('Krishi Khamar Sarak, Farmgate, Dhaka-1215', 315, 70);
    pdf.setFontSize(11);
    pdf.text('www.dls.gov.bd', 370, 85);
    var fromDate = new Date(this.proformaInvoiceSearchForm.value.fromDate);
    const fDate = this.datePipe.transform(fromDate, "dd/MM/yyyy");
    var toDate = new Date(this.proformaInvoiceSearchForm.value.toDate);
    const tDate = this.datePipe.transform(toDate, "dd/MM/yyyy");
    debugger;
    pdf.text('Submission Date: ' + fDate+' - '+tDate, 315, 100);
    const image1 = new Image();
    image1.src = '../../../assets/img/logo/govt-logo.png';
    pdf.addImage(image1, 'jpeg', 170, 20, 50, 50);
    const image2 = new Image();
    image2.src = '../../../assets/img/logo/logo.png';
    pdf.addImage(image2, 'jpeg', 630, 20, 50, 50);
    // pdf.text("Email:", 450, 60); // 450 here is x-axis and 80 is y-axis
    // pdf.text("Phone:", 450, 80); // 450 here is x-axis and 80 is y-axis
    // pdf.text("" + title, 435, 100);  //
    pdf.setFontType('bold');
    pdf.text('Report Name: ', 40, 100);
    pdf.setFontType('normal');
    pdf.text('Proforma Invoice Summary Report', 110, 100);
    const pDate = this.datePipe.transform(new Date, "dd/MM/yyyy");
    pdf.text('Printing Date: ' + pDate, 680, 100);

    const pageContent = function (data) {
      // HEADER

      // FOOTER
      let str = 'Page ' + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = str + ' of ' + totalPagesExp;
      }
      pdf.setFontSize(9);
      const pageHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10); // showing current page number
    };
    pdf.autoTable(col, rowD,
      {
        theme: 'grid',
        // table: { fillColor: 255, textColor: 0, fontStyle: 'normal', lineWidth: 0.1 },
        // head: { textColor: 0, fillColor: [211,211,211], fontStyle: 'bold', lineWidth: 0 },
        // body: {},
        // foot: { textColor: 255, fillColor: [26, 188, 156], fontStyle: 'bold', lineWidth: 0 },
        // alternateRow: {},
        headStyles: { fillColor: [192, 192, 192], halign: 'center', valign: 'middle' },
        didParseCell: enhance ? this.enhanceWordBreak : null,
        // enhance working properly
        didDrawPage: pageContent,
        margin: { top: 110  ,left: 40},
        bodyStyles: { valign: 'middle', lineColor: [153, 153, 153] },

        styles: { overflow: 'linebreak', fontSize: 9, textColor: 0 },

        // font: "helvetica", 
        // fontStyle: 'normal',
      });

    // for adding total number of pages // i.e 10 etc
    if (typeof pdf.putTotalPages === 'function') {
      pdf.putTotalPages(totalPagesExp);
    }
       //------siam view pdf--------//
   // pdf.save(title + '.pdf');
      pdf.setProperties({
        title: title + ".pdf"
    });
   
   var blob = pdf.output("blob");
    window.open(URL.createObjectURL(blob));
     //------siam view pdf--------//
  }
  enhanceWordBreak({ doc, cell, column }) {
    if (cell === undefined) {
      return;
    }

    const hasCustomWidth = (typeof cell.styles.cellWidth === 'number');

    if (hasCustomWidth || cell.raw == null || cell.colSpan > 1) {
      return
    }

    let text;

    if (cell.raw instanceof Node) {
      text = cell.raw.innerText;
    } else {
      if (typeof cell.raw == 'object') {
        // not implemented yet
        // when a cell contains other cells (colSpan)
        return;
      } else {
        text = '' + cell.raw;
      }
    }

    // split cell string by space or "-"
    const words = text.split(/\s+|[?<=-]/);

    // calculate longest word width
    const maxWordUnitWidth = words.map(s => Math.floor(doc.getStringUnitWidth(s) * 100) / 100).reduce((a, b) => Math.max(a, b), 0);
    const maxWordWidth = maxWordUnitWidth * (cell.styles.fontSize / doc.internal.scaleFactor)

    const minWidth = cell.padding('horizontal') + maxWordWidth;

    // update minWidth for cell & column

    if (minWidth > cell.minWidth) {
      cell.minWidth = minWidth;
    }

    if (cell.minWidth > cell.wrappedWidth) {
      cell.wrappedWidth = cell.minWidth;
    }

    if (cell.minWidth > column.minWidth) {
      column.minWidth = cell.minWidth;
    }

    if (column.minWidth > column.wrappedWidth) {
      column.wrappedWidth = column.minWidth;
    }
  }
}
interface IUserIdDto {
  userId: number;
}
interface IProformaInvoiceSearchDto {
  userId: number;
  fromDate: Date | undefined | null;
  toDate: Date | undefined | null;
  status: string;
  searchText: string;
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