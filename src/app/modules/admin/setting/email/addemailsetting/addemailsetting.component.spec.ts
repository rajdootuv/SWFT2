import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddemailsettingComponent } from './addemailsetting.component';

describe('AddemailsettingComponent', () => {
  let component: AddemailsettingComponent;
  let fixture: ComponentFixture<AddemailsettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddemailsettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddemailsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
