import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UserServiceService } from '../../services/user.service.service';
import { IUserRegister } from '../../interfaces/IuserRegister';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
declare const google: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule],

})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  RegisterForm!: FormGroup;
  isSubmited = false;
  returnURL = '';
  loading: boolean = false;
  private routerSub?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    google.accounts.id.initialize({
      client_id: '888458691925-b29803cqn9mdrek15g467jbmb5k1i1it.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
    });

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

  ngAfterViewInit() {
    this.renderGoogleButton();
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.renderGoogleButton();
      }
    });
  }

  renderGoogleButton() {
    const btnDiv = document.getElementById('googleBtn');
    if (btnDiv) btnDiv.innerHTML = '';
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      google.accounts.id.renderButton(
        btnDiv,
        { theme: 'outline', size: 'large' }
      );
    }
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
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

    this.userService.register(user).subscribe(_ => {
      this.router.navigateByUrl(this.returnURL);
    });
  }
}

// ✅ Password Match Validator
export function PasswordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) return null;

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPasswordControl.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        if (Object.keys(errors).length === 0) {
          confirmPasswordControl.setErrors(null);
        } else {
          confirmPasswordControl.setErrors(errors);
        }
      }
      return null;
    }
  };
}
