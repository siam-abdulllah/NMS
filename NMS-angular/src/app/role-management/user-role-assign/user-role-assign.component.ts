import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateEditUserRoleAssignModalComponent, ICreateUserRoleAssignDto } from './create-edit-user-role-assign-modal.component';
import { Table } from 'primeng/table';
import { Paginator, LazyLoadEvent } from 'primeng/primeng';
import { PrimengTableHelper } from 'src/app/helpers/PrimengTableHelper';
import { UserRoleAssignService } from 'src/app/_services/user-role-assign.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { IGetAllInputFilterDto, IPagedResultDto } from 'src/app/common/app-pagedResult';

@Component({
  selector: 'UserRoleAssign',
  templateUrl: './user-role-assign.component.html',
  styleUrls: ['./user-role-assign.component.css']
})
export class UserRoleAssignComponent{
 
  @ViewChild('createEditUserRoleAssignModal', { static: true }) createEditUserRoleAssignModal: CreateEditUserRoleAssignModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static:true}) paginator: Paginator;
  filterText = '';

  primengTableHelper: PrimengTableHelper;

  constructor(
    private _userRoleAssignService: UserRoleAssignService,
    private _alertifyService: AlertifyService
  ) {
    this.primengTableHelper = new PrimengTableHelper();
  }


  getUserRoles(event?: LazyLoadEvent) {
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
     this._userRoleAssignService.getAllUserRoleConfs(fltr).subscribe(result => {
      const r = result as IPagedResultDto;
       this.primengTableHelper.totalRecordsCount = r.totalCount;
       this.primengTableHelper.records = r.items;
      this.primengTableHelper.hideLoadingIndicator();
    });
  }
  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  createUserRole(): void {
    this.createEditUserRoleAssignModal.show();
  }

  deleteUserRole(role: ICreateUserRoleAssignDto): void {
    const result = confirm('are you sure want to remove?');
    if (result) {
      this._userRoleAssignService.deleteUserRoleConf(role.id)
        .subscribe(() => {
          this.reloadPage();
          this._alertifyService.error('Successfully Deleted');
        });
    }
  }
}
