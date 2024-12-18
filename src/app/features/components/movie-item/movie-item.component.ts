import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardImage } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { Movie } from '../../../core/services/movie/movie.interface';
import { MovieService } from '../../../core/services/movie/movie.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-movie-item',
  standalone: true,
	imports: [
		MatCard,
		MatCardContent,
		MatCardImage,
		MatCardActions,
		MatButton,
		TranslatePipe,
		NgOptimizedImage
	],
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.scss'
})
export class MovieItemComponent {
	
	constructor(
		private movieS: MovieService
	) { }
	
	@Input() movie!: Movie;
	@Output() delete = new EventEmitter<number>();
	
	onDelete() {
		this.delete.emit(this.movie.id);
	}
}
