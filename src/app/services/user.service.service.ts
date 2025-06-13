import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { User } from './../models/User';
import { IUserRegister } from '../interfaces/IuserRegister';
import { IUserLogin } from '../interfaces/IUserLogin';

import {
  USER_LOGIN_URL,
  USER_REGISTER_URL,
  GOOGLE_AUTH_URL
} from '../constans/urls';

const UserKey = 'User';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  private redirectUrl: string = '/';

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  // Traditional Login
  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Marimex ${user.name}!`,
            'Login Successful'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
  }

  // Traditional Registration
  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Marimex ${user.name}!`,
            'Register Successful'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Register Failed');
        }
      })
    );
  }

  // Google Login
  googleLogin(token: string): Observable<User> {
    console.log('Attempting Google login...');
    return this.http.post<User>(GOOGLE_AUTH_URL, { token }).pipe(
      tap({
        next: (user) => {
          if (!user || !user.token) {
            console.error('Invalid response from server');
            throw new Error('Invalid response from server');
          }

          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Marimex ${user.name}!`,
            'Login Successful'
          );
        },
        error: (errorResponse) => {
          const errorMessage = errorResponse.error?.error || 'Google login failed';
          this.toastrService.error(errorMessage, 'Login Failed');
          throw errorResponse;
        }
      })
    );
  }

  logout(): void {
    this.userSubject.next(new User());
    localStorage.removeItem(UserKey);
    window.location.reload();
  }

  private setUserToLocalStorage(user: User): void {
    localStorage.setItem(UserKey, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(UserKey);
    return userJson ? JSON.parse(userJson) as User : new User();
  }

  // For redirecting after login
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string {
    return this.redirectUrl;
  }
}
