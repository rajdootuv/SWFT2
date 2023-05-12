import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWhatsappSettingComponent } from './list-whatsapp-setting.component';

describe('ListWhatsappSettingComponent', () => {
  let component: ListWhatsappSettingComponent;
  let fixture: ComponentFixture<ListWhatsappSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWhatsappSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListWhatsappSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
