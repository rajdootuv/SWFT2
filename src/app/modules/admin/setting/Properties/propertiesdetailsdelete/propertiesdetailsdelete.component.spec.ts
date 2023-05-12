import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesdetailsdeleteComponent } from './propertiesdetailsdelete.component';

describe('PropertiesdetailsdeleteComponent', () => {
  let component: PropertiesdetailsdeleteComponent;
  let fixture: ComponentFixture<PropertiesdetailsdeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesdetailsdeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesdetailsdeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
