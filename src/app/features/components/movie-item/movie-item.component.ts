import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardImage } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { Movie } from '../../../core/services/movie/movie.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddMovieComponent } from '../../modals/modal-add-movie/modal-add-movie.component';

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
	],
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.scss'
})
export class MovieItemComponent {
	
	constructor(
		private dialog: MatDialog
	) { }
	
	@Input() movie!: Movie;
	@Output() delete = new EventEmitter<number>();
	@Output() edit = new EventEmitter<Movie>();
	
	/**
	 * Вызываем событие удаления фильма
	 */
	onDelete() {
		this.delete.emit(this.movie.id);
	}
	
	/**
	 * Открываем модальное окно для редактирования фильма
	 */
	onEdit() {
		const dialogRef = this.dialog.open(ModalAddMovieComponent, {
			data: this.movie,
			width: '600px',
		});
		
		dialogRef.afterClosed().subscribe((updatedMovie: Movie) => {
			if (updatedMovie) {
				this.edit.emit(updatedMovie); // Эммитим обловленные данные
			}
		});
	}
}
