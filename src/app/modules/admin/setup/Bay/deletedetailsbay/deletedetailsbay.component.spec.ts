import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedetailsbayComponent } from './deletedetailsbay.component';

describe('DeletedetailsbayComponent', () => {
  let component: DeletedetailsbayComponent;
  let fixture: ComponentFixture<DeletedetailsbayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedetailsbayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedetailsbayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
