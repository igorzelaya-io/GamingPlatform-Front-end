import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldformCountryComponent } from './fieldform-country.component';

describe('FieldformCountryComponent', () => {
  let component: FieldformCountryComponent;
  let fixture: ComponentFixture<FieldformCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldformCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldformCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
