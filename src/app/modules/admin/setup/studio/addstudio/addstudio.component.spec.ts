import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddstudioComponent } from './addstudio.component';

describe('AddstudioComponent', () => {
  let component: AddstudioComponent;
  let fixture: ComponentFixture<AddstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddstudioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
