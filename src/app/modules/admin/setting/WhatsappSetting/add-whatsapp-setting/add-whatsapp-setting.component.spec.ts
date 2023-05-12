import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWhatsappSettingComponent } from './add-whatsapp-setting.component';

describe('AddWhatsappSettingComponent', () => {
  let component: AddWhatsappSettingComponent;
  let fixture: ComponentFixture<AddWhatsappSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWhatsappSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWhatsappSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
