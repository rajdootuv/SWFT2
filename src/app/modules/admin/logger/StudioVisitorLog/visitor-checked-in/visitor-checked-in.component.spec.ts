import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorCheckedInComponent } from './visitor-checked-in.component';

describe('VisitorCheckedInComponent', () => {
  let component: VisitorCheckedInComponent;
  let fixture: ComponentFixture<VisitorCheckedInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorCheckedInComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorCheckedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
