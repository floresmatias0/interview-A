import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Token } from '../models/token.model';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';
import { Transactions } from '../models/transactions.model';
import { TokenService } from './token.service';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private itemsCollections: AngularFirestoreCollection<Transactions>;

  constructor( private fb:AngularFirestore, private _user:UserService ) {
        

   }

   getTransactions(){
 
     return this.fb.collection('transactions',ref => ref.where('owner_id','==',this._user.getUserAuthenticated().id)).snapshotChanges().pipe(
      map(actions => {       
        return actions.map(a => {
          const data = a.payload.doc.data() as Transactions;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    )
   }



   createTransactionBuy(transaction:Transactions,token:Token){
    let data:Transactions = {
      quantity:transaction.quantity,
      price:transaction.price,
      owner_id:this._user.getUserAuthenticated().id,
      token_id:transaction.token_id,
      type:transaction.type
    }
    return this.fb.collection('transactions').add( data ).then( (e)=>{
        this._user.updateToken(data.quantity,false);
        let totalQuantity = token.quantity - transaction.quantity;
        this.fb.collection('tokens').doc(token.id).update({quantity: totalQuantity}); 
        this.createTransactionSould(transaction,token);
      }).catch((err)=>{
        return new Error(err);
      });
   }

   createTransactionSell(transaction:any,token:Token){
    let data:Transactions = {
      quantity:transaction.quantity,
      price:transaction.price,
      owner_id:this._user.getUserAuthenticated().id,
      token_id:transaction.token_id,
      type:transaction.type
    }
    return this.fb.collection('transactions').add( data );
   }
   createTransactionSould(transaction:any,token:Token){
      let data:Transactions = {
        quantity:transaction.quantity,
        price:transaction.price,
        owner_id:token.owner_id,
        token_id:transaction.token_id,
        type:'SOULD'
      }
      console.log("DATACREATE:",data)
      return this.fb.collection('transactions').add( data );
   }
}

