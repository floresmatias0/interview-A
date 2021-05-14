import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  user: User = new User();
    
  form:FormGroup;

  constructor( private _user:UserService, private fb:FormBuilder, private toast:ToastController,private router:Router ) { 
    this.createForm();
  }

  ngOnInit() {
  }
  
  async createToast(message){
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  create(  ){
    if(this.form.valid){
      this._user.createUser(this.form.value).then( e => {
        this.form.reset();
        this.createToast('Datos Creados');
        this.router.navigate(['login']);

      })
    } 
  
  }

  fieldValid(field){
    return this.form.get(field).invalid && this.form.get(field).touched;
  }

  createForm(){
    this.form = this.fb.group({
       name:['',[Validators.required]],
       surname:['',[Validators.required]],
       genre:['',[Validators.required]],
       email:['',[Validators.required,Validators.email]],
       password:['',Validators.required],
     })
   }

}

