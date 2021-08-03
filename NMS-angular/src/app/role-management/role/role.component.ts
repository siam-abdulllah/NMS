import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimengTableHelper } from 'src/app/helpers/PrimengTableHelper';
import { RoleService } from 'src/app/_services/role.service';
import { CreateEditRoleModalComponent, ICreateRoleDto } from './create-edit-role-modal.component';
import { Table } from 'primeng/table';
import { Paginator, LazyLoadEvent } from 'primeng/primeng';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { IGetAllInputFilterDto, IPagedResultDto } from 'src/app/common/app-pagedResult';

@Component({
  selector: 'Roles',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent {

  @ViewChild('createOrEditRoleModal', { static: true }) createOrEditRoleModal: CreateEditRoleModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static:true}) paginator: Paginator;
  filterText = '';

  primengTableHelper: PrimengTableHelper;

  constructor(
    private _roleService: RoleService,
    private _alertifyService: AlertifyService
  ) {
    this.primengTableHelper = new PrimengTableHelper();
  }


  getRoles(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.primengTableHelper.showLoadingIndicator();
     const fltr: IGetAllInputFilterDto = {
      filter: this.filterText,
      sorting:this.primengTableHelper.getSorting(this.dataTable),
      skipCount: this.primengTableHelper.getSkipCount(this.paginator,event),
      maxResultCount: this.primengTableHelper.getMaxResultCount(this.paginator, event)
    }
     this._roleService.getAllRoleInfos(fltr).subscribe(result => {
      const r = result as IPagedResultDto;
       this.primengTableHelper.totalRecordsCount = r.totalCount;
       this.primengTableHelper.records = r.items;
      this.primengTableHelper.hideLoadingIndicator();
    });
  }
  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  createRole(): void {
    this.createOrEditRoleModal.show();
  }

  deleteRole(role: ICreateRoleDto): void {
    const result = confirm('are you sure want to remove?');
    if (result) {
      this._roleService.deleteRoleInfo(role.id)
        .subscribe(() => {
          this.reloadPage();
          this._alertifyService.error('Successfully Deleted');
        });
    }
  }
}
