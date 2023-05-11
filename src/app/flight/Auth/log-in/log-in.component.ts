import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  constructor( private router:Router) { }

  ngOnInit(): void {
  }
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]*$')
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  onSubmit() {
    console.log(this.loginForm.value)
    // handle form submission here
  }
  registration(){
    this.router.navigateByUrl('/sign-up');

  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}