import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSMTPComponent } from './list-smtp.component';

describe('ListSMTPComponent', () => {
  let component: ListSMTPComponent;
  let fixture: ComponentFixture<ListSMTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSMTPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSMTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
