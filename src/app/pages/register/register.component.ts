import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../../services/user.service.service';
import { IUserRegister } from '../../interfaces/IUserLogin';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  RegisterForm!:FormGroup;
  isSubmited=false;
  returnURL='';
  constructor(
    private formBuilder:FormBuilder,private userService:UserServiceService,private activatedRoute:ActivatedRoute,private router:Router
  ){

  }
  ngOnInit(): void {
    this.RegisterForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      ConfirmPassword: ['', Validators.required],
     
    },{
      validators: PasswordMatchValidator('password','ConfirmPassword')
    });

    this.returnURL= this.activatedRoute.snapshot.queryParams['returnUrl'];
  }
  
get fc(){
  return this.RegisterForm.controls;    //fc form controls function bch to93odec tekoi feha RegisterForm.controls.email
 
 }   
 submit(){
   this.isSubmited=true;
   if(this.RegisterForm.invalid)return;
 
   const fv=this.RegisterForm.value;
   const user:IUserRegister={
    name:fv.name,
    email:fv.email,
    password:fv.password,
    ConfirmPassword:fv.ConfirmPassword,

   }
   this.userService.Register(user).subscribe(_=>{
    this.router.navigateByUrl(this.returnURL);
   })
 }     
   
}
function PasswordMatchValidator(arg0: string, arg1: string): any {
  throw new Error('Function not implemented.');
}

