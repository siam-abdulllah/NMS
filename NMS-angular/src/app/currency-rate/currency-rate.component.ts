import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateOrEditCurrencyModalComponent } from './create-or-edit-currency-modal.component';
import { Table } from 'primeng/table';
import { Paginator, LazyLoadEvent } from 'primeng/primeng';
import { PrimengTableHelper } from '../helpers/PrimengTableHelper';
import { CurrencyService } from '../_services/currency.service';
import { AlertifyService } from '../_services/alertify.service';
import { IGetAllInputFilterDto, IPagedResultDto } from '../common/app-pagedResult';
import * as moment from 'moment';

@Component({
  selector: 'app-currency-rate',
  templateUrl: './currency-rate.component.html',
  styleUrls: ['./currency-rate.component.css']
})
export class CurrencyRateComponent {

  @ViewChild('createOrEditCurrencyModal', { static: true }) createOrEditCurrencyModal: CreateOrEditCurrencyModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  filterText = '';

  primengTableHelper: PrimengTableHelper;

  constructor(
    private _currencyService: CurrencyService,
    private _alertifyService: AlertifyService
  ) {
    this.primengTableHelper = new PrimengTableHelper();
  }


  getAllCurrency(event?: LazyLoadEvent) {
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
    this._currencyService.getAllCurrencyRates(fltr).subscribe(result => {
      const r = result as IPagedResultDto;
      
      console.log(r);
      this.primengTableHelper.totalRecordsCount = r.totalCount;
      this.primengTableHelper.records = r.items;
      this.primengTableHelper.hideLoadingIndicator();
    });
  }
  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  createCurrency(): void {
    this.createOrEditCurrencyModal.show();
  }

  deleteCurrency(currency: ICurrencyRateDto): void {
    const result = confirm('are you sure want to remove?');
    if (result) {
      this._currencyService.deleteCurrencyRate(currency.id)
        .subscribe(() => {
          this.reloadPage();
          this._alertifyService.error('Successfully Deleted');
        });
    }
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
