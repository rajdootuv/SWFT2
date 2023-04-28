import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfloorComponent } from './addfloor.component';

describe('AddfloorComponent', () => {
  let component: AddfloorComponent;
  let fixture: ComponentFixture<AddfloorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddfloorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddfloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
