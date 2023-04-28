import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaymasterComponent } from './baymaster.component';

describe('BaymasterComponent', () => {
  let component: BaymasterComponent;
  let fixture: ComponentFixture<BaymasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaymasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
