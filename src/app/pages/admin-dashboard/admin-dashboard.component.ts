import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarblesService } from '../../services/marables.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { AdminMarbelsDisplayComponent } from '../admin-marbels-display/admin-marbels-display.component';
import { Marble } from '../../models/marble';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ReactiveFormsModule, AdminMarbelsDisplayComponent, CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  providers: [],
})
export class AdminDashboardComponent {
  marbleForm!: FormGroup;
  loading = false;
  isUpdateMode = false;
  currentMarbleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private marbelservice: MarblesService,
    private toastr: ToastrService,
    private router:   Router

  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.marbleForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      favorite: [false],
      stars: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      imageurl: ['', Validators.required],
      descriptions: ['', Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const image: File = event.target.files[0];
    if (!image) return;

    this.loading = true;
    this.marbelservice.uploadImage(image).subscribe({
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
      if (this.isUpdateMode && this.currentMarbleId) {
        this.marbelservice.updateMarble(this.currentMarbleId, this.marbleForm.value).subscribe({
          next: () => {
            this.toastr.success('Marble updated successfully!');
            this.resetForm();
            this.loading = false;
          },
          error: (err) => {
            this.toastr.error('Failed to update marble.');
            console.error('Update failed:', err);
            this.loading = false;
          },
        });
      } else {
      this.marbelservice.ADD_Marble(this.marbleForm.value).subscribe({
        next: () => {
          this.toastr.success('Marble added successfully!');
          this.resetForm();
          this.loading = false;
        },
        error: (err) => {
          this.toastr.error('Failed to add marble.');
          console.error('Add failed:', err);
          this.loading = false;
        },
      });
      }
    }
  }

  resetForm(): void {
    this.marbleForm.reset({
      name: '',
      price: 0,
      favorite: false,
      stars: 0,
      imageurl: '',
      descriptions: '',
    });
    this.isUpdateMode = false;
    this.currentMarbleId = null;
  }

  navigateToUpdateMarble(marbleId: string) {
    this.router.navigate(['update', marbleId]);
  }}
