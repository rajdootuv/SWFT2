import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsettinglistComponent } from './emailsettinglist.component';

describe('EmailsettinglistComponent', () => {
  let component: EmailsettinglistComponent;
  let fixture: ComponentFixture<EmailsettinglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailsettinglistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailsettinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
