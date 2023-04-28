import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTabsComponent } from './register-tabs.component';

describe('RegisterTabsComponent', () => {
  let component: RegisterTabsComponent;
  let fixture: ComponentFixture<RegisterTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
