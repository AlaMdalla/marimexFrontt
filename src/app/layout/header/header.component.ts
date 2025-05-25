import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { cart } from '../../models/cart';
import { UserServiceService } from '../../services/user.service.service';
import { User } from '../../models/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
cartQuantity=0;
 user!:User;
   isMenuOpen = false;
 
  constructor(cartService:CartService, private userService:UserServiceService) {
    cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    })

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    })
   }
logout(){
  this.userService.logout();
}
get isAuth(){
  return this.user.token;
}
get isAdmin(){
  return this.user.isAdmin;
}
 toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
