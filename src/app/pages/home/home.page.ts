import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { Token } from '../../models/token.model';
import { UserService } from '../../services/user.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Transactions } from '../../models/transactions.model';
import { BuyPage } from '../buy/buy.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  inputQuantity:FormGroup;  
  tokens:Token[] = [];
  
  constructor( private fb:FormBuilder,private _token:TokenService, public _user:UserService, private toast:ToastController,public modal:ModalController ) {
    this.createForm();  
    this._token.getTokens().subscribe(e => {
      this.tokens = e;
    });

   }

   fieldValid(field){
     console.log("INPUT QUANTITY:",field)
    return this.inputQuantity.get(field).invalid && this.inputQuantity.get(field).touched;
  }

  createForm(){
    this.inputQuantity = this.fb.group({
       quantity:['',Validators.required],
     })
   }

   test(){
     var aux = []

     for(var i = 0; i < this.tokens.length; i++){
       if(this.inputQuantity.value.quantity >= this.tokens[i].price){
         console.log("ES MENOR O IGUAL", this.tokens[i].price)
         aux.push(this.tokens[i])
       }
     }
      if(this.inputQuantity.invalid) return;
      this.tokens = aux
   }

   async createToast(message){
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }


  async presentModal(token:Token) {
    const modal = await this.modal.create({
      component: BuyPage,
      cssClass: 'my-custom-class',
      componentProps:{
        'token':token
      }
    });
    return await modal.present();
  }

  buyTokens(){
  
   


  }

  cancelToken(token:Token){
      this._token.deleteToken(token).then(e => {
        this.createToast('Token Cancelados');
      })
  }

}
