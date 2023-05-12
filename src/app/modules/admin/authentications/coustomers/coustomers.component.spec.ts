import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoustomersComponent } from './coustomers.component';

describe('CoustomersComponent', () => {
  let component: CoustomersComponent;
  let fixture: ComponentFixture<CoustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoustomersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
