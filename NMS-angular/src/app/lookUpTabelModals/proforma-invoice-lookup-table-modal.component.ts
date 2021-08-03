import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/primeng';
import { ProformaInvoiceApprovalService } from '../_services/proforma-invoice-approval.service';
import { NocReportComponent } from '../noc-report/noc-report.component';
import { SharedDataService } from '../_services/shared-data.service';

@Component({
  selector: 'proformaInvoiceLookupTableModal',
  templateUrl: './proforma-invoice-lookup-table-modal.component.html',
  styleUrls: ['./proforma-invoice-lookup-table-modal.component.css']
})
export class ProformaInvoiceLookupTableModalComponent {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('nocReport', { static: true }) nocReport: NocReportComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  filterText = '';
  id: number;
  displayName: string;
  fromDate: any;
  toDate: any;
  p: any = 1;
  active = false;
  saving = false;
  records: IProformaInfoDto[] = [];
  constructor(
    private _proformaApprovalService: ProformaInvoiceApprovalService,
    private _sharedDataService: SharedDataService
  ) {
  }

  show(): void {
    this.active = true;
    this.getAll();
    this.modal.show();
  }

  getAll(event?: LazyLoadEvent) {
    if (!this.active) {
      return;
    }

    const proformaApprovalDateRange: IProformaApprovalDateRangeForNocDto = {
      fromDate: this.fromDate,
      toDate: this.toDate,
    };

    this._proformaApprovalService.getDateWiseApprovalProformaInvoice(proformaApprovalDateRange).subscribe(result => {
      this.records = result as IProformaInfoDto[];
    });
  }

  setAndSave(r: IProformaInfoDto) {
    
    // this.id = user.id;
    // this.displayName = user.displayName;
   // this.nocReport.getProformaInvoice(record);
   this._sharedDataService.record= r;
    this.active = false;
    this.modal.hide();
    this.modalSave.emit(null);
  }

  close(): void {
    this.active = false;
    this.modal.hide();
    this.modalSave.emit(null);
  }
  resetFilter(){
    this.filterText = '';
    this.p = 1;
  }
}
interface IProformaApprovalDateRangeForNocDto {
  fromDate: Date | undefined | null;
  toDate: Date | undefined | null;
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