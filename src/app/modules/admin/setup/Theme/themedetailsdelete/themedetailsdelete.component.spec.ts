import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemedetailsdeleteComponent } from './themedetailsdelete.component';

describe('ThemedetailsdeleteComponent', () => {
  let component: ThemedetailsdeleteComponent;
  let fixture: ComponentFixture<ThemedetailsdeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemedetailsdeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemedetailsdeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
