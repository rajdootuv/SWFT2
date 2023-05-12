import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserattendancelogComponent } from './userattendancelog.component';

describe('UserattendancelogComponent', () => {
  let component: UserattendancelogComponent;
  let fixture: ComponentFixture<UserattendancelogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserattendancelogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserattendancelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
