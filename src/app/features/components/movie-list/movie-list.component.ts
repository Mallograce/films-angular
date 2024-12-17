import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../../core/services/movie/movie.service';
import { Movie } from '../../../core/services/movie/movie.interface';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddMovieComponent } from '../../modals/modal-add-movie/modal-add-movie.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit {
  
  constructor(
    private movieS: MovieService,
    private dialog: MatDialog,
  ) { }
  
  private movies: Movie[] = [];
  private searchTerm: string = '';
  
  ngOnInit() {
  
  }
  
  openAddMovie() {
    const dialogRef = this.dialog.open(ModalAddMovieComponent);
    dialogRef.afterClosed().subscribe((newMovie: Movie) => {
      if (newMovie) {
        this.movieS.addMovie(newMovie);
      }
    })
  }
  
  protected readonly addEventListener = addEventListener;
}
