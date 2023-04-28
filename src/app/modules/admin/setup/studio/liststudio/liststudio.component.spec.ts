import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListstudioComponent } from './liststudio.component';

describe('ListstudioComponent', () => {
  let component: ListstudioComponent;
  let fixture: ComponentFixture<ListstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListstudioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
