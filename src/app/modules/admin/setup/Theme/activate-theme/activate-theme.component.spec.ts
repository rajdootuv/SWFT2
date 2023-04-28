import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateThemeComponent } from './activate-theme.component';

describe('ActivateThemeComponent', () => {
  let component: ActivateThemeComponent;
  let fixture: ComponentFixture<ActivateThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateThemeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
