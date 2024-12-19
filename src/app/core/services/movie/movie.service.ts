import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie, MOVIES_MOCK } from './movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor() {
    this.loadMovies();
  }
  
  private movies: Movie[] = MOVIES_MOCK;
  private moviesSubject$ = new BehaviorSubject<Movie[]>(this.movies) // Поток фильмов
  private genres: Map<number, string> = new Map([ // Список жанров с их id
    [1, 'Фантастика'],
    [2, 'Триллер'],
    [3, 'Драма'],
    [4, 'Комедия'],
    [5, 'Фэнтези'],
    [6, 'Экшен'],
    [7, 'Криминал'],
    [8, 'Мультфильм'],
  ]);
  
  getMovies(): Observable<Movie[]> {
    return this.moviesSubject$.asObservable()
  }
  
  /**
   * Метод загрузки списка фильмов из localStorage
   * Используется начальный список фильмов (MOVIES_MOCK)
   */
  private loadMovies() {
    const savedMovies = localStorage.getItem('movies');
    if (savedMovies) {
      this.movies = JSON.parse(savedMovies);
      this.moviesSubject$.next(this.movies);
    }
  }
  
  /**
   * Сохраняет текущий список фильмов в localStorage
   */
  private saveMoviesLocalStorage() {
    localStorage.setItem('movies', JSON.stringify(this.movies));
  }
  
  /**
   * Метод получения списка жанров в виде массива объектов
   */
  getGenresArray(): { id: number; name: string }[] {
    return Array.from(this.genres, ([id, name]) => ({ id, name }));
  }
  
  addMovie(movie: Movie) {
    movie.id = this.movies.length + 1;
    movie.createdYear = new Date();
    movie.updatedYear = new Date();
    this.movies.push(movie);
    this.moviesSubject$.next(this.movies);
    this.saveMoviesLocalStorage();
  }
  
  /**
   * Метод удаления фильма по ID
   */
  deleteMovie(id: number) {
    this.movies = this.movies.filter(movie => movie.id !== id);
    this.moviesSubject$.next(this.movies);
    this.saveMoviesLocalStorage();
  }
  
  /**
   * Метод редактирования выбранного фильма
   * Устанавливаем новую дату обновления
   * @param updatedMovie - выбранный фильм
   */
  editMovie(updatedMovie: Movie): void {
    const index = this.movies.findIndex(movie => movie.id === updatedMovie.id);
    if (index !== -1) { // Если фильм найден
      this.movies[index] = { ...updatedMovie, updatedYear: new Date() };
      this.moviesSubject$.next(this.movies);
      this.saveMoviesLocalStorage();
    }
  }
  
  /**
   * Возвращаем id жанра по его названию
   */
  getGenreIdByName(name: string): number | undefined {
    for (const [id, genreName] of this.genres.entries()) {
      if (genreName === name) {
        return id;
      }
    }
    return undefined;
  }
  
}
