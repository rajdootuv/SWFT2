import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSMSSettingComponent } from './list-smssetting.component';

describe('ListSMSSettingComponent', () => {
  let component: ListSMSSettingComponent;
  let fixture: ComponentFixture<ListSMSSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSMSSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSMSSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
