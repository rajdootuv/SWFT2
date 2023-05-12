import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSMTPComponent } from './add-smtp.component';

describe('AddSMTPComponent', () => {
  let component: AddSMTPComponent;
  let fixture: ComponentFixture<AddSMTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSMTPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSMTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
