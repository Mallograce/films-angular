import { Component } from '@angular/core';
import { Movie } from '../../../core/services/movie/movie.interface';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-add-movie',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatLabel,
    TranslatePipe
  ],
  templateUrl: './modal-add-movie.component.html',
  styleUrl: './modal-add-movie.component.scss'
})
export class ModalAddMovieComponent {
  
  constructor(
    private dialogRef: MatDialogRef<ModalAddMovieComponent>,
  ) { }
  
  newMovie: Partial<Movie> = {};
  genreInput: string = '';
  actorsInput: string = '';
  imageFile: string = '';
  
  onImageUpload(event: Event) {
  
  }
  onAddMovie() {
    this.newMovie.genre = this.genreInput.split(',').map(word => word.trim());
    this.newMovie.actors = this.actorsInput.split(',').map(word => word.trim());
    this.newMovie.image = this.imageFile;
    this.newMovie.createdYear = new Date();
    this.newMovie.updatedYear = new Date();
    this.dialogRef.close(this.newMovie);
  }
}
