import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualRequirementLookupTableModalComponent } from './annual-requirement-lookup-table-modal.component';

describe('AnnualRequirementLookupTableModalComponent', () => {
  let component: AnnualRequirementLookupTableModalComponent;
  let fixture: ComponentFixture<AnnualRequirementLookupTableModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualRequirementLookupTableModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualRequirementLookupTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
