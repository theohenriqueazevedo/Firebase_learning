import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-add-movie',
  standalone: false,
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.scss'
})
export class AddMovieComponent {
  movieForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.movieForm = this.fb.group({
      name: ['', [Validators.required]],
      rating: [0, [Validators.required]],
      analysis: ['', [Validators.required]],
      photo_path: ['']
    });
  }

  setRating(rating: number) {
    this.movieForm.patchValue({ rating });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.movieForm.valid) {
      const formData = this.movieForm.value;
      if (this.selectedFile) {
        const filePath = `movies/${Date.now()}_${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        this.storage.upload(filePath, this.selectedFile).then(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formData.photo_path = url;
            this.databaseService.addDocument('movies', formData).then(() => {
              this.movieForm.reset();
              this.selectedFile = null;
              this.previewUrl = null;
              this.closeModal.emit();
            });
          });
        });
      } else {
        this.databaseService.addDocument('movies', formData).then(() => {
          this.movieForm.reset();
          this.closeModal.emit();
        });
      }
    }
  }

  @Output() closeModal = new EventEmitter<void>();
  onClose() {
    this.closeModal.emit();
  }
}

