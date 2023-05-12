import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSMSSettingComponent } from './add-smssetting.component';

describe('AddSMSSettingComponent', () => {
  let component: AddSMSSettingComponent;
  let fixture: ComponentFixture<AddSMSSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSMSSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSMSSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
