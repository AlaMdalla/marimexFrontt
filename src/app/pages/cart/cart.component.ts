import { Component, OnInit } from '@angular/core';
import { cart, cartItem } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsComponent } from "../../components/maps/maps.component"; // For navigation in checkout

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, MapsComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: cartItem[] = [];
  cart!: cart;
  location:any;
  showMapModal = false;
number_of_phone: string = '';
order_name: string='';

  openMap() {
    this.showMapModal = true;
  }

  handleLocation(location: { lat: number; lng: number }) {
    this.location=location;
    console.log('Selected Location:', location);
    // You can save this to a form or send it to the server later
  }
  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.cartItems = this.cart.cartItems;
    console.log('Cart items:', this.cartItems);
  }

  increaseQuantity(item: cartItem): void {
    this.cartService.updateQuantity(item.marbel.id, item.count + 1);
    this.cart = this.cartService.getCart(); 
  }

  decreaseQuantity(item: cartItem): void {
    if (item.count > 1) {
      this.cartService.updateQuantity(item.marbel.id, item.count - 1);
      this.cart = this.cartService.getCart(); 
    }
  }

  updateQuantity(item: cartItem): void {
    const quantity = Math.max(1, item.count); 
    this.cartService.updateQuantity(item.marbel.id, quantity);
    this.cart = this.cartService.getCart(); 
  }

  removeItem(item: cartItem): void {
    this.cartService.removeFromCart(item.marbel.id);
    this.cart = this.cartService.getCart(); 
    this.cartItems = this.cart.cartItems; 
  }

  calculateSubtotal(): number {
    return this.cart.totalPrice;
  }

  checkout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    } else {
      alert('Your cart is empty!');
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cart = this.cartService.getCart();
    this.cartItems = this.cart.cartItems;
  }
  submitOrder(): void {
    const commande = {
      list_marbles: this.cartItems.map(item => ({
        marble: item.marbel.id, // Use marble ID
        count: item.count,
       
      })),
       number_of_phone  :this.number_of_phone,
      totalPrice: this.cart.totalPrice,
      location: this.location,
      order_name:this.order_name
    };
    console.log('Sending commande:', commande); 
    this.cartService.submitOrder(commande);
  }
}