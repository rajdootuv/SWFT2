import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioLogComponent } from './studio-log.component';

describe('StudioLogComponent', () => {
  let component: StudioLogComponent;
  let fixture: ComponentFixture<StudioLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudioLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudioLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
