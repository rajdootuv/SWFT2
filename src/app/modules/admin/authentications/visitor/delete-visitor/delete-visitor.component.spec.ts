import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVisitorComponent } from './delete-visitor.component';

describe('DeleteVisitorComponent', () => {
  let component: DeleteVisitorComponent;
  let fixture: ComponentFixture<DeleteVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteVisitorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
