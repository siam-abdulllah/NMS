import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { finalize } from 'rxjs/operators';
import { RoleService } from 'src/app/_services/role.service';

@Component({
  selector: 'createOrEditRoleModal',
  templateUrl: './create-edit-role-modal.component.html',
  styleUrls: ['./create-edit-role-modal.component.css']
})
export class CreateEditRoleModalComponent implements OnInit {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  role:CreateRoleDto = new CreateRoleDto();

  constructor(
    private _roleService: RoleService,
    private _alertifyService: AlertifyService
  ) {
   }

  ngOnInit() {
  }
  save(): void {
    this.saving = true;
    this._roleService.createRoleInfo(this.role)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        this._alertifyService.success('Saved Successfully');
        this.close();
        this.modalSave.emit(null);
      }, error => {
        console.log(error);
        this._alertifyService.error(error.error);
      });
  }
  update(role: CreateRoleDto): void {
    this.saving = true;
    this._roleService.editRoleInfo(role, role.id)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        this._alertifyService.success('Saved Successfully');
        this.close();
        this.modalSave.emit(null);
      }, error => {
        console.log(error);
        this._alertifyService.error(error.error);
      });
  }

  show(roleId?: number): void {
    if (!roleId) {
      this.role = new CreateRoleDto();
      this.role.id = roleId;

        this.active = true;
        this.modal.show();
      } 
      else {
        this._roleService.getRoleInfoById(roleId).subscribe(result => {
          const e = result as ICreateRoleDto
          e.id = roleId;
          this.role = e;
        });
        this.active = true;
        this.modal.show();
      }
  }
  close(): void {

    this.active = false;
    this.modal.hide();
  }
}

export interface ICreateRoleDto {
  name: string | undefined;
  fullName: string | undefined;
  id: number | undefined;
}

export class CreateRoleDto implements ICreateRoleDto {
  name: string | undefined;
  fullName: string | undefined;
  id: number | undefined;

  constructor(data?: ICreateRoleDto) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }
}


