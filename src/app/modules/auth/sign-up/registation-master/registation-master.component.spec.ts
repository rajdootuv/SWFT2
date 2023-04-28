import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistationMasterComponent } from './registation-master.component';

describe('RegistationMasterComponent', () => {
  let component: RegistationMasterComponent;
  let fixture: ComponentFixture<RegistationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistationMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
