import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { Token } from '../../models/token.model';
import { UserService } from '../../services/user.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Transactions } from '../../models/transactions.model';
import { TransactionsService } from '../../services/transactions.service';
import { BuyPage } from '../buy/buy.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  inputQuantity:FormGroup;  
  tokens:Token[] = [];
  
  constructor( private fb:FormBuilder,private _token:TokenService, private _transaction:TransactionsService, public _user:UserService, private toast:ToastController,public modal:ModalController ) {
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

    // for(var i = 0; i < this.tokens.length; i++){
    //   if(this.tokens[i].quantity >= this.inputQuantity.value.quantity){
    //     aux.push(this.tokens[i])
    //   }
    // }
     for(var i = 0; i < this.tokens.length; i++){
       if(this.inputQuantity.value.quantity >= this.tokens[i].price){
         console.log("ES MENOR O IGUAL", this.tokens[i].price)
         aux.push(this.tokens[i])
       }
     }
      this.tokens = aux
      setTimeout(()=>{
        for(var i = 0; i < this.tokens.length; i++){
          if(this.inputQuantity.value.quantity >= this.tokens[i].price){
            let trans:any = {
              quantity:this.inputQuantity.value.quantity,
              price: this.tokens[i].price,
              token_id: this.tokens[i].id,
              type:'BOUGHTED'
            }
            if(this.tokens[i].quantity >= this.inputQuantity.value.quantity){
              this.buyTokens(trans,this.tokens[i])
              return this.createToast(`${this.inputQuantity.value.quantity} Token comprados a ${this.tokens[i].owner}` )
            }
          }
        }
      // },1000)
      // this.tokens.filter(point => {
      //   console.log("POINT:",point)
      //   for(var i = 0; i < this.tokens.length; i++){
      //     if(point.price < this.tokens[i].price){
      //       console
      //     }
      //   }
        
      //   for(var i = 0; i < point.length; i++){
      //   if(this.tokens.length > 1){
      //     console.log("FILTRADOS",this.tokens[i])
      //     for(var j = 1; j < this.tokens.length; j++){
      //       if(this.tokens[i].price > this.tokens[j].price){
      //         this.tokens.pop()
      //       }
      //     }
      //     console.log("arreglo con usuario de precio mas bajo: ",this.tokens)
      //   }
      // }
      })
      
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
    console.log("TOKEN COMPRAR:",token)
    const modal = await this.modal.create({
      component: BuyPage,
      cssClass: 'my-custom-class',
      componentProps:{
        'token':token
      }
    });
    return await modal.present();
  }

  buyTokens(trans:any,token:any){
     this._transaction.createTransactionBuy(trans,token).then(e => {
      this.inputQuantity.reset();
     });
  }

  cancelToken(token:Token){
      this._token.deleteToken(token).then(e => {
        this.createToast('Token Cancelados');
      })
  }

}
