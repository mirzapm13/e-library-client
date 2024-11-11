import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentApprovalDetailsComponent } from './document-approval-details.component';

describe('DocumentApprovalDetailsComponent', () => {
  let component: DocumentApprovalDetailsComponent;
  let fixture: ComponentFixture<DocumentApprovalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentApprovalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
