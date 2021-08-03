import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetImporterForViewDto } from './importer-management.component';
import { RegisterService } from 'src/app/_services/register.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'viewImporterModal',
  templateUrl: './view-importer-modal.component.html',
  styleUrls: ['./view-importer-modal.component.css']
})
export class ViewImporterModalComponent {

  @ViewChild('createOrEditModal', { static: false }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
    saving = false;
    changePasswordId=0;
    item: GetImporterForViewDto;
    importer:CreateOrEditImporterDto= new CreateOrEditImporterDto();

    constructor(
      private registerService: RegisterService,
      private alertify: AlertifyService

    ) {
        this.item = new GetImporterForViewDto();
    }

    show(item: GetImporterForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    change():void{
      this.changePasswordId=1;
    }
    updatePssword(importerId:any):void{
      
      this.importer.id=importerId;
      console.log(this.importer);
      this.saving = true;
      const importer: IChangePassDto = {
        importerId: importerId,
        newPassword:this.importer.password
      };
      this.registerService.changePasswordAdminSide(importer).subscribe(resp => {
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

export class CreateOrEditImporterDto{
  password: string | undefined;
  confirmPassword: string | undefined;
  id: number | undefined;
}
interface IChangePassDto {
  importerId: number;
  newPassword: string;
}

