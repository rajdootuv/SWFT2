import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorFilterComponent } from './visitor-filter.component';

describe('VisitorFilterComponent', () => {
  let component: VisitorFilterComponent;
  let fixture: ComponentFixture<VisitorFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
