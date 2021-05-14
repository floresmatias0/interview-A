import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm:FormGroup;
  public image?:string;
  public banner?:string;

  constructor( private fb:FormBuilder,private _user:UserService,private toast:ToastController,private router:Router ) {
    this.createForm();
    this.image="../../../assets/Rectangle-606.png";
    this.banner="../../../assets/Banner.png"
   }

  ngOnInit() {
  }
  async createToast(message){
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      color:"danger"
    });
    toast.present();
  }

  fieldValid(field){
    return this.loginForm.get(field).invalid && this.loginForm.get(field).touched;
  }

  createForm(){
    this.loginForm = this.fb.group({
       email:['',[Validators.required,Validators.email]],
       password:['',Validators.required],
     })
   }

   login(){
     if(this.loginForm.invalid) return;

     this._user.login(this.loginForm.value.email,this.loginForm.value.password).subscribe(resp => {
       if(resp.length == 0) return this.createToast('Datos invalido');
       setTimeout(e => {
        this.router.navigateByUrl('/tabs/home');
       },200)
     
     })
   }

}
