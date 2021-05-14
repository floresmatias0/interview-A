import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { database } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private itemsCollections: AngularFirestoreCollection<User>;

  public user:User;

  constructor( private fb:AngularFirestore ) {
 
  }

  getDetails(){
   return this.fb.collection('users').doc(this.getUserAuthenticated().id).valueChanges();
  }

  getUserAuthenticated(){
    return JSON.parse(localStorage.getItem('user'));
  }

  

  getUsers(){
    this.itemsCollections = this.fb.collection<User>('users');
    return this.itemsCollections.valueChanges();

  }
  
  createUser( user:User ){
    let data:User = {
      name:user.name,
      surname:user.surname,
      genre:user.genre,
      email:user.email,
      password:user.password,
      tokens:1000
    }
   return this.fb.collection('users').add( data );
  }

 updateToken(quantity:any,subs:boolean){
   console.log('tokens')
         let totalToken = subs ?  this.getUserAuthenticated().tokens - quantity : this.getUserAuthenticated().tokens + quantity;
         return this.fb.collection('users').doc(this.getUserAuthenticated().id).update({tokens: totalToken});  
 }

  login( email:string,password:string ){
    return this.fb.collection<any[]>('users',ref => ref.where('email','==',email).where('password','==',password)).snapshotChanges().pipe(
      map( actions => {
        return actions.map(a => {
          const user = a.payload.doc.data() as any;
          user.id = a.payload.doc.id;
          setTimeout(e => {
            localStorage.setItem('user',JSON.stringify(user));
          },100)
        })
      })
    );
            
  }



}
