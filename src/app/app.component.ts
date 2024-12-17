import { Component } from '@angular/core';
import { MovieListComponent } from './features/components/movie-list/movie-list.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MovieListComponent, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  constructor(
    private translateS: TranslateService,
  ) {
    this.translateS.setDefaultLang('en');
    this.translateS.use('ru')
  }
  
  switchLanguage(language: string) {
    this.translateS.use(language);
  }
}
