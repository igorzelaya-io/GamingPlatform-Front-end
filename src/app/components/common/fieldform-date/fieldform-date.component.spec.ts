import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldformDateComponent } from './fieldform-date.component';

describe('FieldformDateComponent', () => {
  let component: FieldformDateComponent;
  let fixture: ComponentFixture<FieldformDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldformDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldformDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
