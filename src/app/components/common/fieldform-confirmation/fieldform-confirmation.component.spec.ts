import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldformConfirmationComponent } from './fieldform-confirmation.component';

describe('FieldformConfirmationComponent', () => {
  let component: FieldformConfirmationComponent;
  let fixture: ComponentFixture<FieldformConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldformConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldformConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
