// src/app/components/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../services/cart.service';
import { cartItem } from '../../models/cart';
import { Tag } from '../../models/tag';
import { Marble } from '../../models/marble';
import { MarblesService } from '../../services/marables.service';
import { UserServiceService } from '../../services/user.service.service';
import { User } from '../../models/User';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
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
  newComment: string = '';
  newRating: number = 0; // Add this line for the new comment's rating
  selectedTags: string[] = [];
  currentUser: User | null = null;

  constructor(
    private cartService: CartService,
    private marblesService: MarblesService,
    private commentService: CommentService,
    private userService: UserServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadMarbles();
    this.loadTags();
    this.userService.userObservable.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadMarbles() {
    this.marblesService.getAll().subscribe(marbles => {
      this.marbles = marbles;
      this.visibleProducts = marbles;
      this.filteredProducts = marbles;
      this.updatePagination();
    });
  }

  loadTags() {
    this.marblesService.getAllTags().subscribe(tags => {
      this.tags = tags;
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
      this.updatePagination();
    } else {
      this.marblesService.getAllmarbleByTag(tagName).subscribe({
        next: (data) => {
          this.filteredProducts = data;
          this.updatePagination();
        },
        error: (error) => {
          console.error('Error filtering by tag:', error);
        }
      });
    }
  }

  searchProducts() {
    this.currentPage = 1;
    this.updatePagination();
  }

  private updatePagination() {
    let productsToDisplay = [...this.filteredProducts];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.descriptions.some(desc => desc.toLowerCase().includes(query))
      );
    }

    this.filteredProducts = productsToDisplay;

    // Calculate pagination
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Get current page items
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.visibleProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openModal(product: Marble) {
    this.selectedProduct = product;
    this.showModal = true;
    this.newRating = 0; // Reset rating when opening modal

    // Load comments when opening modal
    if (product.id) {
      this.loadCommentsForProduct(product.id);
    }
  }

  closeModal(event?: MouseEvent) {
    if (!event || event.target === event.currentTarget) {
      this.showModal = false;
      this.selectedProduct = null;
      this.newComment = '';
      this.newRating = 0; // Reset rating when closing modal
    }
  }

  addToCart(marble: Marble | null) {
    if (marble) {
      const cartItem0 = new cartItem(marble, 1);
      this.cartService.addToCart(cartItem0);
    }
  }

  private loadCommentsForProduct(marbleId: string) {
    this.commentService.getCommentsByMarbleId(marbleId).subscribe({
      next: (comments: any) => {
        if (this.selectedProduct) {
          this.selectedProduct.comments = comments;
        }
      },
      error: (error: any) => {
        console.error('Error loading comments:', error);
      }
    });
  }

  setNewRating(rating: number) {
    this.newRating = rating;
  }

  submitComment() {
    // Validation: Ensure product, user, comment text, and rating exist
    if (!this.selectedProduct || !this.currentUser || !this.newComment.trim() || this.newRating === 0) {
      this.toastr.warning('Veuillez fournir un commentaire et une note.', 'Informations manquantes');
      return;
    }

    const comment: Comment = {
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      text: this.newComment.trim(),
      rating: this.newRating, // Include the rating here
      marbleId: this.selectedProduct.id
    };

    console.log('Submitting comment:', comment);

    this.commentService.addComment(comment).subscribe({
      next: (savedComment: Comment) => {
        console.log('Comment saved successfully:', savedComment);

        if (this.selectedProduct) {
          // Initialize comments array if it doesn't exist
          this.selectedProduct.comments = this.selectedProduct.comments || [];

          // Add the new comment to the product's comment list
          this.selectedProduct.comments.push(savedComment);
          this.newComment = '';
          this.newRating = 0; // Reset rating after successful submission
        }
        this.toastr.success('Commentaire ajouté avec succès !', 'Succès');
      },
      error: (error: any) => {
        console.error('Error submitting comment:', error);

        if (error.status === 500) {
          console.error('Server error: Please check your backend logs for more details.');
        } else if (error.error?.message) {
          console.error('Backend error message:', error.error.message);
        }

        this.toastr.error('Échec de l\'ajout du commentaire. Veuillez réessayer plus tard.', 'Erreur');
      }
    });
  }
}
