import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Movie } from '../../../core/services/movie/movie.interface';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatOption, MatSelect } from '@angular/material/select';
import { MovieService } from '../../../core/services/movie/movie.service';

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
    TranslatePipe,
    MatProgressSpinner,
    MatError,
    MatSelect,
    MatOption,
  ],
  templateUrl: './modal-add-movie.component.html',
  styleUrl: './modal-add-movie.component.scss'
})
export class ModalAddMovieComponent implements OnInit {
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // Ссылка на инпут загрузки фото
  
  constructor(
    private matSnackBar: MatSnackBar,
    private translateS: TranslateService,
    private movieS: MovieService,
    private dialogRef: MatDialogRef<ModalAddMovieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Movie> | null
  ) {}
  
  newMovie: Partial<Movie> = {};
  genreInput: string = '';
  actorsInput: string = '';
  imageFile: string = '';
  isEditMode: boolean = false; // Флаг для изменения кнопки модалки (save, edit)
  isUploading: boolean = false; // Флаг для отображения спиннера
  
  genres: { id: number; name: string }[] = [];
  selectedGenres: number[] = [];
  
  ngOnInit(): void {
    /**
     * Если происходит передача данных при редактировании фильма,
     * то ставим режим редактирования isEditMode
     */
    if (this.data) {
      this.newMovie = { ...this.data };
      if (this.data.genre) {
        this.selectedGenres = this.data.genre.map(
          genre => this.movieS.getGenreIdByName(genre))
          .filter((id) => id !== undefined) as number[];
      }
      this.actorsInput = this.data.actors?.join(', ') || '';
      this.imageFile = this.data.image || '';
      this.isEditMode = true;
    }
    
    this.genres = this.movieS.getGenresArray();
  }
  
  /**
   * Геттер для валидации кнопки добавления/изменения фильмов
   * (Заполнены ли все обязательные поля)
   */
  get isFormValid() {
    return (
      this.newMovie.title && this.newMovie.title.trim().length > 0
      && this.selectedGenres.length > 0
      && this.newMovie.director && this.newMovie.director.trim().length > 0
      && this.actorsInput && this.actorsInput.trim().length > 0
    )
  }
  
  /**
   * Метод загрузки фотографии и преобразования в Data URL
   * isUploading - состояние спиннера во время загрузки
   * @param event - ивент загрузки файла
   */
  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.isUploading = true;
      console.log(this.isUploading)
      const reader = new FileReader();
      reader.onload = () => {
        this.imageFile = reader.result as string;
        this.newMovie.image = this.imageFile;
        this.isUploading = false;
      };
      reader.onerror = () => {
        this.isUploading = false;
      }
      reader.readAsDataURL(file);
    }
  }
  
  /**
   * Метод добавления нового фильма
   * Формируется объект фильма, показывается уведомление через matSnackBar
   */
  onAddMovie() {
    this.newMovie.genre = this.selectedGenres.map(
      id => this.genres.find(genre => genre.id === id)?.name || ''
    );
    this.newMovie.actors = this.actorsInput.split(',').map(word => word.trim());
    this.newMovie.image = this.imageFile;
    this.newMovie.createdYear = new Date();
    this.newMovie.updatedYear = new Date();
    this.matSnackBar.dismiss(); // Закрываем прошлый снэкбар, чтобы не было наложений
    this.matSnackBar.open(
      this.translateS.instant('modal.snackBar.newMovie',
        {
          createdYear: this.newMovie.createdYear.toLocaleString()
        }),
      undefined,
      { duration: 4000, horizontalPosition: 'center', verticalPosition: 'bottom' }
    );
    this.dialogRef.close(this.newMovie);
  }
  
  /**
   * Метод обновления/изменения текущего фильма
   * Обновляется объект фильма, показывается уведомление через matSnackBar
   */
  onEditMovie() {
    this.newMovie.genre = this.selectedGenres.map(
      id => this.genres.find(genre => genre.id === id)?.name || ''
    );
    this.newMovie.actors = this.actorsInput.split(',').map(word => word.trim());
    this.newMovie.updatedYear = new Date();
    this.matSnackBar.dismiss();
    this.matSnackBar.open(
      this.translateS.instant('modal.snackBar.updateMovie',
        {
          updatedYear: this.newMovie.updatedYear.toLocaleString()
        }),
      undefined,
      { duration: 4000, horizontalPosition: 'center', verticalPosition: 'bottom' }
    );
    this.dialogRef.close(this.newMovie);
  }
  
  /**
   * Триггер для открытия окна выбора файла img
   */
  triggerImageUpload(): void {
    this.fileInput.nativeElement.click();
  }
}
