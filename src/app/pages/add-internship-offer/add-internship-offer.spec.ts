import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternshipOffer } from './add-internship-offer';

describe('AddInternshipOffer', () => {
  let component: AddInternshipOffer;
  let fixture: ComponentFixture<AddInternshipOffer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInternshipOffer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInternshipOffer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
