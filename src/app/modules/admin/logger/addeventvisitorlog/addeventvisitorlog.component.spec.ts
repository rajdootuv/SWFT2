import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeventvisitorlogComponent } from './addeventvisitorlog.component';

describe('AddeventvisitorlogComponent', () => {
  let component: AddeventvisitorlogComponent;
  let fixture: ComponentFixture<AddeventvisitorlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddeventvisitorlogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeventvisitorlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
