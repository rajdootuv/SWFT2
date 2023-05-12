import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEventVisitorComponent } from './list-event-visitor.component';

describe('ListEventVisitorComponent', () => {
  let component: ListEventVisitorComponent;
  let fixture: ComponentFixture<ListEventVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEventVisitorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEventVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
