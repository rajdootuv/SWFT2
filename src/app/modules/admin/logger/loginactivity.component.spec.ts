import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginactivityComponent } from './loginactivity.component';

describe('LoginactivityComponent', () => {
  let component: LoginactivityComponent;
  let fixture: ComponentFixture<LoginactivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginactivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
