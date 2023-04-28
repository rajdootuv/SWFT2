import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddorganizationComponent } from './addorganization.component';

describe('AddorganizationComponent', () => {
  let component: AddorganizationComponent;
  let fixture: ComponentFixture<AddorganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddorganizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddorganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
