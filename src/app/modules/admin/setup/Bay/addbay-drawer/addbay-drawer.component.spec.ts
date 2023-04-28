import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbayDrawerComponent } from './addbay-drawer.component';

describe('AddbayDrawerComponent', () => {
  let component: AddbayDrawerComponent;
  let fixture: ComponentFixture<AddbayDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddbayDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddbayDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
