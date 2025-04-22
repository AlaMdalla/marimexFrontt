import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { cart } from '../../models/cart';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cart!: cart;
  constructor(private cartService: CartService){
    this.cart = this.cartService.getCart();
  }
}
