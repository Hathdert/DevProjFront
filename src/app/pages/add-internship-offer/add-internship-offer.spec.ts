import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddInternshipOfferComponent } from './add-internship-offer';

describe('AddInternshipOfferComponent', () => {
  let component: AddInternshipOfferComponent;
  let fixture: ComponentFixture<AddInternshipOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInternshipOfferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddInternshipOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
