import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CurrencyService } from '../_services/currency.service';
import { AlertifyService } from '../_services/alertify.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import * as moment from 'moment';

@Component({
  selector: 'createOrEditCurrencyModal',
  templateUrl: './create-or-edit-currency-modal.component.html',
  styleUrls: ['./create-or-edit-currency-modal.component.css']
})
export class CreateOrEditCurrencyModalComponent implements OnInit {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  currencyRate: CurrencyRateDto = new CurrencyRateDto();

  constructor(
    private _currencyService: CurrencyService,
    private _alertifyService: AlertifyService
  ) {
  }

  ngOnInit() {
  }
  save(): void {
    this.saving = true;
    this._currencyService.createCurrencyRate(this.currencyRate)
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
  update(currencyRate: CurrencyRateDto): void {
    this.saving = true;
    this._currencyService.editCurrencyRate(currencyRate, currencyRate.id)
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

  show(currencyRateId?: number): void {
    if (!currencyRateId) {
      this.currencyRate = new CurrencyRateDto();
      this.currencyRate.id = currencyRateId;

      this.active = true;
      this.modal.show();
    }
    else {
      this._currencyService.getCurrencyRateById(currencyRateId).subscribe(result => {
        const e = result as ICurrencyRateDto
        e.id = currencyRateId;
        this.currencyRate = e;
        console.log("Currency");
        console.log(this.currencyRate);
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
export interface ICurrencyRateDto {
  creationTime: moment.Moment | undefined;
  lastModificationTime: moment.Moment | undefined;
  lastModifierUserId: number | undefined;
  creatorUserId: number | undefined;
  exchangeRate: number | undefined;
  tickerIcon: string | undefined;
  currency: string | undefined;
  id: number | undefined;
}
export class CurrencyRateDto implements ICurrencyRateDto {
  // 
  // this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
  // this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
  // this.lastModifierUserId = data["lastModifierUserId"];
  // this.creatorUserId = data["creatorUserId"];
  // 
  creationTime!: moment.Moment | undefined;
  lastModificationTime!: moment.Moment | undefined;
  lastModifierUserId!: number | undefined;
  creatorUserId!: number | undefined;
  exchangeRate: number | undefined;
  tickerIcon: string | undefined;
  currency: string | undefined;
  id: number | undefined;

  constructor(data?: ICurrencyRateDto) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }
}
