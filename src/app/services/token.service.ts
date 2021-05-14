import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Token } from '../models/token.model';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';
import { TransactionsService } from './transactions.service';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private itemsCollections: AngularFirestoreCollection<Token>;

  constructor(private fb:AngularFirestore,private _user:UserService,private _transaction:TransactionsService ) { }

  user:User = this._user.getUserAuthenticated();

  getTokens(){
    this.itemsCollections = this.fb.collection<Token>('tokens');
    return this.itemsCollections.snapshotChanges().pipe(
      map(actions => {       
        return actions.map(a => {
          const data = a.payload.doc.data() as Token;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    )
  }

  createToken( token:any ){
    let data:Token = {
      quantity:token.quantity,
      price:token.price,
      owner:this.user.name,
      owner_id:this.user.id
    }
    console.log("DATA:",data)
    return this.fb.collection('tokens').add( data ).then( (resp)=>{
      console.log("CREATE TOKEN:",resp.id)
      let trans = {
        quantity:token.quantity,
        price:token.price,
        token_id:resp.id,
        type:'PUBLISHED'
      }
      console.log("TRANS:",trans)
      console.log("USER",this.user)
      this._transaction.createTransactionSell(trans,token)
      this._user.updateToken(data.quantity,false);
     
      }).catch((err)=>{
        return new Error(err);
      });

     
  }


  updateToken(token:any,quantity){
    let totalQuantity = token.quantity - quantity;
    console.log("TOTALQUANTITY:",totalQuantity)
    return this.fb.collection('tokens').doc(token.id).update({quantity: totalQuantity});  
  }

  deleteToken(token:Token){
      return this.fb.collection('tokens').doc(token.id).delete().then( e=>{
          this._user.updateToken(token.quantity,false)
      });
  }

 


}
