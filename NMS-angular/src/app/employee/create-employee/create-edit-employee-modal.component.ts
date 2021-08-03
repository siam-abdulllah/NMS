import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EmployeeService } from 'src/app/_services/employee.service';
import { finalize } from 'rxjs/operators';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'createOrEditEmployeeModal',
  templateUrl: './create-edit-employee-modal.component.html',
  styleUrls: ['./create-edit-employee-modal.component.css']
})
export class CreateEditEmployeeModalComponent implements OnInit {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  employeeForm: FormGroup;
  employee:CreateOrEditEmployeeDto= new CreateOrEditEmployeeDto();
  passwordMatch:boolean=false;

  constructor(
    private _employeeService: EmployeeService,
    private _alertifyService: AlertifyService
  ) {
   }

  ngOnInit() {
  }
  
  save(): void {
    this.saving = true;
    this._employeeService.saveEmployeeInfoes(this.employee)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        this._alertifyService.success('Saved Successfully');
        this.close();
        this.modalSave.emit(null);
      });
  }
  update(employee:CreateOrEditEmployeeDto): void {
    this.saving = true;
    this._employeeService.updateEmployeeInfoes(employee,employee.id)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        this._alertifyService.success('Saved Successfully');
        this.close();
        this.modalSave.emit(null);
      });
  }

  show(employeeId?: number): void {
    if (!employeeId) {
      this.employee = new CreateOrEditEmployeeDto();
      this.employee.id = employeeId;

        this.active = true;
        this.modal.show();
      } 
      else {
        this._employeeService.getEmployeeInfoById(employeeId).subscribe(result=>{
          const e = result as ICreateOrEditEmployeeDto
          e.id=employeeId;
          this.employee=e;
          console.log("Test");
          console.log(this.employee);
        });
        this.active = true;
        this.modal.show();
      }
  }
  passwordMatchValidator(password:any, confirmPassword:any) {
    if(password === confirmPassword){
     this.passwordMatch=true;
    }
    else{this.passwordMatch=false;}
  }


  close(): void {

    this.active = false;
    this.modal.hide();
  }
}

export interface ICreateOrEditEmployeeDto {
  empCode: string | undefined;
  empName: string | undefined;
  designation: string | undefined;
  email: string | undefined;
  contactNo: string | undefined;
  userId: number | undefined;
  username: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  id: number | undefined;
}

export class CreateOrEditEmployeeDto implements ICreateOrEditEmployeeDto {
  empCode: string | undefined;
  empName: string | undefined;
  designation: string | undefined;
  email: string | undefined;
  contactNo: string | undefined;
  userId: number | undefined;
  username: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  id: number | undefined;

  constructor(data?: ICreateOrEditEmployeeDto) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }
}


