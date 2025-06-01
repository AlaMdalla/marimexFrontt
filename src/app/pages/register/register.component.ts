import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserServiceService } from '../../services/user.service.service';
import { IUserRegister } from '../../interfaces/IuserRegister';
import { loadGapiInsideDOM,  } from 'gapi-script';
import { CommonModule } from '@angular/common';
declare const google: any;

@Component({
  selector: 'app-register',
  imports: [FormsModule,CommonModule,ReactiveFormsModule,RouterModule],

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  RegisterForm!: FormGroup;
  isSubmited = false;
  returnURL = '';
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    
  ) {}

  async ngOnInit(): Promise<void> {
    google.accounts.id.initialize({
      client_id: '888458691925-b29803cqn9mdrek15g467jbmb5k1i1it.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
    }); 
  google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { theme: 'outline', size: 'large' }
    ); 
    this.RegisterForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      ConfirmPassword: ['', Validators.required],
    }, {
      validators: PasswordMatchValidator('password', 'ConfirmPassword')
    });

    this.returnURL = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';

 }
    handleCredentialResponse(response: any) {
    const idToken = response.credential;
    this.userService.googleLogin(idToken).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }

  get fc() {
    return this.RegisterForm.controls;
  }

  submit() {
    this.isSubmited = true;
    if (this.RegisterForm.invalid) return;
    this.loading = true;

    const fv = this.RegisterForm.value;
    const user: IUserRegister = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      ConfirmPassword: fv.ConfirmPassword,
    };
    this.userService.Register(user).subscribe(_ => {
      this.router.navigateByUrl(this.returnURL);
    });
  }

  

  
}
function PasswordMatchValidator(_arg0: string, _arg1: string): any {
  throw new Error('Function not implemented.');
}

