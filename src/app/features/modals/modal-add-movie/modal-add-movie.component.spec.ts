import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddMovieComponent } from './modal-add-movie.component';

describe('ModalAddMovieComponent', () => {
  let component: ModalAddMovieComponent;
  let fixture: ComponentFixture<ModalAddMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddMovieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAddMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
