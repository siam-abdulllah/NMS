import { Component, ViewChild} from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator, LazyLoadEvent } from 'primeng/primeng';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { IGetAllInputFilterDto, IPagedResultDto } from '../common/app-pagedResult';
import { PrimengTableHelper } from '../helpers/PrimengTableHelper';
import { AnnualRequirementService } from '../_services/annual-requirement.service';
import { AlertifyService } from '../_services/alertify.service';
import { AnnualRequirementComponent } from '../annual-requirement/annual-requirement.component';
import { FormGroup } from '@angular/forms';

@Component({
  providers:[AnnualRequirementComponent ],
  selector: 'annualRequirementModal',
  templateUrl: './annual-requirement-lookup-table-modal.component.html',
  styleUrls: ['./annual-requirement-lookup-table-modal.component.css']
})
export class AnnualRequirementLookupTableModalComponent  {
  @ViewChild('annualReqsModal', { static: true }) annualReqsModal: ModalDirective;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  //@ViewChild('annualRequirement', { static: true }) annualRequirement: AnnualRequirementComponent;
  paramAnReqMstForm: FormGroup;
  filterText = '';
  primengTableHelper: PrimengTableHelper;
  modalRef: BsModalRef;
  active = false;
  annReqData: IAllAnnualRequirements;
  constructor(
    private alertify: AlertifyService,
    private annualRequirementService: AnnualRequirementService,
    private annReqComp: AnnualRequirementComponent
  ) { 
    this.primengTableHelper = new PrimengTableHelper();
  }

  show(paramMstForm: FormGroup): void {
    this.paramAnReqMstForm=paramMstForm;
    this.active = true;
    this.paginator.rows = 5;
   // this.getAll();
    this.annualReqsModal.show();
  }

  getAll(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.primengTableHelper.showLoadingIndicator();
    
    const fltr: IGetAllInputFilterDto = {
      filter: this.filterText,
      sorting: this.primengTableHelper.getSorting(this.dataTable),
      skipCount: this.primengTableHelper.getSkipCount(this.paginator, event),
      maxResultCount: this.primengTableHelper.getMaxResultCount(this.paginator, event)
    }
    this.annualRequirementService.getAllAnnualRequirementsNew(fltr).subscribe(result => {
      const a = result as IPagedResultDto;
      this.primengTableHelper.totalRecordsCount = a.totalCount;
      this.primengTableHelper.records = a.items;
      this.primengTableHelper.hideLoadingIndicator();
     // this.loading = false;
    }, err => {
     // this.loading = false;
      this.alertify.warning('No data found');
      console.log(err);
    });
  }
  
  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  selectAnnualReq(a: IAllAnnualRequirements) {
    this.annReqData=a;
    this.active = false;
    this.annualReqsModal.hide();
    this.annReqComp.selectAnnualReq(a);
  }

  close(): void {
    this.active = false;
    this.annualReqsModal.hide();
    //this.annualReqsModal.emit(null);
  }
  
}
interface IAllAnnualRequirements {
  id: number;
  annualReqNo: string;
  importerId: number;
  submissionDate: Date;
  confirmation: boolean;
  annualRequirementDtls: IAnnualRequirementDtl[];
}
interface IAnnualRequirementDtl {
  id: number;
  annReqMstId: number;
  prodName: string;
  prodType: string;
  hsCode: string;
  packSize: string;
  tentativeUnits: number;
  totalAmount: number;
}