import { Component } from '@angular/core';
import { MovieInterface } from '../../shared/interfaces/movie-interface';
import { DatabaseService } from '../../shared/services/database.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  // VARIÁVEIS

  showAddMovieModal: boolean = false;
  searchQuery: string = ''; // controle de pesquisa de filmes
  displayedMovies: MovieInterface[] = []; // filmes exibidos na tela
  movies: MovieInterface[] = [];
  limit: number = 3; // 3 filmes no maximo por vez
  currentOffset: number = 0; 
  showUpdateMovieModal: boolean = false;
  selectedMovie: MovieInterface | null = null;
  
  constructor(private databaseService: DatabaseService){ }


  ngOnInit(){

    this.databaseService.getCollection('movies').subscribe((movies: MovieInterface[]) => {
      this.movies = movies;
      this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit); // exibe os 4 filmes iniciais
    })

    
  }

  deleteMovie(id:string){
    this.databaseService.deleteDocument('movies',id).then(()=>{
      console.log("Documento excluido com sucesso.")
    }).catch(error=>{
      console.log(error)
    })
  }



  toggleAddMovieModal(){
    this.showAddMovieModal = !this.showAddMovieModal; // abre e fecha o modal
  }

  filterMovies(): void {
    const query = this.searchQuery.trim().toLowerCase();
    const sanitizedQuery = query.replace(/[\.\-]/g, '');
  
    if (sanitizedQuery === '') {
      // Se não houver pesquisa, exibe a página atual normalmente
      this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
    } else {
      // Filtra sobre todos os filmes
      const filteredMovies = this.movies.filter(movie => {
        const titleMatch = movie.name ? movie.name.toLowerCase().includes(sanitizedQuery) : false;
        return titleMatch;
      });
  
      // Reinicia o offset para começar da primeira página do resultado filtrado
      this.currentOffset = 0;
      this.displayedMovies = filteredMovies.slice(this.currentOffset, this.currentOffset + this.limit);
    }
  }

  // avançar no layout de filmes (4 por vez)
  showNext() {
    if (this.currentOffset + this.limit < this.movies.length) {
      this.currentOffset += this.limit;
      this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
    }
  }

  // voltar no layout de filmes (4 por vez)
  showPrevious() {
    if (this.currentOffset - this.limit >= 0) {
      this.currentOffset -= this.limit;
      this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
    }
  }


  openUpdateModal(movie: MovieInterface) {
    this.selectedMovie = { ...movie };
    this.showUpdateMovieModal = true;
  }

  saveUpdateMovie(updatedMovie: MovieInterface | null) {
    if (!updatedMovie || !updatedMovie.id) return;
    this.databaseService.updateDocument('movies', updatedMovie.id, updatedMovie)
      .then(() => {
        const idx = this.movies.findIndex(m => m.id === updatedMovie.id);
        if (idx !== -1) {
          this.movies[idx] = { ...updatedMovie };
          this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
        }
        this.closeUpdateMovieModal();
      })
      .catch(error => {
        console.error('Erro ao atualizar filme:', error);
      });
  }

  closeUpdateMovieModal() {
    this.selectedMovie = null;
    this.showUpdateMovieModal = false;
  }

  toggleFavorite(movie: MovieInterface) {
    const updatedMovie = { ...movie, favorite: !movie.favorite };
    this.databaseService.updateDocument('movies', movie.id, updatedMovie)
      .then(() => {
        const idx = this.movies.findIndex(m => m.id === movie.id);
        if (idx !== -1) {
          this.movies[idx] = updatedMovie;
          this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
        }
      })
      .catch(error => {
        console.error('Erro ao favoritar/desfavoritar filme:', error);
      });
  }

}
