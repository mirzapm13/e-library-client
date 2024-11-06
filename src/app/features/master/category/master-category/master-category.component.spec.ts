import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCategoryComponent } from './master-category.component';

describe('MasterCategoryComponent', () => {
  let component: MasterCategoryComponent;
  let fixture: ComponentFixture<MasterCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
