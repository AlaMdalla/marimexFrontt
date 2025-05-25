import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from './../models/User' ;
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../constans/urls';

import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../interfaces/IUserLogin';
import { IUserLogin } from '../interfaces/IuserRegister';

const UserKey ='User';
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

   private userSubject=new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable=new Observable<User>;


  constructor(private http:HttpClient,private toastrService:ToastrService) { 
    this.userObservable=this.userSubject.asObservable();
    
  }
  login(userLogin:IUserLogin):Observable<User>{
 return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
  tap({
    next: (user)=>{
      this.serUserToLocalStorage(user);
   this.userSubject.next(user);
   this.toastrService.success(
    
    `Welcome to marimex ${user.name}!`,
    
    'Login Successful',
    
    
    
   )
    },
    error:(errorResponse)=>{
this.toastrService.error(errorResponse.error,'Login Failed');
    }
  })  
 );
  }
  Register(userRegister:IUserRegister):Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL,userRegister).pipe(
      tap({
        next: (user)=>{
          this.serUserToLocalStorage(user);
   this.userSubject.next(user);
   this.toastrService.success(
    
    `Welcome to marimex ${user.name}!`,
    
    'Register Successful',
    
    
    
   )
        },
        error:(errorResponse)=>{
    this.toastrService.error(errorResponse.error,'Register Failed');
        }
      })
    )
     }

  private serUserToLocalStorage(user:User){
    localStorage.setItem(UserKey,JSON.stringify(user));
  }
  private getUserFromLocalStorage():User{
    const UserJSON=localStorage.getItem(UserKey);
    if(UserJSON)return JSON.parse(UserJSON) as User;
    return new User();

  }
  logout(){
    this.userSubject.next(new User());
  localStorage.removeItem(UserKey)   ;
window.location.reload();   }
}
