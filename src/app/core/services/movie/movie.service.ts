import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from './movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor() { }
  
  private movies: Movie[] = [
    {
      id: 1,
      title: 'Матрица',
      genre: ['Фантастика'],
      releaseYear: 1996,
      director: 'Вачовски',
      actors: ['Киану Ривз', 'Лоренс Фишбёрн'],
      annotation: 'Жизнь Томаса Андерсона разделена на две части: Хакер Нео узнает, что его мир — виртуальный. Выдающийся экшен, доказавший, что зрелищное кино может быть умным',
      createdYear: new Date(),
      updatedYear: new Date(),
    }
  ]
  
  private moviesSubject$ = new BehaviorSubject<Movie[]>(this.movies);
  
  getMovies(): Observable<Movie[]> {
    return this.moviesSubject$.asObservable()
  }
  
  addMovie(movie: Movie) {
    movie.id = this.movies.length + 1;
    movie.createdYear = new Date();
    movie.updatedYear = new Date();
    this.movies.push(movie);
    this.moviesSubject$.next(this.movies);
  }
  
  deleteMovie(id: number) {
    
  }
}
