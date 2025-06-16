import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/user.service.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  template: '<h1>Admin Page</h1>',
  styles: []
})
export class AdminComponent implements OnInit {
  constructor(private userService: UserServiceService, private router: Router) {}

  async ngOnInit() {
    try {
      const user = await firstValueFrom(this.userService.userObservable);
      if (!user || !user.isAdmin) {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      this.router.navigate(['/login']);
    }
  }
}
