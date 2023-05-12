import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddetailsComponent } from './adddetails.component';

describe('AdddetailsComponent', () => {
  let component: AdddetailsComponent;
  let fixture: ComponentFixture<AdddetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdddetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
