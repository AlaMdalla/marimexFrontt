import { Component } from '@angular/core';
import { Marble } from '../../models/marble';
import { MarblesService } from '../../services/marables.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tag } from '../../models/tag';
import { cartItem } from '../../models/cart';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  isTagMenuOpen = false;
  marbles: Marble[] = []; // All products from API
  tags: Tag[] = [];
  visibleProducts: Marble[] = []; // Displayed products after filtering and pagination
  filteredProducts: Marble[] = []; // Current filtered products (by tag or all)
  selectedProduct: Marble | null = null;
  showModal: boolean = false;
  searchQuery: string = '';
  itemsPerPage: number = 6;
  currentPage: number = 1;

  constructor(private marbleService: MarblesService, private cartService: CartService) {
    console.log('ProductsComponent injecting MarblesService');
  }

  ngOnInit() {
    this.marbleService.getAll().subscribe({
      next: data => {
        this.marbles = data;
        this.filteredProducts = [...this.marbles]; // Initialize filteredProducts with all marbles
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
    this.searchQuery = ''; // Clear search query to avoid conflicts
    if (tagName === 'all') {
      this.filteredProducts = [...this.marbles]; // Reset to all products
    } else {
      this.marbleService.getAllmarbleByTag(tagName).subscribe({
        next: data => {
          this.filteredProducts = data; // Update filtered products based on tag
          this.loadProducts(); // Apply pagination and update visible products
        }
      });
    }
    this.loadProducts(); // Update visible products
  }

  // Search products
  searchProducts() {
    this.currentPage = 1; // Reset pagination
    this.loadProducts(); // Update visible products with search applied
  }

  // Update visible products based on current filters and pagination
  loadProducts() {
    let productsToDisplay = [...this.filteredProducts]; // Start with tag-filtered products

    // Apply search filter if search query exists
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(query) 
      );
    }

    // Apply pagination
    const endIndex = this.currentPage * this.itemsPerPage;
    this.visibleProducts = productsToDisplay.slice(0, endIndex);
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
    console.log('Adding to cart:');
    if (marble) {
      console.log('Adding to cart:', marble);
      const cartItem0 = new cartItem(marble, 1);
      this.cartService.addToCart(cartItem0);
    }
    console.log('Cart updated:', );
  }
}