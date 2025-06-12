import { Injectable } from '@angular/core';
import { cart, cartItem } from '../models/cart';
import { COMMANDE} from './../constans/urls';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: cart = this.getCartFromLocalStorage();
  private cartSubject:BehaviorSubject<cart>= new BehaviorSubject(this.cart);

  constructor(private http: HttpClient,private toastr: ToastrService) {}

  public addToCart(cartItem: cartItem): void {
    console.log('Adding to cart:', cartItem);
    const existingItem = this.cart.cartItems.find(
      item => item.marbel.id === cartItem.marbel.id
    );
          console.log('existingItem:', existingItem)


    if (existingItem) {
      existingItem.count += cartItem.count;
    } else {
      this.cart.cartItems.push(cartItem);
    }

    this.updateCartTotals();
    this.setCartToLocalStorage();
    console.log('Cart updated:', this.cart);
  }

  public updateQuantity(itemId: string, quantity: number): void {
    const item = this.cart.cartItems.find(i => i.marbel.id === itemId);
    if (item && quantity >= 1) {
      item.count = quantity;
      this.updateCartTotals();
      this.setCartToLocalStorage();
    }
  }

  public removeFromCart(itemId: string): void {

    this.cart.cartItems = this.cart.cartItems.filter(
      item => item.marbel.id !== itemId
    );
    this.updateCartTotals();
    this.setCartToLocalStorage();
  }

  public clearCart(): void {
    this.cart = new cart();
    this.setCartToLocalStorage();
  }

  public getCartFromLocalStorage(): cart {
    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new cart();
  }

  private setCartToLocalStorage(): void {
    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
  }

  private updateCartTotals(): void {
    this.cart.totalPrice = this.cart.cartItems.reduce(
      (sum, item) => sum + item.marbel.price * item.count,
      0
    );
    this.cart.totalCount = this.cart.cartItems.reduce(
      (sum, item) => sum + item.count,
      0
    );
  }

  public getCart(): cart {
    return this.cart;
  }
 submitOrder(commande: any): void {
  console.log('khaltet:');
  console.log('Submitting order with payload:', commande);
    this.http.post(COMMANDE, commande).subscribe({

      next: (response: any) => {
        if (response.success) {
          this.toastr.success(response.message, 'Success');
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        //console.error('Order submission error:', error);
        const errorMessage = error.error?.message || 'Failed to submit order';
        this.toastr.error(errorMessage, 'Error');
      }
    });
  }
  getAllCommandes(): Observable<any> {
    return this.http.get(COMMANDE+'/getAll');
  }
    getCartObservable():Observable<cart>{
    return this.cartSubject.asObservable();
  }
    deleteCommande(orderId: string): Observable<void> {
      const url = COMMANDE +'/'+ orderId;
      return this.http.delete<void>(url).pipe(
        tap(
          () => {
            this.toastr.success('order deleted successfully!', 'Delete Successful');
          },
          (errorResponse: { error: any; }) => {
            this.toastr.error(errorResponse.error, 'Delete Failed');
          }
        )
      );
    }
}
