import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloordetailsComponent } from './floordetails.component';

describe('FloordetailsComponent', () => {
  let component: FloordetailsComponent;
  let fixture: ComponentFixture<FloordetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloordetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloordetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
