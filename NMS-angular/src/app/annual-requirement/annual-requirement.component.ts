import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyService } from '../_services/currency.service';
import { AlertifyService } from '../_services/alertify.service';
import { LoginService } from '../_services/login.service';
import { AnnualRequirementService } from '../_services/annual-requirement.service';
import { IGetAllInputFilterDto, IPagedResultDto } from '../common/app-pagedResult';
import { Paginator, LazyLoadEvent } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from '../helpers/PrimengTableHelper';
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { IGetImporterForViewDto } from '../importer/importer-management/importer-management.component';
@Component({
  selector: 'app-annual-requirement',
  templateUrl: './annual-requirement.component.html',
  styleUrls: ['./annual-requirement.component.css']
})
export class AnnualRequirementComponent implements OnInit {
  @ViewChild('annualReqsModal', { static: false }) annualReqsModal: TemplateRef<any>;
  @ViewChild('taskmodal', { static: false }) requirementmodal: TemplateRef<any>;
  @ViewChild('confirmModal', { static: false }) confirmModal: TemplateRef<any>;
  @ViewChild('annualReqSubmissionConfirmModal', { static: false }) annualReqSubmissionConfirmModal: TemplateRef<any>;
  //
  @ViewChild('annualReqsModalNew', { static: true }) annualReqsModalNew: ModalDirective;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  filterText = '';
  primengTableHelper: PrimengTableHelper;
  active = false;
  //
  modalRef: BsModalRef;
  annualReqSubmissionConfirmRef: BsModalRef;
  annualRequirementsForm: FormGroup;
  annualRequirementMstForm: FormGroup;
  annualReqNo: any;
  mstNo: number;
  currencies: ICurrency[];
  annualRequirements: IAnnualRequirementDtl[] = [];
  modalTitle = '';
  addMode = false;
  editMode = false;
  updateProd: IAnnualRequirementDtl;
  annReqs: IAllAnnualRequirements[] = [];
  updateProdType = '';
  public loading = false;
  searchText = '';
  p: any = 1;
  currentDateString = new Date();
  annReqUpdateMode = false;
  userRole: any;
  checkImporterId: any;
  submissionDateReport: string;
  submitButtonDisable = true;
  saveUpdateMsg = '';
  isSubmitted = false;
  updateBtnDisable = false;
  saveButtonTitle = 'Save';
  importerInfo: IGetImporterForViewDto;
  orgName='';
  //Product Type
  productTypes = [
    { id: 1, name: 'Acidifier/mold inhibitory Meal' },
    { id: 2, name: 'Active Yeasts' },
    { id: 3, name: 'Ammonia gas reducer' },
    { id: 4, name: 'Anticaking agent' },
    { id: 5, name: 'Antioxidants' },
    { id: 6, name: 'Appetizer' },
    { id: 7, name: 'Betaine' },
    { id: 8, name: 'Bolus (Vit/min/prebiotics/probiotics)' },
    { id: 9, name: 'Choline Chloride' },
    { id: 10, name: 'Coccidiostat' },
    { id: 11, name: 'Copper Sulphate' },
    { id: 12, name: 'Corn Gluten Meal' },
    { id: 13, name: 'Corn Proein Concentrate' },
    { id: 14, name: 'Corn/Maize' },
    { id: 15, name: 'Cottonseed Extraction' },
    { id: 16, name: 'Customised premix' },
    { id: 17, name: 'DDGS' },
    { id: 18, name: 'De Oil Rice Bran' },
    { id: 19, name: 'Di-calcium Phosphate (DCP)' },
    { id: 20, name: 'Disinfectants' },
    { id: 21, name: 'Disodium Sulphate' },
    { id: 22, name: 'Emulsifier' },
    { id: 23, name: 'Enzymes' },
    { id: 24, name: 'Ferrous Sulphate' },
    { id: 25, name: 'Fish Meal' },
    { id: 26, name: 'Fish Oil (feed grade)' },
    { id: 27, name: 'Flavoring agent/Sweetner' },
    { id: 28, name: 'Flours & Meals of Soyabeans' },
    { id: 29, name: 'Hypochlorous acid' },
    { id: 30, name: 'Immune enhancer' },
    { id: 31, name: 'Inactive yeast/single cell microbes (dead)' },
    { id: 32, name: 'Kidney protector' },
    { id: 33, name: 'L-Agrinine' },
    { id: 34, name: 'L-Threonine' },
    { id: 35, name: 'L-Tryptophan' },
    { id: 36, name: 'L-Valine' },
    { id: 37, name: 'Lecithins & other Phosphoaminolipids' },
    { id: 38, name: 'Lice Controller' },
    { id: 39, name: 'Limestone' },
    { id: 40, name: 'Liver protector' },
    { id: 41, name: 'Lysine' },
    { id: 42, name: 'Methionine' },
    { id: 43, name: 'Mono/Tricalcium Phosphate' },
    { id: 44, name: 'Nucleic acids & their salts' },
    { id: 45, name: 'Oil cake & other solid residue of soybean oil' },
    { id: 46, name: 'Organic acids' },
    { id: 47, name: 'Others' },
    { id: 48, name: 'Palm Kernal Cake' },
    { id: 49, name: 'Pellet binder' },
    { id: 50, name: 'Phytogenic essential oils' },
    { id: 51, name: 'Pigmenter' },
    { id: 52, name: 'Plant extracts (feed grade)' },
    { id: 53, name: 'Poultry Meal' },
    { id: 54, name: 'Poultry/Dairy Supplement & Additives' },
    { id: 55, name: 'Preservatives' },
    { id: 56, name: 'Probiotics/Prebiotics/combination' },
    { id: 57, name: 'Rapeseed Extraction' },
    { id: 58, name: 'Raw milk preservatives' },
    { id: 59, name: 'Sea Weeds & Algae' },
    { id: 60, name: 'Sodium Hydrogen Sulphate' },
    { id: 61, name: 'Sodium/Calcium butyrate' },
    { id: 62, name: 'Stabilizer/indicator' },
    { id: 63, name: 'Toxin binder & deactivator' },
    { id: 64, name: 'Vegetable fats' },
    { id: 65, name: 'Veterinary Medicine (Antibiotics)' },
    { id: 66, name: 'Veterinary Medicine (Hormones)' },
    { id: 67, name: 'Veterinary Medicine (Other products)' },
    { id: 68, name: 'Vit or Min or Aminoacids premix or their combination (feed grade)' },
    { id: 69, name: 'Vit/Min/Aminoacids Premix or Combination' },
    { id: 70, name: 'Wheat Bran' },
    { id: 71, name: 'Veterinary Medicine (Vaccine)' },
  ];
  //selectedProductType=1;
  //prodType='Acidifier/mold inhibitory Meal';
  selectedProductId: number;
  //


