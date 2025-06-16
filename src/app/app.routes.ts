import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NgModule } from '@angular/core';
import { CartComponent } from './pages/cart/cart.component';
import { MapsComponent } from './components/maps/maps.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DisplayOrdersComponent } from './components/display-orders/display-orders.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EditMarbleComponent } from './pages/edit-marble/edit-marble.component';
import { AdminGuard } from './services/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'admin', component: AdminDashboardComponent ,  canActivate: [AdminGuard]},
    { path: 'admin/orders', component: DisplayOrdersComponent ,  canActivate: [AdminGuard]},
    { path: 'admin/edit/:id', component: EditMarbleComponent ,  canActivate: [AdminGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },

    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
