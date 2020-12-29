import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRegistrationPageComponent } from './profile-registration-page.component';

describe('ProfileRegistrationPageComponent', () => {
  let component: ProfileRegistrationPageComponent;
  let fixture: ComponentFixture<ProfileRegistrationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileRegistrationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