  todayDate = this.currentDateString.getDate() + '/' + (this.currentDateString.getMonth() + 1) + '/' + this.currentDateString.getFullYear();
  constructor(
    private modalService: BsModalService,
    private currencyService: CurrencyService,
    private alertify: AlertifyService,
    private loginService: LoginService,
    private annualRequirementService: AnnualRequirementService,
    private datePipe: DatePipe
  ) {
    this.primengTableHelper = new PrimengTableHelper();
  }

  ngOnInit() {
    this.createAnnualRequirementForm();
    //this.getCurrencies();
    this.createAnnualRequirementMstForm();
    this.checkUserRole();
  }
  //
  getAll(event?: LazyLoadEvent) {
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

    if (this.userRole == "SA") {
      this.annualRequirementService.getAllAnnualRequirementsNew(fltr).subscribe(result => {
        const a = result as IPagedResultDto;
        console.log(a);
        this.primengTableHelper.totalRecordsCount = a.totalCount;
        this.primengTableHelper.records = a.items;
        this.primengTableHelper.hideLoadingIndicator();
        // this.loading = false;
      }, err => {
        // this.loading = false;
        this.alertify.warning('No data found');
        console.log(err);
      });
    }
  }
  getAllAnnualRequirements2(event?: LazyLoadEvent) {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //   this.paginator.changePage(0);
    //   return;
    // }

    // this.primengTableHelper.showLoadingIndicator();

    // const fltr: IGetAllInputFilterDto = {
    //   filter: this.filterText,
    //   sorting: this.primengTableHelper.getSorting(this.dataTable),
    //   skipCount: this.primengTableHelper.getSkipCount(this.paginator, event),
    //   maxResultCount: this.primengTableHelper.getMaxResultCount(this.paginator, event)
    // }
    this.loading = true;
    this.annualRequirementService.getAllAnnualRequirements().subscribe(resp => {
      this.annReqs = resp as IAllAnnualRequirements[];
      this.openModal(this.annualReqsModal);
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alertify.warning('No data found');
      console.log(err);
    });
  }

  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }
  //
  checkUserRole() {
    this.userRole = this.loginService.getUserRole();
    if (this.userRole == "SA") {
      this.annReqUpdateMode = true;
    }
  }
  createAnnualRequirementMstForm() {
    this.annualRequirementMstForm = new FormGroup({
      annualReqNo: new FormControl(''),
      submissionDate: new FormControl('')
    });
  }
  createAnnualRequirementForm() {
    this.annualRequirementsForm = new FormGroup({
      prodName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      // prodType: new FormControl('', [
      //   Validators.required,
      //   Validators.maxLength(500)
      // ]),
      prodType: new FormControl('Acidifier/mold inhibitory Meal', [Validators.required]),
      hsCode: new FormControl('', [
        Validators.required,
        Validators.maxLength(20)
      ]),
      // manufacturer: new FormControl('', [
      //   Validators.required,
      //   Validators.maxLength(100)
      // ]),
      // countryOfOrigin: new FormControl('', [
      //   Validators.required,
      //   Validators.maxLength(20)
      // ]),
      packSize: new FormControl('', [
        Validators.required,
        Validators.maxLength(100)
      ]),
      // tentativeUnits: new FormControl('', [
      //   Validators.required,
      //   Validators.maxLength(8),
      //   Validators.pattern(/^[0-9]+(.[0-9]{1,2})?$/)
      // ]),
      tentativeUnits: new FormControl('', [
        //  Validators.required,
        //   Validators.maxLength(8),
        Validators.pattern(/^[0-9]+(.[0-9]{1,2})?$/)
      ]),

      totalAmount: new FormControl('', [
        //   Validators.required,
        //   Validators.maxLength(6),
        Validators.pattern(/^[0-9]+(.[0-9]{1,2})?$/)
      ]),
      // unitPrice: new FormControl('', [
      //   Validators.required,
      //   Validators.maxLength(8),
      //   Validators.pattern(/^[0-9]+(.[0-9]{1,2})?$/)
      // ]),
      // currency: new FormControl('', [Validators.required]),
      // exchangeRate: new FormControl('', [Validators.required]),
      // totalPrice: new FormControl('', Validators.required),
      // totalPriceInBdt: new FormControl('', Validators.required)
    });
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      keyboard: false,
      class: 'modal-lg',
      ignoreBackdropClick: true
    });
  }
  openConfirmModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      keyboard: false,
      class: 'modal-md',
      ignoreBackdropClick: true
    });
  }
  openRequireModal(mode: string) {
    if (mode === 'add') {
      this.modalTitle = 'Add Product';
      this.annualRequirementsForm.reset();
      //this.annualRequirementsForm.get('currency').setValue('');
    }
    if (mode === 'update') {
      this.modalTitle = 'Update Product';
    }
    this.editMode = false;
    this.addMode = true;
    this.openModal(this.requirementmodal);
  }
  // getCurrencies() {
  //   this.currencyService.getCurrency().subscribe(
  //     resp => {
  //       this.currencies = resp as ICurrency[];
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  // }
  resetFilter() {
    this.searchText = '';
    this.p = 1;
  }
  // onCUrrencyChange() {
  //   const curren = this.annualRequirementsForm.value.currency;
  //   let exchRate = 0;
  //   // tslint:disable-next-line: only-arrow-functions
  //   this.currencies.forEach(function (item, index) {
  //     if (item.currency === curren) {
  //       exchRate = item.exchangeRate;
  //     }
  //   });
  //   const unitPrice = this.annualRequirementsForm.value.unitPrice;
  //   const tentaUnit = this.annualRequirementsForm.value.tentativeUnits;
  //   const totalAmount = this.annualRequirementsForm.value.totalAmount;
  //   if (tentaUnit > 0) {
  //     const totalPriceInForeignCurrency = unitPrice * tentaUnit;
  //     const totPriceInBdt = totalPriceInForeignCurrency * exchRate;
  //     this.annualRequirementsForm.get('exchangeRate').setValue(exchRate);
  //     this.annualRequirementsForm.get('totalPrice').setValue(totalPriceInForeignCurrency);
  //     this.annualRequirementsForm.get('totalPriceInBdt').setValue(totPriceInBdt);
  //   }
  //   else {
  //     const totalPriceInForeignCurrency = unitPrice * totalAmount;
  //     const totPriceInBdt = totalPriceInForeignCurrency * exchRate;
  //     this.annualRequirementsForm.get('exchangeRate').setValue(exchRate);
  //     this.annualRequirementsForm.get('totalPrice').setValue(totalPriceInForeignCurrency);
  //     this.annualRequirementsForm.get('totalPriceInBdt').setValue(totPriceInBdt);
  //   }

  // }
  // resetCurrency() {
  //   this.annualRequirementsForm.get('currency').setValue('');
  // }
  //Ashiq created
  isDisableTon() {
    let isDisableTon = this.annualRequirementsForm.value.tentativeUnits;
    if (isDisableTon) {
      this.annualRequirementsForm.controls['totalAmount'].disable();
    }
    else {
      this.annualRequirementsForm.controls['totalAmount'].enable();
    }
  }
  isDisableUnit() {
    let isDisableUnit = this.annualRequirementsForm.value.totalAmount;
    if (isDisableUnit) {
      this.annualRequirementsForm.controls['tentativeUnits'].disable();
    }
    else {
      this.annualRequirementsForm.controls['tentativeUnits'].enable();
    }
  }
  //
  addUpdateProduct() {

    if (this.addMode === true) {
      const a: IAnnualRequirementDtl = {
        id: 0,
        annReqMstId: 0,
        prodName: this.annualRequirementsForm.value.prodName,
        prodType: this.annualRequirementsForm.value.prodType,
        hsCode: this.annualRequirementsForm.value.hsCode,
        packSize: this.annualRequirementsForm.value.packSize,
        //manufacturer: this.annualRequirementsForm.value.manufacturer,
        // countryOfOrigin: this.annualRequirementsForm.value.countryOfOrigin,
        tentativeUnits: this.annualRequirementsForm.value.tentativeUnits,
        // unitPrice: this.annualRequirementsForm.value.unitPrice,
        // totalPrice: this.annualRequirementsForm.value.totalPrice,
        // totalPriceInBdt: this.annualRequirementsForm.value.totalPriceInBdt,
        //currency: this.annualRequirementsForm.value.currency,
        //exchangeRate: this.annualRequirementsForm.value.exchangeRate,
        totalAmount: this.annualRequirementsForm.value.totalAmount
      };
      for (const i of this.annualRequirements) {
        if (i.prodName === a.prodName && i.packSize == a.packSize) {
          this.alertify.warning('duplicate product');
          return false;
        }
      }
      this.annualRequirements.push(a);
      this.modalRef.hide();
      this.annualRequirementsForm.reset();
    }
    if (this.editMode === true) {
      const a: IAnnualRequirementDtl = {
        id: 0,
        annReqMstId: 0,
        prodName: this.annualRequirementsForm.value.prodName,
        prodType: this.annualRequirementsForm.value.prodType,
        hsCode: this.annualRequirementsForm.value.hsCode,
        packSize: this.annualRequirementsForm.value.packSize,
        // manufacturer: this.annualRequirementsForm.value.manufacturer,
        // countryOfOrigin: this.annualRequirementsForm.value.countryOfOrigin,
        tentativeUnits: this.annualRequirementsForm.value.tentativeUnits,
        // unitPrice: this.annualRequirementsForm.value.unitPrice,
        // totalPrice: this.annualRequirementsForm.value.totalPrice,
        // totalPriceInBdt: this.annualRequirementsForm.value.totalPriceInBdt,
        // currency: this.annualRequirementsForm.value.currency,
        // exchangeRate: this.annualRequirementsForm.value.exchangeRate,
        totalAmount: this.annualRequirementsForm.value.totalAmount
      };
      this.annualRequirements.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).prodType = a.prodType;
      this.annualRequirements.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).hsCode = a.hsCode;
      this.annualRequirements.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).packSize = a.packSize;
      // this.annualRequirements.find(
      //   item => item.prodName === this.updateProd.prodName
      // ).manufacturer = a.manufacturer;
      // this.annualRequirements.find(
      //   item => item.prodName === this.updateProd.prodName
      // ).countryOfOrigin = a.countryOfOrigin;
      this.annualRequirements.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).tentativeUnits = a.tentativeUnits;
      // this.annualRequirements.find(
      //   item => item.prodName === this.updateProd.prodName
      // ).unitPrice = a.unitPrice;
      // this.annualRequirements.find(
      //   item => item.prodName === this.updateProd.prodName
      // ).totalPrice = a.totalPrice;
      // this.annualRequirements.find(
      //   item => item.prodName === this.updateProd.prodName
      // ).totalPriceInBdt = a.totalPriceInBdt;
      // this.annualRequirements.find(
      //   item => item.prodName === this.updateProd.prodName
      // ).currency = a.currency;
      // this.annualRequirements.find(
      //   item => item.prodName === this.updateProd.prodName
      // ).exchangeRate = a.exchangeRate;
      this.annualRequirements.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).totalAmount = a.totalAmount;
      this.annualRequirements.find(
        item => item.prodName === this.updateProd.prodName && item.packSize === this.updateProd.packSize
      ).prodName = a.prodName;
      this.modalRef.hide();
      this.annualRequirementsForm.reset();
    }
  }
  removeProduct(p: IAnnualRequirementDtl) {
    debugger;
    if (this.annReqUpdateMode === true) {
      this.alertify.warning('Delete option disabled for old annual requirements');
      return false;
    }
    const result = confirm('Are you sure want to delete?');
    if (result === true) {
      for (let i = 0; i < this.annualRequirements.length; i++) {
        if (this.annualRequirements[i].prodName === p.prodName) {
          this.annualRequirements.splice(i, 1);
        }
      }
    } else {
      return;
    }
  }
  editProduct(p: IAnnualRequirementDtl) {

    if (this.annReqUpdateMode === true) {
      this.alertify.warning('Edit option disabled for old annual requirements');
      return false;
    }
    this.updateProd = p;
    this.annualRequirementsForm.setValue({
      prodName: p.prodName,
      prodType: p.prodType,
      hsCode: p.hsCode,
      packSize: p.packSize,
      // manufacturer: p.manufacturer,
      // countryOfOrigin: p.countryOfOrigin,
      tentativeUnits: p.tentativeUnits || undefined || null,
      // unitPrice: p.unitPrice,
      // totalPrice: p.totalPrice,
      // totalPriceInBdt: p.totalPriceInBdt,
      // currency: p.currency,
      // exchangeRate: p.exchangeRate,
      totalAmount: p.totalAmount || undefined || null
    });
    this.openRequireModal('update');
    this.editMode = true;
    this.addMode = false;
  }
  confirm(): void {
    this.modalRef.hide();
    if (this.userRole == "SA") {
      this.updateAnnualRequirement();
    }
    else {
      if (this.annualReqNo) {
        this.updateAnnualRequirement()
      }
      else {
        this.saveAnnualRequirement();
      }
    }
  }
  decline(): void {
    this.modalRef.hide();
  }
  confirmAnnualReqSubmission() {

    if (this.annualRequirements.length < 1) {
      this.loading = false;
      this.alertify.warning('No Product to save');
      return;
    }
    if (!this.annualReqNo) {
      this.saveUpdateMsg = 'সেভ';
    } else {
      this.saveUpdateMsg = 'আপডেট';
    }
    this.openConfirmModal(this.confirmModal);
  }
  saveAnnualRequirement() {
    this.loading = true;
    if (!this.checkImporterId) {
      this.checkImporterId = this.loginService.getEmpOrImpName();;
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    const currentDate = mm + '-' + dd + '-' + yyyy;
    const annReqMst: IAnnualRequirementMst = {
      id: 0,
      annualReqNo: null,
      importerId: this.checkImporterId,
      submissionDate: new Date(),
      confirmation: false
    };
    const importer: IImporterForAnnReqDto = {
      importerId: this.checkImporterId
    };
    let res: any;
    let exist: any;
    this.annualRequirementService.IsAnnualRequirementAlreadySubmittedThisYear(importer).subscribe(response => {
      res = response;

      if (!res) {
        this.annualRequirementService.IsAnnualRequirementExist(importer).subscribe(response => {
          exist = response;
          if (!exist) {
            this.annualRequirementService.saveAnnualRequirementMst(annReqMst).subscribe(
              resp => {
                const annualReqMst = resp as IAnnualRequirementMst;
                let annReqDtls: IAnnualRequirementDtl[] = [];
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < this.annualRequirements.length; i++) {
                  const obj: IAnnualRequirementDtl = {
                    id: 0,
                    annReqMstId: annualReqMst.id,
                    prodName: this.annualRequirements[i].prodName,
                    prodType: this.annualRequirements[i].prodType,
                    hsCode: this.annualRequirements[i].hsCode,
                    // manufacturer: this.annualRequirements[i].manufacturer,
                    //  countryOfOrigin: this.annualRequirements[i].countryOfOrigin,
                    packSize: this.annualRequirements[i].packSize,
                    tentativeUnits: this.annualRequirements[i].tentativeUnits,
                    // unitPrice: this.annualRequirements[i].unitPrice,
                    // totalPrice: this.annualRequirements[i].totalPrice,
                    // totalPriceInBdt: this.annualRequirements[i].totalPriceInBdt,
                    // currency: this.annualRequirements[i].currency,
                    // exchangeRate: this.annualRequirements[i].exchangeRate,
                    totalAmount: this.annualRequirements[i].totalAmount
                  };
                  annReqDtls.push(obj);
                }
                this.annualRequirementService
                  .saveAnnualRequirementDtl(annReqDtls)
                  .subscribe(
                    respon => {
                      const annualReqDtl = respon as IAnnualRequirementDtl[];
                      this.loading = false;
                      this.alertify.success('Annual Requirement Save successful');
                      this.annualRequirements = [];
                      annReqDtls = [];
                      this.submitButtonDisable = false;
                    },
                    err => {
                      this.alertify.error('Annual Requirement Save Failed');
                      console.log(err);
                    }
                  );
              },
              error => {
                this.alertify.error('Annual Requirement Save Failed');
                console.log(error);
              });
          }
          else {
            this.loading = false;
            this.submitButtonDisable = true;
            this.alertify.warning('Annual Requirement already created for current year');
            this.resetPage();
          }
        },
        error => {
          this.alertify.error('Exist Annual Requirement load Failed');
          console.log(error);
        });

      } else {
        this.loading = false;
        this.submitButtonDisable = true;
        this.alertify.warning('Annual Requirement already submitted for current year');
      }
    }, error => {
      console.log(error);
    });
  }
  updateAnnualRequirement() {
    this.loading = true;
    if (!this.checkImporterId) {
      this.checkImporterId = this.loginService.getEmpOrImpName();;
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    const currentDate = mm + '-' + dd + '-' + yyyy;
    const annReqMst: IAnnualRequirementMst = {
      id: this.mstNo,
      annualReqNo: this.annualReqNo,
      importerId: this.checkImporterId,
      submissionDate: new Date(),
      confirmation: false
    };
    const importer: IImporterForAnnReqDto = {
      importerId: this.checkImporterId
    };
    this.annualRequirementService.updateAnnualRequirementMst(annReqMst).subscribe(
      resp => {
        const annualReqMst = resp as IAnnualRequirementMst;
        let annReqDtls: IAnnualRequirementDtl[] = [];
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.annualRequirements.length; i++) {
          const obj: IAnnualRequirementDtl = {
            id: this.annualRequirements[i].id,
            annReqMstId: annualReqMst.id,
            prodName: this.annualRequirements[i].prodName,
            prodType: this.annualRequirements[i].prodType,
            hsCode: this.annualRequirements[i].hsCode,
            //manufacturer: this.annualRequirements[i].manufacturer,
            // countryOfOrigin: this.annualRequirements[i].countryOfOrigin,
            packSize: this.annualRequirements[i].packSize,
            tentativeUnits: this.annualRequirements[i].tentativeUnits,
            // unitPrice: this.annualRequirements[i].unitPrice,
            // totalPrice: this.annualRequirements[i].totalPrice,
            // totalPriceInBdt: this.annualRequirements[i].totalPriceInBdt,
            // currency: this.annualRequirements[i].currency,
            // exchangeRate: this.annualRequirements[i].exchangeRate,
            totalAmount: this.annualRequirements[i].totalAmount
          };
          annReqDtls.push(obj);
        }
        this.annualRequirementService
          .saveAnnualRequirementDtl(annReqDtls)
          .subscribe(
            respon => {
              const annualReqDtl = respon as IAnnualRequirementDtl[];
              this.loading = false;
              this.alertify.success('Annual Requirement Update successful');
              this.annualRequirements = [];
              annReqDtls = [];
              this.submitButtonDisable = false;
            },
            err => {
              this.alertify.error('Annual Requirement Update Failed');
              console.log(err);
            }
          );
      },
    );

  }
  //annual Req save submit work-Ashiq-18-11-2020
  confirmAnnualRequirementSubmission() {
    this.openAnnualRequirementSubmissionConfirmModal(this.annualReqSubmissionConfirmModal);
  }
  openAnnualRequirementSubmissionConfirmModal(template: TemplateRef<any>) {
    this.annualReqSubmissionConfirmRef = this.modalService.show(template, {
      keyboard: false,
      class: 'modal-md',
      ignoreBackdropClick: true
    });
  }
  confirmSubmit() {
    this.annualReqSubmissionConfirmRef.hide();
    this.submitAnnualRequirement();
  }
  declineSubmit() {
    this.annualReqSubmissionConfirmRef.hide();
  }
  submitAnnualRequirement() {
    if (!this.checkImporterId) {
      this.checkImporterId = this.loginService.getEmpOrImpName();
    }
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    const currentDate = mm + '-' + dd + '-' + yyyy;
    const annReqMst: IAnnualRequirementMst = {
      id: this.mstNo,
      importerId: this.checkImporterId,
      annualReqNo: this.annualReqNo,
      submissionDate: new Date(),
      confirmation: true
    };
    this.annualRequirementService.submitAnnualRequirement(annReqMst).subscribe(
      resp => {
        const annualReqMst = resp as IAnnualRequirementMst;
        this.resetPage();
        this.alertify.success('Annual Requirement submitted successfully');
      }, err => {
        this.alertify.error('Annual Requirement submission failed');
      });
  }
  //
  searchAnnualRequirements() {
    this.loading = true;
    const imp = this.loginService.getEmpOrImpName();
    const importer: IImporterForAnnReqDto = {
      importerId: imp
    };

    this.annualRequirementService.searchAnnualRequirements(importer).subscribe(resp => {
      this.annReqs = resp as IAllAnnualRequirements[];
      this.openModal(this.annualReqsModal);
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alertify.warning('No data found');
      console.log(err);
    });
  }
  show(): void {
    this.active = true;
    this.paginator.rows = 5;
    this.annualReqsModalNew.show();
  }
  close(): void {
    this.active = false;
    this.annualReqsModalNew.hide();
    //this.annualReqsModal.emit(null);
  }
  getAllAnnualRequirements() {
    //this.show();
    this.getAllAnnualRequirements2();
    //this.openModal(this.annualReqsModal);
    // this.loading = true;
    // this.annualRequirementService.getAllAnnualRequirements().subscribe(resp => {
    //   this.annReqs = resp as IAllAnnualRequirements[];
    //   this.openModal(this.annualReqsModal);
    //   this.loading = false;
    // }, err => {
    //   this.loading = false;
    //   this.alertify.warning('No data found');
    //   console.log(err);
    // });
  }

  selectAnnualReq(a: IAllAnnualRequirements) {
    // console.log(a);
    const mstNew: IAnnualReqByMstAndImpDto = {
      mstId: a.id,
      // importerId: impId,
      importerId: a.importerId,
      annualReqNo: a.annualReqNo
    };
    this.annualRequirementService.getImporterInfoByAnnualReq(mstNew).subscribe(resp => {
      this.importerInfo = resp as IGetImporterForViewDto;
      this.orgName=this.importerInfo.orgName;
    });
    const sDate = new Date(a.submissionDate);
    let formattedSubmissionDate: any;
    if (a.submissionDate === undefined || a.submissionDate === null) {
      formattedSubmissionDate = a.submissionDate;
    } else {
      formattedSubmissionDate = sDate.getDate() + '/' + (sDate.getMonth() + 1) + '/' + sDate.getFullYear();
    }
    if (a.confirmation === false) {
      this.isSubmitted = false;
      this.updateBtnDisable = false;
      this.submitButtonDisable = false;
      this.annReqUpdateMode = false;
    } else if (a.confirmation === true) {
      this.isSubmitted = true;
      this.submitButtonDisable = true;
      this.updateBtnDisable = true;
      this.annReqUpdateMode = true;
    }
    this.saveButtonTitle = 'Update';
    this.annualRequirementMstForm.get('annualReqNo').setValue(a.annualReqNo);
    this.annualReqNo = a.annualReqNo;
    this.mstNo = a.id;
    this.submissionDateReport = formattedSubmissionDate;
    this.annualRequirementMstForm.get('submissionDate').setValue(formattedSubmissionDate);
    //paramMstForm.get('annualReqNo').setValue(a.annualReqNo);
    //paramMstForm.get('submissionDate').setValue(formattedSubmissionDate);

    this.checkImporterId = a.importerId;
    if (!this.checkImporterId) {
      this.checkImporterId = this.loginService.getEmpOrImpName();
    }
    this.mstNo = a.id;
    this.annualReqNo = a.annualReqNo;
    const mst: IAnnualReqByMstAndImpDto = {
      mstId: a.id,
      // importerId: impId,
      importerId: a.importerId,
      annualReqNo: a.annualReqNo
    };
    this.getAnnualReqDtlByMstAndImporterId(mst);
    if (this.userRole == "SA" && a.confirmation === true) {
      this.annReqUpdateMode = false;
      this.active = false;
      this.annualReqsModalNew.hide();
      this.isSubmitted = false;
      this.updateBtnDisable = false;
      this.submitButtonDisable = false;
    }
    else {
      // this.annReqUpdateMode = true;
      // //
      // this.updateBtnDisable = false;
      // this.submitButtonDisable = false;
      //
      this.modalRef.hide();
    }

  }


  getAnnualReqDtlByMstAndImporterId(mst: IAnnualReqByMstAndImpDto) {
    this.annualRequirementService.getAnnualReqDtlByMstAndImporterId(mst).subscribe(resp => {
      this.annualRequirements = resp as IAnnualRequirementDtl[];
    }, err => {
      console.log(err);
    });
  }
  IsAnnualRequirementAlreadySubmittedThisYear(): boolean {
    if (!this.checkImporterId) {
      this.checkImporterId = this.loginService.getEmpOrImpName();
    }
    const importer: IImporterForAnnReqDto = {
      importerId: this.checkImporterId
    };
    let res: any;
    this.annualRequirementService.IsAnnualRequirementAlreadySubmittedThisYear(importer).subscribe(resp => {
      res = resp;
    }, error => {
      console.log(error);
    }, () => {
      if (res) {
        return true;
      }
      return false;
    });
    return false;
  }
  viewAnnualReqReport(): void {
    this.loading = true;

    const mst: IAnnualReqByMstAndImpDto = {
      mstId: this.mstNo,
      annualReqNo: this.annualReqNo,
      importerId: this.checkImporterId,
    };
   
    let row: any[] = [];
    const rowD: any[] = [];
    const col = ['SL \nNO.', 'Product Name', 'Product Type', 'H.S. Code', 'Pack Size',
      'Total \nAmount(Tons)', 'Total\nUnits\n(Kg/Ltr/Unit)'];
    const title = 'Annual Requirement Summary Report';
    let slNO = 0;
    this.annualRequirementService.getAnnualReqDtlByMstAndImporterId(mst).subscribe(resp => {
      this.annualRequirements = resp as IAnnualRequirementDtl[];

      // row.push(this.annualReqNo);
      // if(this.submissionDateReport ==null || undefined || ''){
      //   this.submissionDateReport='Not Submitted';
      // }

      // row.push(this.submissionDateReport);
      for (const a of this.annualRequirements) {
        row.push(++slNO);
        row.push(a.prodName);
        row.push(a.prodType);
        row.push(a.hsCode);
        row.push(a.packSize);
        if (a.totalAmount === null || undefined || '' || 0) {
          row.push(0 + " MT");
        }
        else {
          row.push(a.totalAmount + " MT");
        }
        if (a.tentativeUnits === null || undefined || '' || 0) {
          row.push(0 + " Unit");
        }
        else {
          row.push(a.tentativeUnits + " Unit");
        }
        rowD.push(row);
        row = [];
      }
      this.submissionDateReport = this.formatReportDate(this.submissionDateReport);
     
      this.getReport(col, rowD, title, this.annualReqNo,this.orgName, this.submissionDateReport);
    }, err => {
      console.log(err);
    });
  }
  formatReportDate(d: any) {
    if ((d === undefined) || (d === null) || (d === "Not Submitted")) {
      return 'Not Submitted';
    }
    else {
      return d;
     // const convertedDate = new Date(d);
     // return convertedDate.getDate() + '/' + (convertedDate.getMonth() + 1) + '/' + convertedDate.getFullYear();
    }
  }
  getReport(col: any[], rowD: any[], title: any, annualReqNo: any,orgName:any, submissionDateReport: any) {
    const totalPagesExp = "{total_pages_count_string}";
    const pdf = new jsPDF('l', 'pt', 'a4');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);

    pdf.setFontType('bold');
    pdf.text('Report Name:', 40, 60);
    pdf.setFontType('normal');
    pdf.text(title, 120, 60);

    pdf.setFontType('bold');
    pdf.text('Importer Name: ', 40, 80);
    pdf.setFontType('normal');
    pdf.text(orgName, 130, 80);

    pdf.setFontType('bold');
    pdf.text('Annual Requirement No. :', 40, 100);
    pdf.setFontType('normal');
    pdf.text(annualReqNo, 180, 100);

    pdf.setFontType('bold');
    pdf.text('Submission Date:', 240, 100);
    pdf.setFontType('normal');
    pdf.text(submissionDateReport === undefined || null ?
      'Not Submitted' : submissionDateReport, 340, 100);
    //pdf.text(submissionDateReport, 340, 80);

    const pDate = this.datePipe.transform(new Date, "dd/MM/yyyy");
    pdf.text('Printing Date: ' + pDate, 680, 100);
    var pageContent = function (data) {
      // HEADER

      // FOOTER
      var str = "Page " + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = str + " of " + totalPagesExp;
      }
      pdf.setFontSize(9);
      var pageHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10); // showing current page number
    };
    pdf.autoTable(col, rowD,
      {
        theme: "grid",
        // table: { fillColor: 255, textColor: 0, fontStyle: 'normal', lineWidth: 0.1 },
        //head: { textColor: 0, fillColor: [211,211,211], fontStyle: 'bold', lineWidth: 0 },
        // body: {},
        // foot: { textColor: 255, fillColor: [26, 188, 156], fontStyle: 'bold', lineWidth: 0 },
        // alternateRow: {},
        headStyles: { fillColor: [192, 192, 192] },


        didDrawPage: pageContent,
        margin: { top: 120 },
        bodyStyles: { valign: 'middle', lineColor: [153, 153, 153] },

        styles: { overflow: 'linebreak', cellWidth: 'wrap', fontSize: 9, textColor: 0 },

      });

    //for adding total number of pages // i.e 10 etc
    if (typeof pdf.putTotalPages === 'function') {
      pdf.putTotalPages(totalPagesExp);
    }

    // pdf.save(title + '.pdf');
    pdf.setProperties({
      title: title + ".pdf"
    });

    var blob = pdf.output("blob");
    window.open(URL.createObjectURL(blob));
    this.loading = false;
  }


  resetPage() {
    this.createAnnualRequirementMstForm();
    this.createAnnualRequirementForm();
    this.annualRequirements = [];
    this.modalTitle = '';
    this.addMode = false;
    this.editMode = false;
    this.updateProdType = '';
    this.loading = false;
    this.annReqUpdateMode = false;
    this.searchText = '';
    this.p = 1;
    this.mstNo = null;
    this.annualReqNo = '';
    this.submitButtonDisable = true;
    this.saveUpdateMsg = '';
    this.saveButtonTitle = 'Save';
    this.updateBtnDisable = false;
  }
}

interface ICurrency {
  id: number;
  currency: string;
  exchangeRate: number;
  currencyDate: Date;
}
interface IAnnualRequirementDtl {
  id: number;
  annReqMstId: number;
  prodName: string;
  prodType: string;
  hsCode: string;
  //manufacturer: string;
  //countryOfOrigin: string;
  packSize: string;
  tentativeUnits: number;
  // unitPrice: number;
  // totalPrice: number;
  // totalPriceInBdt: number;
  // currency: string;
  // exchangeRate: number;
  totalAmount: number;
}
interface IAnnualRequirementMst {
  id: number;
  annualReqNo: string;
  importerId: number;
  submissionDate: Date;
  confirmation: boolean;
}
interface IAllAnnualRequirements {
  id: number;
  annualReqNo: string;
  importerId: number;
  submissionDate: Date;
  confirmation: boolean;
  annualRequirementDtls: IAnnualRequirementDtl[];
}
interface IImporterForAnnReqDto {
  importerId: number;
}
interface IAnnualReqByMstAndImpDto {
  mstId: number;
  importerId: number;
  annualReqNo: string;
}



