import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAccessComponent } from './category-access.component';

describe('CategoryAccessComponent', () => {
  let component: CategoryAccessComponent;
  let fixture: ComponentFixture<CategoryAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
