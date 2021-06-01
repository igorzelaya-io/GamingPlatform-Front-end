import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldformComponent } from './fieldform.component';

describe('FieldformComponent', () => {
  let component: FieldformComponent;
  let fixture: ComponentFixture<FieldformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
