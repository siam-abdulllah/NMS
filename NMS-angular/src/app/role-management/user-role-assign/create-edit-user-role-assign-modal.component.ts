import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserRoleAssignService } from 'src/app/_services/user-role-assign.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { finalize } from 'rxjs/operators';
import { RoleLookupTableModalComponent } from 'src/app/lookUpTabelModals/role-lookup-table-modal.component';
import { UserLookupTableModalComponent } from 'src/app/lookUpTabelModals/user-lookup-table-modal.component';

@Component({
  selector: 'createEditUserRoleAssignModal',
  templateUrl: './create-edit-user-role-assign-modal.component.html',
  styleUrls: ['./create-edit-user-role-assign-modal.component.css']
})
export class CreateEditUserRoleAssignModalComponent implements OnInit {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('userLookupTableModal', { static: true }) userLookupTableModal: UserLookupTableModalComponent;
  @ViewChild('roleLookupTableModal', { static: true }) roleLookupTableModal: RoleLookupTableModalComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  userRoleAssign: CreateUserRoleAssignDto = new CreateUserRoleAssignDto();
  userName = '';
  roleName='';

  constructor(
    private _userRoleAssignService: UserRoleAssignService,
    private _alertifyService: AlertifyService
  ) {
  }

  ngOnInit() {
  }

  save(): void {
    this.saving = true;
    this._userRoleAssignService.createUserRoleConf(this.userRoleAssign)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        this._alertifyService.success('Saved Successfully');
        this.close();
        this.modalSave.emit(null);
      },
      error => {
          console.log(error.error);
          this._alertifyService.warning(error.error);
      });
  }
  update(userRoleAssign: CreateUserRoleAssignDto): void {
    this.saving = true;
    this._userRoleAssignService.editUserRoleConf(userRoleAssign, userRoleAssign.id)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        this._alertifyService.success('Saved Successfully');
        this.close();
        this.modalSave.emit(null);
      });
  }

  show(userRoleAssignId?: number): void {
    if (!userRoleAssignId) {
      this.userRoleAssign = new CreateUserRoleAssignDto();
      this.userRoleAssign.id = userRoleAssignId;

      this.active = true;
      this.modal.show();
    }
    else {
      this._userRoleAssignService.getUserRoleConfById(userRoleAssignId).subscribe(result => {
        const e = result as ICreateUserRoleAssignDto
        e.id = userRoleAssignId;
        this.userRoleAssign = e;
        console.log("Test");
        console.log(this.userRoleAssign);
      });
      this.active = true;
      this.modal.show();
    }
  }

  openSelectUserModal() {
    this.userLookupTableModal.id = this.userRoleAssign.userId;
    this.userLookupTableModal.displayName = this.userName;
    this.userLookupTableModal.show();
  }
  setUserIdNull() {
    this.userRoleAssign.userId = null;
    this.userName = '';
  }
  getNewUserId() {
    this.userRoleAssign.userId = this.userLookupTableModal.id;
    this.userName = this.userLookupTableModal.displayName;
  }

  openSelectRoleModal() {
    this.roleLookupTableModal.id = this.userRoleAssign.roleId;
    this.roleLookupTableModal.displayName = this.roleName;
    this.roleLookupTableModal.show();
  }
  setRoleIdNull() {
    this.userRoleAssign.roleId = null;
    this.roleName = '';
  }
  getNewRoleId() {
    this.userRoleAssign.roleId = this.roleLookupTableModal.id;
    this.roleName = this.roleLookupTableModal.displayName;
  }

  close(): void {

    this.active = false;
    this.modal.hide();
  }
}

export interface ICreateUserRoleAssignDto {
  userName: string | undefined;
  roleName: string | undefined;
  userId: number | undefined;
  roleId: number | undefined;
  id: number | undefined;
}

export class CreateUserRoleAssignDto implements ICreateUserRoleAssignDto {
  userName: string | undefined;
  roleName: string | undefined;
  userId: number | undefined;
  roleId: number | undefined;
  id: number | undefined;

  constructor(data?: ICreateUserRoleAssignDto) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }
}
