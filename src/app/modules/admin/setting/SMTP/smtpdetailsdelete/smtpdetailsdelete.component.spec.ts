import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtpdetailsdeleteComponent } from './smtpdetailsdelete.component';

describe('SmtpdetailsdeleteComponent', () => {
  let component: SmtpdetailsdeleteComponent;
  let fixture: ComponentFixture<SmtpdetailsdeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtpdetailsdeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmtpdetailsdeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
