import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldformPasswordComponent } from './fieldform-password.component';

describe('FieldformPasswordComponent', () => {
  let component: FieldformPasswordComponent;
  let fixture: ComponentFixture<FieldformPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldformPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldformPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
