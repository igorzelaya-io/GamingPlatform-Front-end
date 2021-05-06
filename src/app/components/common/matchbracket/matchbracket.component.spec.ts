import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchbracketComponent } from './matchbracket.component';

describe('MatchbracketComponent', () => {
  let component: MatchbracketComponent;
  let fixture: ComponentFixture<MatchbracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchbracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchbracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
