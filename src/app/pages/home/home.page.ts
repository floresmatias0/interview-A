import { Component, OnInit } from '@angular/core';
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

  tokens:Token[] = [];
  
  constructor( private _token:TokenService, public _user:UserService, private toast:ToastController,public modal:ModalController ) {
        
    this._token.getTokens().subscribe(e => {
      console.log("TOKEN:",e)
      this.tokens = e;
    });

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
