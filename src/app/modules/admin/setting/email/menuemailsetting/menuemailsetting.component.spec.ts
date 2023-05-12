import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuemailsettingComponent } from './menuemailsetting.component';

describe('MenuemailsettingComponent', () => {
  let component: MenuemailsettingComponent;
  let fixture: ComponentFixture<MenuemailsettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuemailsettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuemailsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
