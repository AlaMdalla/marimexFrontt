import { Component } from '@angular/core';
import { Marble } from '../../models/marble';
import { MarblesService } from '../../services/marables.service';
import { CommonModule } from '@angular/common';
import { Tag } from '../../models/tag';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  isTagMenuOpen = false;
  marbles: Marble[] = [];
  tags:Tag[] =[];
  visibleProducts: Marble[] = [];
  selectedProduct: Marble | null = null;
  showModal: boolean = false;

  // Load More logic
  itemsPerPage: number = 6;
  currentPage: number = 1;

  constructor(private marbleService: MarblesService) {
    console.log('ProductsComponent injecting MarblesService');
  }

  ngOnInit() {
    this.marbleService.getAll().subscribe({
      next: data => {
        this.marbles = data;
        console.log('API response:', data);
        this.loadProducts(); // Initial load
      },
      error: error => console.error('API error:', error)
    });
    this.marbleService.getAllTags().subscribe({
     next: data=>{
this.tags=data.sort((a,b)=>b.count-a.count);
console.log("tags",this.tags)
      }
    })
  }
  toggleTagMenu() {
    this.isTagMenuOpen = !this.isTagMenuOpen;
    console.log('Tag menu toggled:', this.isTagMenuOpen); // Debug log
  }

  // Filter products by tag

  filterByTag(tagName: string) {
    this.isTagMenuOpen = false;
    if (tagName === 'all') {
      this.visibleProducts = [...this.marbles];
    } else {
      this.marbleService.getAllmarbleByTag(tagName).subscribe(
        {
         next: data =>{
            this.visibleProducts =data;
          }
        }
      )
      
    }
  }


  loadProducts() {
    const endIndex = this.currentPage * this.itemsPerPage;
    this.visibleProducts = this.marbles.slice(0, endIndex);
  }

  loadMore() {
    this.currentPage++;
    this.loadProducts();
  }

  openModal(product: Marble) {
    console.log('Opening modal for:', product); // Add this

    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal(event?: MouseEvent) {
    if (!event || event.target === event.currentTarget) {
      this.showModal = false;
      this.selectedProduct = null;
    }
  }
}
