import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserClaims } from './user-claims';

describe('UserClaims', () => {
  let component: UserClaims;
  let fixture: ComponentFixture<UserClaims>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserClaims],
    }).compileComponents();

    fixture = TestBed.createComponent(UserClaims);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
