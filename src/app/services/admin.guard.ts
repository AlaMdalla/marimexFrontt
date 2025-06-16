import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserServiceService } from './user.service.service';
import { User } from '../models/User';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: UserServiceService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      const user: User | null = await firstValueFrom(this.authService.userObservable);

      if (user && user.isAdmin) {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
    } catch (error) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
