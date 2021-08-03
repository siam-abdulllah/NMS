import { Component, ViewChild, Output, EventEmitter} from '@angular/core';
import { ILookupTableDto } from '../common/lookupTableDtos';
import { Table } from 'primeng/table';
import { Paginator, LazyLoadEvent } from 'primeng/primeng';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserRoleAssignService } from '../_services/user-role-assign.service';
import { IGetAllInputFilterDto, IPagedResultDto } from '../common/app-pagedResult';
import { PrimengTableHelper } from '../helpers/PrimengTableHelper';

@Component({
  selector: 'roleLookupTableModal',
  templateUrl: './role-lookup-table-modal.component.html',
  styleUrls: ['./role-lookup-table-modal.component.less']
})
export class RoleLookupTableModalComponent {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  filterText = '';
  id: number;
  displayName: string;
  fullName: string;

  active = false;
  saving = false;
  primengTableHelper: PrimengTableHelper;

  constructor(
    private _userRoleAssignService: UserRoleAssignService
  ) {
    this.primengTableHelper = new PrimengTableHelper();
  }

  show(): void {
    this.active = true;
    this.paginator.rows = 5;
    this.getAll();
    this.modal.show();
  }

  getAll(event?: LazyLoadEvent) {
    if (!this.active) {
      return;
    }

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

    this._userRoleAssignService.getAllRoleForLookupTable(fltr).subscribe(result => {
      const r = result as IPagedResultDto;
      this.primengTableHelper.totalRecordsCount = r.totalCount;
      this.primengTableHelper.records = r.items;
      this.primengTableHelper.hideLoadingIndicator();
    });
  }

  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  setAndSave(role: ILookupTableForAssignRoleDto) {
    this.id = role.id;
    this.displayName = role.displayName;
    this.fullName = role.fullName;

    this.active = false;
    this.modal.hide();
    this.modalSave.emit(null);
  }

  close(): void {
    this.active = false;
    this.modal.hide();
    this.modalSave.emit(null);
  }

}

export interface ILookupTableForAssignRoleDto {
  id: number | undefined;
  displayName: string | undefined;
  fullName: string | undefined;
}

