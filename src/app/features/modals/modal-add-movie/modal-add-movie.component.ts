import { Component } from '@angular/core';
import { Movie } from '../../../core/services/movie/movie.interface';
import { MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-add-movie',
  standalone: true,
  imports: [
    MatDialogTitle
  ],
  templateUrl: './modal-add-movie.component.html',
  styleUrl: './modal-add-movie.component.scss'
})
export class ModalAddMovieComponent {
  private newMovie: Partial<Movie> = {};
  private genreInput: string = '';
  private actorsInput: string = '';
  private imageFile: string = '';
  
  
}
