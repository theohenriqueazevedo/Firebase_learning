import { Component } from '@angular/core';
import { MovieInterface } from '../../shared/interfaces/movie-interface';
import { DatabaseService } from '../../shared/services/database.service';

@Component({
  selector: 'app-favoritos',
  standalone: false,
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent {
  movies: MovieInterface[] = [];

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.databaseService.getCollection('movies').subscribe((movies: MovieInterface[]) => {
      this.movies = movies;
    });
  }

  get favoriteMovies(): MovieInterface[] {
    return this.movies.filter(m => m.favorite);
  }

  toggleFavorite(movie: MovieInterface) {
    const updatedMovie = { ...movie, favorite: !movie.favorite };
    this.databaseService.updateDocument('movies', movie.id, updatedMovie)
      .then(() => {
        const idx = this.movies.findIndex(m => m.id === movie.id);
        if (idx !== -1) {
          this.movies[idx] = updatedMovie;
        }
      })
      .catch(error => {
        console.error('Erro ao favoritar/desfavoritar filme:', error);
      });
  }
}
