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
  private moviesSubject$ = new BehaviorSubject<Movie[]>(this.movies);
  private genres: Map<number, string> = new Map([
    [1, 'Фантастика'],
    [2, 'Триллер'],
    [3, 'Драма'],
    [4, 'Комедия'],
    [5, 'Фэнтези'],
    [6, 'Экшен'],
    [7, 'Криминал'],
    [8, 'Мультфильм'],
  ]);
  
  /**
   * Метод загрузки списка фильмов из localStorage
   */
  private loadMovies() {
    const savedMovies = localStorage.getItem('movies');
    if (savedMovies) {
      this.movies = JSON.parse(savedMovies);
      this.moviesSubject$.next(this.movies);
    }
  }
  
  private saveMoviesLocalStorage() {
    localStorage.setItem('movies', JSON.stringify(this.movies));
  }
  
  getMovies(): Observable<Movie[]> {
    return this.moviesSubject$.asObservable()
  }
  
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
   * Метод удаления фильма просто по фильтрации
   */
  deleteMovie(id: number) {
    this.movies = this.movies.filter(movie => movie.id !== id);
    this.moviesSubject$.next(this.movies);
    this.saveMoviesLocalStorage();
  }
  
  getGenreIdByName(name: string): number | undefined {
    for (const [id, genreName] of this.genres.entries()) {
      if (genreName === name) {
        return id;
      }
    }
    return undefined;
  }
  
}
