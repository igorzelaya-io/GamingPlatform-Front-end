import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldformNumericComponent } from './fieldform-numeric.component';

describe('FieldformNumericComponent', () => {
  let component: FieldformNumericComponent;
  let fixture: ComponentFixture<FieldformNumericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldformNumericComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldformNumericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
