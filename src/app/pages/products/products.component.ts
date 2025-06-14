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
  marbles: Marble[] = [];
  tags: Tag[] = [];
  visibleProducts: Marble[] = [];
  filteredProducts: Marble[] = [];
  selectedProduct: Marble | null = null;
  showModal: boolean = false;
  searchQuery: string = '';
  itemsPerPage: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;
  totalPagesArray: number[] = [];

  constructor(
    private marbleService: MarblesService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProductsData();
    this.loadTags();
  }

  loadProductsData() {
    this.marbleService.getAll().subscribe({
      next: (data) => {
        this.marbles = data;
        this.filteredProducts = [...this.marbles];
        this.loadProducts();
      },
      error: (error) => console.error('API error:', error)
    });
  }

  loadTags() {
    this.marbleService.getAllTags().subscribe({
      next: (data) => {
        this.tags = data.sort((a, b) => b.count - a.count);
      }
    });
  }

  toggleTagMenu() {
    this.isTagMenuOpen = !this.isTagMenuOpen;
  }

  filterByTag(tagName: string) {
    this.isTagMenuOpen = false;
    this.currentPage = 1;
    this.searchQuery = '';

    if (tagName === 'all') {
      this.filteredProducts = [...this.marbles];
      this.loadProducts();
    } else {
      this.marbleService.getAllmarbleByTag(tagName).subscribe({
        next: (data) => {
          this.filteredProducts = data;
          this.loadProducts();
        }
      });
    }
  }

  searchProducts() {
    this.currentPage = 1;
    this.loadProducts();
  }

  loadProducts() {
    let productsToDisplay = [...this.filteredProducts];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.descriptions.some(desc => desc.toLowerCase().includes(query))
      );
    }

    this.filteredProducts = productsToDisplay;

    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.visibleProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadMore() {
    this.currentPage++;
    this.loadProducts();
  }

  openModal(product: Marble) {
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
