import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagemasterComponent } from './languagemaster.component';

describe('LanguagemasterComponent', () => {
  let component: LanguagemasterComponent;
  let fixture: ComponentFixture<LanguagemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguagemasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguagemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
