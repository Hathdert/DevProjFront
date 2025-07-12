import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateCompanyProfileComponent } from './private-company-profile';

describe('CompanyProfile', () => {
  let component: PrivateCompanyProfileComponent;
  let fixture: ComponentFixture<PrivateCompanyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateCompanyProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateCompanyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
