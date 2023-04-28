import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDeleteStudioComponent } from './detail-delete-studio.component';

describe('DetailDeleteStudioComponent', () => {
  let component: DetailDeleteStudioComponent;
  let fixture: ComponentFixture<DetailDeleteStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDeleteStudioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDeleteStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
