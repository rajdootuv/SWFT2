import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageTranslationListComponent } from './language-translation-list.component';

describe('LanguageTranslationListComponent', () => {
  let component: LanguageTranslationListComponent;
  let fixture: ComponentFixture<LanguageTranslationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageTranslationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageTranslationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
