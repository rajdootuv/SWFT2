import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpdetailsdeleteComponent } from './wpdetailsdelete.component';

describe('WpdetailsdeleteComponent', () => {
  let component: WpdetailsdeleteComponent;
  let fixture: ComponentFixture<WpdetailsdeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpdetailsdeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpdetailsdeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
