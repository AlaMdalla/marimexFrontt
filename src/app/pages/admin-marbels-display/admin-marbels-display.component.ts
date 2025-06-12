import { Component, EventEmitter, Output } from '@angular/core';
import { MarblesService } from '../../services/marables.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Marble } from '../../models/marble';

@Component({
  selector: 'app-admin-marbels-display',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-marbels-display.component.html',
  styleUrl: './admin-marbels-display.component.scss',
})
export class AdminMarbelsDisplayComponent {
  @Output() editMarble = new EventEmitter<Marble>();
  marbles: Marble[] = [];
  filteredMarbles: Marble[] = [];
  paginatedMarbles: Marble[] = [];
  tags: any[] = [];
  searchTerm = '';
  //sortBy = stars;
  loading = false;
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pageNumbers: number[] = [];

  constructor(
    private marbleService: MarblesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchMarbles();
  }

  fetchMarbles(): void {
    this.loading = true;
    console.log('Fetching marbles from API...');
    this.marbleService.getAll().subscribe({
      next: (data) => {
        console.log('Marbles fetched:', data);
        this.marbles = data;
        this.filteredMarbles = data;
        this.updatePagination();
      //  this.sortMarbles();
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to fetch marbles.');
        console.error('API error:', error);
        this.loading = false;
      },
    });
    this.marbleService.getAllTags().subscribe({
      next: (data) => {
        this.tags = data.sort((a, b) => b.count - a.count);
        console.log('Tags fetched:', this.tags);
      },
    });
  }

  filterMarbles(): void {
    this.filteredMarbles = this.marbles.filter((marble) =>
      marble.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    console.log('Filtered marbles:', this.filteredMarbles);
    this.currentPage = 1;
    this.updatePagination();
   // this.sortMarbles();
  }
/*
  sortMarbles(): void {
    this.filteredMarbles.sort((a, b) => {
      if (this.sortBy === 'price' || this.sortBy === 'stars') {
        return a[this.sortBy] - b[this.sortBy];
      }
        return a[this.sortBy].localeCompare(b[this.sortBy]);
    });
    console.log('Sorted marbles:', this.filteredMarbles);
    this.updatePagination();
  }*/

  deleteMarble(id: string): void {
    if (confirm('Are you sure you want to delete this marble?')) {
      this.loading = true;
      this.marbleService.deleteMarble(id).subscribe({
        next: () => {
          this.toastr.success('Marble deleted successfully!');
          this.fetchMarbles();
        },
        error: (err) => {
          this.toastr.error('Failed to delete marble.');
          console.error('Delete failed:', err);
          this.loading = false;
        },
      });
    }
  }

  onEdit(marble: Marble): void {
    this.router.navigate(['admin/edit/', marble.id]);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMarbles.length / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMarbles = this.filteredMarbles.slice(startIndex, endIndex);
    console.log('Pagination updated:', {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      paginatedMarbles: this.paginatedMarbles,
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
  navigateToUpdateMarble(marbleId: string) {
    this.router.navigate(['admin/edit/', marbleId]);
  }
}

