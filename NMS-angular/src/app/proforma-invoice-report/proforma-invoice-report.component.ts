import { Component, OnInit } from '@angular/core';
import { LoginService } from '../_services/login.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ProformaInvoiceReportService } from '../_services/proforma-invoice-report.service';
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { AlertifyService } from '../_services/alertify.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-proforma-invoice-report',
  templateUrl: './proforma-invoice-report.component.html',
  styleUrls: ['./proforma-invoice-report.component.css']
})
export class ProformaInvoiceReportComponent implements OnInit {
  proformaInvoiceSearchForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  bsValue: Date = new Date();
  searchText = '';
  proformaSearchDto: IProformaInvoiceSearchDto;
  porformaInfos: IProformaInfoDto[] = [];
  loading = false;
  p: any = 1;
  beforeFiveDayDate: any;
  constructor(
    private loginService: LoginService,
    private proformaReportService: ProformaInvoiceReportService,
    private alertify: AlertifyService,
    private datePipe: DatePipe

  ) { }

  ngOnInit() {
    this.getImporterWiseCurrentYearProforma();
    this.createProformaApprovalSearchForm();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-green' }, { dateInputFormat: 'DD/MM/YYYY' });
    this.bsValue = new Date();
    var pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    this.beforeFiveDayDate = this.datePipe.transform(pastDate, "dd/MM/yyyy");
    console.log("before 5 day : " + this.beforeFiveDayDate);

  }
  createProformaApprovalSearchForm() {
    this.proformaInvoiceSearchForm = new FormGroup({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      status: new FormControl('')
    });
  }
  getDateWiseProformaByImporter() {
    this.loading = true;
    // tslint:disable-next-line: radix
    const impId = parseInt(this.loginService.getEmpOrImpName());
    const proformaReportSearchDto: IProformaInvoiceSearchDto = {
      importerId: impId,
      fromDate: this.proformaInvoiceSearchForm.value.fromDate,
      toDate: this.proformaInvoiceSearchForm.value.toDate,
      status: this.proformaInvoiceSearchForm.value.status
    };
    this.proformaReportService.getDateWiseProformaByImporter(proformaReportSearchDto).subscribe(resp => {
      this.porformaInfos = resp as IProformaInfoDto[];
      this.loading = false;
      if (this.porformaInfos.length <= 0) {
        this.alertify.warning('No Data Found');
      }
      if (this.porformaInfos.length) {
        for (let p of this.porformaInfos) {
          if (p.approvalDate) {
            var aD = this.datePipe.transform(p.approvalDate, "dd/MM/yyyy")
            if (aD >= this.beforeFiveDayDate) {
              for (let d of p.proformaInvoiceDtls) {
                d.approvedAmount = null;
                d.remarks = null;
              //  this.proformaInvoiceSearchForm.value.status=pending;
              }
            }
          }

        }
      }

    }, error => {
      console.log(error);
    });
  }
  getImporterWiseCurrentYearProforma() {
    this.loading = true;
    const impId = this.loginService.getEmpOrImpName();
    const impIdDto: IImporterIdDto = {
      importerId: impId
    };
    this.proformaReportService.getImporterWiseCurrentYearProforma(impIdDto).subscribe(resp => {
      this.porformaInfos = resp as IProformaInfoDto[];
      if (this.porformaInfos.length) {
        for (let p of this.porformaInfos) {
          if (p.approvalDate) {
            var aD = this.datePipe.transform(p.approvalDate, "dd/MM/yyyy")
            if (aD >= this.beforeFiveDayDate) {
              for (let d of p.proformaInvoiceDtls) {
                d.approvedAmount = null;
                d.remarks = null;
              }
            }
          }

        }
      }

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
  viewProformaSummaryReport() {
    if (this.porformaInfos.length <= 0) {
      this.alertify.warning('No Data to Show Report');
      return false;
    }
    // const doc = new jsPDF();
    // doc.text("Hello there", 15, 15);
    // doc.save('first.pdf');
    let orgName;
    let orgAddress
    const r = this.porformaInfos as IProformaInfoDto[];
    for (let i of r) {
      orgName = i.importerInfo.orgName;
      orgAddress = i.importerInfo.address;
    }
    let row: any[] = [];
    let rowD: any[] = [];
    let col = ['SL \nNO.', 'Name OF \nImporter', 'Products', 'PI \nNo.', 'PI \nDate', 'Manufacturer',
      'Exporter', 'Country \nOf Origin', 'Pack \nSize', 'PI Amount \n(Ton/Unit)', 'Amount \nApproval \n(MT/Unit)', 'Status', 'Remarks']; // initialization for headers
    // let col = ['SL NO.','Name OF Importer','Products','PI No.','PI Date','Manufacturer',
    // 'Exporter', 'Country Of Origin','Pack Size','Approval Amount MT','Approval Amount Unit', 'Status'];
    let title = "Proforma Invoice Summary Report"; // title of report
    let slNO = 0;
    for (const a of r) {
      console.log(r);
      row.push(++slNO);
      row.push(a.importerInfo.orgName);

      let productLength = a.proformaInvoiceDtls.length;
      let x = '';
      for (const p of a.proformaInvoiceDtls) {
        productLength--;
        x += p.prodName;
        if (productLength != 0) { x += ',\n' };

      }
      row.push(x);
      row.push(a.proformaInvoiceNo);
      //row.push(a.proformaDate);

      const convertedDate = new Date(a.proformaDate);
      let d = '';
      d += convertedDate.getDate() + '/' + (convertedDate.getMonth() + 1) + '/' + convertedDate.getFullYear();
      row.push(d);

      let yLength = a.proformaInvoiceDtls.length;
      let y = '';
      for (const p of a.proformaInvoiceDtls) {
        yLength--;
        y += p.manufacturer;
        if (yLength != 0) { y += ',\n' };

      }
      row.push(y);
      row.push(a.portOfLoading);
      row.push(a.countryOfOrigin);

      let bLength = a.proformaInvoiceDtls.length;
      let b = '';
      for (const p of a.proformaInvoiceDtls) {
        bLength--;
        b += p.packSize;
        if (bLength != 0) { b += ',\n' };

      }
      row.push(b);

      let cLength = a.proformaInvoiceDtls.length;
      let c = '';
      for (const p of a.proformaInvoiceDtls) {
        cLength--;
        if (p.totalAmount > 0) {
          c += p.totalAmount + " MT";
        }
        if (p.noOfUnits > 0) {
          c += p.noOfUnits + " Unit";
        }
        if (cLength != 0) { c += ',\n' };

      }
      row.push(c);

      let eLength = a.proformaInvoiceDtls.length;
      let e = '';
      for (const p of a.proformaInvoiceDtls) {
        eLength--;
        // let apmt = p.approvedAmount === null || undefined ||
        //   '' ? "---" : (p.approvedAmount == 0 ? "---" : p.approvedAmount )
        let apmt;
        if (p.approvedAmount === null || undefined || '' || 0) {
          apmt = '--';
        }
        else {
          if (p.noOfUnits > 0) { apmt = p.approvedAmount + ' Unit'; }
          if (p.totalAmount > 0) { apmt = p.approvedAmount + ' MT'; }
        }

        e += apmt;
        if (eLength != 0) { e += '\n' };

      }
      row.push(e);

      let gLength = a.proformaInvoiceDtls.length;
      let g = '';
      for (const p of a.proformaInvoiceDtls) {
        gLength--;
        let apmt = p.approvedAmount === null || undefined ||
          '' ? "Pending" : (p.approvedAmount == 0 ? "Rejected" : "Approved")
        g += apmt;
        if (gLength != 0) { g += ',\n' };
      }
      row.push(g);

      let hLength = a.proformaInvoiceDtls.length;
      let h = '';
      for (const p of a.proformaInvoiceDtls) {
        hLength--;
        let remarks = p.remarks === null || undefined ||
          '' ? " --- " : p.remarks;
        h += remarks;
        if (hLength != 0) { h += ',\n' };
      }
      row.push(h);

      rowD.push(row);
      row = [];
    }
    this.getReport(col, rowD, title, orgName, orgAddress);
  }

  getReport(col: any[], rowD: any[], title: any, orgName: any, orgAddress: any) {
    const totalPagesExp = "{total_pages_count_string}";
    const pdf = new jsPDF('l', 'pt', 'a4');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFontType('bold');
    pdf.text('Organization Name', 40, 60);
    pdf.setFontType('normal');
    pdf.text(': ' + orgName, 150, 60);
    pdf.setFontType('bold');
    pdf.text('Address', 40, 80);
    pdf.setFontType('normal');
    pdf.text(': ' + orgAddress, 150, 80);

    pdf.setFontType('bold');
    pdf.text('Report Name', 40, 100);
    pdf.setFontType('normal');
    pdf.text(': Proforma Invoice Report', 150, 100);
    const pDate = this.datePipe.transform(new Date, "dd/MM/yyyy");
    pdf.text('Printing Date: ' + pDate, 680, 100);
    var pageContent = function (data) {
      // HEADER

      // FOOTER
      var str = "Page " + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = str + " of " + totalPagesExp;
      }
      pdf.setFontSize(9);
      var pageHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10); // showing current page number
    };
    pdf.autoTable(col, rowD,
      {
        theme: "grid",
        // table: { fillColor: 255, textColor: 0, fontStyle: 'normal', lineWidth: 0.1 },
        //head: { textColor: 0, fillColor: [211,211,211], fontStyle: 'bold', lineWidth: 0 },
        // body: {},
        // foot: { textColor: 255, fillColor: [26, 188, 156], fontStyle: 'bold', lineWidth: 0 },
        // alternateRow: {},
        headStyles: { fillColor: [192, 192, 192] },


        didDrawPage: pageContent,
        margin: { top: 110 },
        bodyStyles: { valign: 'middle', lineColor: [153, 153, 153] },

        styles: { overflow: 'linebreak', cellWidth: 'wrap', fontSize: 9, textColor: 0 },

      });

    //for adding total number of pages // i.e 10 etc
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


}
interface IImporterIdDto {
  importerId: number;
}
interface IProformaInvoiceSearchDto {
  importerId: number;
  fromDate: Date | undefined | null;
  toDate: Date | undefined | null;
  status: string;
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
