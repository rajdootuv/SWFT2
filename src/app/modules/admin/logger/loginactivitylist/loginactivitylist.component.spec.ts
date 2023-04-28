import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginactivitylistComponent } from './loginactivitylist.component';

describe('LoginactivitylistComponent', () => {
  let component: LoginactivitylistComponent;
  let fixture: ComponentFixture<LoginactivitylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginactivitylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginactivitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
