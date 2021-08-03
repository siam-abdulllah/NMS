import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { CreateOrEditEmployeeDto } from './create-edit-employee-modal.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RegisterService } from 'src/app/_services/register.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'viewEmployeeModal',
  templateUrl: './view-employee-modal-component.component.html',
  styleUrls: ['./view-employee-modal-component.component.css']
})
export class ViewEmployeeModalComponent {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
    saving = false;
    changePasswordId=0;
    item: CreateOrEditEmployeeDto;
    employee:CreateOrEditEmployeeInfoDto= new CreateOrEditEmployeeInfoDto();

    constructor(
      private registerService: RegisterService,
      private alertify: AlertifyService
    ) {
        this.item = new CreateOrEditEmployeeDto();
    }

    show(item: CreateOrEditEmployeeDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    change():void{
      this.changePasswordId=1;
    }
     updatePssword(empId:any):void{
      
      this.saving = true;
      const employeeInfo: IChangePassDto = {
        employeeId: empId,
        newPassword:this.employee.password
      };
      this.registerService.changePasswordAdminSideEmployee(employeeInfo).subscribe(resp => {
        if (resp) {
          this.alertify.success('Password Updated Successful');
          this.close();
          this.modalSave.emit(null);
        }
      }, err => {
        console.log(err);
        this.alertify.error(err.error);
      });;
      
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
export class CreateOrEditEmployeeInfoDto{
  password: string | undefined;
  confirmPassword: string | undefined;
  id: number | undefined;
}
interface IChangePassDto {
  employeeId:number;
  newPassword: string;
}

