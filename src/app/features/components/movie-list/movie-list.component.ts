import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../../core/services/movie/movie.service';
import { Movie } from '../../../core/services/movie/movie.interface';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddMovieComponent } from '../../modals/modal-add-movie/modal-add-movie.component';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { NgForOf, NgIf } from '@angular/common';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatOption,
    MatSelect,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit {
  
  constructor(
    private movieS: MovieService,
    private dialog: MatDialog,
    private translateS: TranslateService,
  ) { }
  
  movies: Movie[] = []; // Фильмы
  filteredMovies: Movie[] = []; // Отфильтрованные фильмы
  searchTerm: string = '';
  genres: { id: number; name: string }[] = []; // Жанры
  selectedGenres: number[] = []; // Выбранные жанры
  
  releaseYears: number[] = [];
  selectedYear: number | null = null;
  selectedCreatedDate: Date | null = null;
  selectedUpdatedDate: Date | null = null;
  
  /**
   * Загружаем список фильмов и жанров при открытии страницы
   */
  ngOnInit() {
    this.movieS.getMovies().subscribe(movies => {
      this.movies = movies;
      this.filteredMovies = movies;
      const years = movies.map((movie) => movie.releaseYear);
      this.releaseYears = Array.from(new Set(years)).sort((a, b) => b - a);
    });
    this.genres = this.movieS.getGenresArray();
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
    const dialogRef = this.dialog.open(ModalAddMovieComponent,
      {
        width: '600px',
        maxHeight: '90vh',
        autoFocus: false,
      });
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
   * Проверяем, совпадают ли две даты (время игнорируем)
   * @param date1 - Первая дата для сравнения
   * @param date2 - Вторая дата для сравнения
   */
  sameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }
  
  /**
   * Очистка инпутов фильтрации
   * @param filterName - "тип" инпута
   * @param event
   */
  clearFilter(filterName: FilterType, event: MouseEvent) {
    event.stopPropagation();
    switch (filterName) {
      case 'year':
        this.selectedYear = null;
        break;
      case 'createdDate':
        this.selectedCreatedDate = null;
        break;
      case 'updatedDate':
        this.selectedUpdatedDate = null;
        break;
    }
    this.applyFilters();
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
      
      const matchesGenre =
        !this.selectedGenres.length || // Если нет выбранных жанров, условие выполнится
        movie.genre.some((g) => {
          const genreId = this.movieS.getGenreIdByName(g); // Получаем ID жанра
          return genreId !== undefined && this.selectedGenres.includes(genreId); // Проверяем, есть ли жанр в выбранных
        });
      
      const matchesYear = !this.selectedYear || movie.releaseYear === this.selectedYear;
      const matchesCreatedDate = !this.selectedCreatedDate || this.sameDay(new Date(movie.createdYear), this.selectedCreatedDate);
      const matchesUpdatedDate = !this.selectedUpdatedDate || this.sameDay(new Date(movie.updatedYear), this.selectedUpdatedDate);
      
      return matchesSearch && matchesGenre && matchesYear && matchesCreatedDate && matchesUpdatedDate;
    });
  }
}

export type FilterType = 'year' | 'createdDate' | 'updatedDate';
