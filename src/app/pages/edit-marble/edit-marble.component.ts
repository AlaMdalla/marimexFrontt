import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarblesService } from '../../services/marables.service';
import { ToastrService } from 'ngx-toastr';
import { Marble } from '../../models/marble';

@Component({
  selector: 'app-edit-marble',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-marble.component.html',
  styleUrls: ['./edit-marble.component.scss']
})
export class EditMarbleComponent implements OnInit {
  marbleForm!: FormGroup;
  loading = false;
  marbleId: string = '';

  constructor(
    private fb: FormBuilder,
    private marbleService: MarblesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.marbleId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadMarbleData();
  }

  initializeForm(): void {
    this.marbleForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      favorite: [false],
      stars: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      imageurl: ['', Validators.required],
      descriptions: ['', Validators.required],
    });
  }

  loadMarbleData(): void {
    this.loading = true;
    this.marbleService.getMarbleById(this.marbleId).subscribe({
      next: (marble: Marble) => {
        this.marbleForm.patchValue({
          name: marble.name,
          price: marble.price,
          favorite: marble.favorite,
          stars: marble.stars,
          imageurl: marble.imageurl,
          descriptions: marble.descriptions
        });
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load marble data');
        console.error('Error loading marble:', error);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const image: File = event.target.files[0];
    if (!image) return;

    this.loading = true;
    this.marbleService.uploadImage(image).subscribe({
      next: (res) => {
        const secureUrl = res?.data?.secure_url;
        if (secureUrl) {
          this.marbleForm.patchValue({ imageurl: secureUrl });
          this.toastr.success('Image uploaded successfully!');
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Image upload failed!');
        console.error('Upload failed:', err);
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.marbleForm.valid) {
      this.loading = true;
      this.marbleService.updateMarble(this.marbleId, this.marbleForm.value).subscribe({
        next: () => {
          this.toastr.success('Marble updated successfully!');
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.toastr.error('Failed to update marble');
          console.error('Update failed:', error);
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}
