import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterApprovalComponent } from './master-approval.component';

describe('MasterApprovalComponent', () => {
  let component: MasterApprovalComponent;
  let fixture: ComponentFixture<MasterApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
