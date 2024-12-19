import { Component, OnDestroy, OnInit } from '@angular/core';
import { MovieService } from '../../../core/services/movie/movie.service';
import { Movie } from '../../../core/services/movie/movie.interface';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddMovieComponent } from '../../modals/modal-add-movie/modal-add-movie.component';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { NgForOf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChip, MatChipListbox } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    MovieItemComponent,
    NgForOf,
    MatFormField,
    FormsModule,
    MatInput,
    MatLabel,
    MatIcon,
    TranslatePipe,
    MatSidenavContent,
    MatSidenav,
    MatSidenavContainer,
    MatButton,
    MatIconButton,
    MatChipListbox,
    MatChip,
    MatDivider
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit, OnDestroy {
  
  constructor(
    private movieS: MovieService,
    private dialog: MatDialog,
    private translateS: TranslateService
  ) { }
  
  movies: Movie[] = []; // Фильмы
  filteredMovies: Movie[] = []; // Отфильтрованные фильмы
  searchTerm: string = '';
  genres: { id: number; name: string }[] = []; // Жанры
  selectedGenres: Set<number> = new Set<number>(); // Выбранные жанры
  
  /**
   * Загружаем список фильмов и жанров при открытии страницы
   */
  ngOnInit() {
    this.movieS.getMovies().subscribe(movies => {
      this.movies = movies;
      this.filteredMovies = movies;
    });
    this.genres = this.movieS.getGenresArray();
  }
  
  ngOnDestroy() {
  
  }
  
  /**
   * Изменение языка (перевод)
   * @param language - поступающий язык (ru, en)
   */
  protected switchLanguage(language: string) {
    this.translateS.use(language);
  }
  
  /**
   * Открываем модальное окно для добавления нового фильма
   * После закрытия модального окна добавляется новый фильм
   */
  openAddMovie() {
    const dialogRef = this.dialog.open(ModalAddMovieComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe((newMovie: Movie) => {
      if (newMovie) {
        this.movieS.addMovie(newMovie);
      }
    })
  }
  
  /**
   * Вызываем метод удаления фильма из сервиса
   */
  deleteMovie(id: number) {
    this.movieS.deleteMovie(id);
  }
  
  /**
   * Вызываем метод редактирования фильма из сервиса
   */
  editMovie(updatedMovie: Movie) {
    this.movieS.editMovie(updatedMovie);
  }
  
  /**
   * Фильтруем список фильмов на основе поиска
   */
  onSearch() {
    this.applyFilters();
  }
  
  /**
   * Добавляем или удаляем жанр
   */
  toggleGenre(genreId: number) {
    if (this.selectedGenres.has(genreId)) {
      this.selectedGenres.delete(genreId);
    } else {
      this.selectedGenres.add(genreId);
    }
    this.applyFilters(); // Вызываем фильтрацию из инпута
  }
  
  /**
   * Метод фильтрации поиска
   * Фильтруем фильмы по наименованию, режиссеру, актерам, аннотации
   */
  applyFilters() {
    const searchFilter = this.searchTerm.toLowerCase().trim(); // Поле поиска в нижнем регистре
    
    this.filteredMovies = this.movies.filter(movie => {
      const matchesSearch =
        searchFilter.length < 3 || // Начинаем фильтрацию от 3 букв
        movie.title.toLowerCase().includes(searchFilter) ||
        movie.director.toLowerCase().includes(searchFilter) ||
        movie.actors.some((actor) => actor.toLowerCase().includes(searchFilter)) ||
        (movie.annotation && movie.annotation.toLowerCase().includes(searchFilter));
      
      const matchesGenres =
        this.selectedGenres.size === 0 ||
        movie.genre.some(genre => { // Есть ли хотя бы один жанр фильма, который соответствует выбранным жанрам
          const genreId = this.movieS.getGenreIdByName(genre);
          return genreId !== undefined && this.selectedGenres.has(genreId);
        });
      return matchesSearch && matchesGenres;
    });
  }
}
