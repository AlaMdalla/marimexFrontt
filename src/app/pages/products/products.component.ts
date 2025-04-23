import { Component } from '@angular/core';
import { Marble } from '../../models/marble';
import { MarblesService } from '../../services/marables.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Tag } from '../../models/tag';
import { cartItem } from '../../models/cart';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  isTagMenuOpen = false;
  marbles: Marble[] = [];
  tags: Tag[] = [];
  visibleProducts: Marble[] = [];
  selectedProduct: Marble | null = null;
  showModal: boolean = false;
  searchQuery: string = ''; // Add search query property

  // Load More logic
  itemsPerPage: number = 6;
  currentPage: number = 1;

  constructor(private marbleService: MarblesService, private cartService: CartService) {
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
      next: data => {
        this.tags = data.sort((a, b) => b.count - a.count);
        console.log('tags', this.tags);
      }
    });
  }

  toggleTagMenu() {
    this.isTagMenuOpen = !this.isTagMenuOpen;
    console.log('Tag menu toggled:', this.isTagMenuOpen);
  }

  // Filter products by tag
  filterByTag(tagName: string) {
    this.isTagMenuOpen = false;
    this.currentPage = 1; // Reset pagination
    if (tagName === 'all') {
      this.visibleProducts = [...this.marbles];
      this.applySearchFilter(); // Apply search filter if any
    } else {
      this.marbleService.getAllmarbleByTag(tagName).subscribe({
        next: data => {
          this.visibleProducts = data;
          this.applySearchFilter(); // Apply search filter if any
        }
      });
    }
  }

  // Search products
  searchProducts() {
    this.currentPage = 1; // Reset pagination
    this.applySearchFilter();
  }

  // Apply search filter to visible products
  applySearchFilter() {
    if (!this.searchQuery.trim()) {
      this.loadProducts(); // Reset to original filtered products if search is empty
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.visibleProducts = this.marbles.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.descriptions.includes(query) 
    ).slice(0, this.currentPage * this.itemsPerPage);
  }

  loadProducts() {
    const endIndex = this.currentPage * this.itemsPerPage;
    this.visibleProducts = this.marbles.slice(0, endIndex);
    this.applySearchFilter(); // Apply search filter if any
  }

  loadMore() {
    this.currentPage++;
    this.loadProducts();
  }

  openModal(product: Marble) {
    console.log('Opening modal for:', product);
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal(event?: MouseEvent) {
    if (!event || event.target === event.currentTarget) {
      this.showModal = false;
      this.selectedProduct = null;
    }
  }

  addToCart(marble: Marble | null) {
    if (marble) {
      const cartItem0 = new cartItem(marble, 1);
      this.cartService.addToCart(cartItem0);
    }
  }
}