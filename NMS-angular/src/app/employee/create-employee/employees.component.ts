import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateEditEmployeeModalComponent, ICreateOrEditEmployeeDto } from './create-edit-employee-modal.component';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { EmployeeService } from 'src/app/_services/employee.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ViewEmployeeModalComponent } from './view-employee-modal-component.component';
import { AppComponentBase } from 'src/app/common/app-component-base';
import { IPagedResultDto, IGetAllInputFilterDto } from 'src/app/common/app-pagedResult';

@Component({
  selector: 'employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent extends AppComponentBase implements OnInit {

  @ViewChild('createOrEditEmployeeModal', { static: true }) createOrEditEmployeeModal: CreateEditEmployeeModalComponent;
  @ViewChild('viewEmployeeModalComponent', { static: true }) viewEmployeeModal: ViewEmployeeModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static:true}) paginator: Paginator;
  filterText = '';
  constructor(
    private _employeeService: EmployeeService,
    private _alertifyService: AlertifyService
  ) {
   super();
  }

  ngOnInit() {
  }

  getEmployees(event?: LazyLoadEvent) {
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
     this._employeeService.getEmployeeInfoes(fltr).subscribe(result => {
      //const e = result as ICreateOrEditEmployeeDto[];
      //this.primengTableHelper.records = e;
      //this.primengTableHelper.totalRecordsCount =20;
      const r = result as IPagedResultDto;
       this.primengTableHelper.totalRecordsCount = r.totalCount;
       this.primengTableHelper.records = r.items;
      this.primengTableHelper.hideLoadingIndicator();
    });
  }
  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  createEmployee(): void {
    this.createOrEditEmployeeModal.show();
  }

  deleteEmployee(employeeInfo: ICreateOrEditEmployeeDto): void {
    const result = confirm('are you sure want to remove?');
    if (result) {
      this._employeeService.deleteEmployeeInfoes(employeeInfo.id)
        .subscribe(() => {
          this.reloadPage();
          this._alertifyService.error('Successfully Deleted');
        });
    }
  }

}
