import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user.service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { IUserLogin } from '../../interfaces/IUserLogin';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
declare const google: any;

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm: FormGroup;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: UserServiceService,
    private toastrService: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastrService.error('Please fill in all required fields correctly.', 'Invalid Input');
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const userLogin: IUserLogin = this.loginForm.value;
    this.authService.login(userLogin).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.loading = false;
                // Error is already handled in AuthService's login method via toastr
      }
    });
  }
  




  ngOnInit(): void {
  google.accounts.id.initialize({
    client_id: '888458691925-b29803cqn9mdrek15g467jbmb5k1i1it.apps.googleusercontent.com',
    callback: this.handleCredentialResponse.bind(this),
  });

  google.accounts.id.renderButton(
    document.getElementById('googleBtn'),
    { theme: 'outline', size: 'large' }
  );
}

handleCredentialResponse(response: any) {
  const idToken = response.credential;
  this.authService.googleLogin(idToken).subscribe(() => {
            this.router.navigate(['/products']);

  })
    
   
}}
