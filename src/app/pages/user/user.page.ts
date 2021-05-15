import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TransactionsService } from '../../services/transactions.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  user:any;
  publishedTotal = 0;
  souldTotal = 0;
  revenue = 0;
  show = false;
  constructor( private _user:UserService,private _transactions:TransactionsService,private router:Router ) {
  
    this._transactions.getTransactions().subscribe(e => {
      let published = e.forEach(e => {
        console.log("NOSE",e)
        console.log("REVENUE",this.revenue)
       if(e.type == 'PUBLISHED') this.publishedTotal += e.quantity; 
       if(e.type == 'SOULD') this.souldTotal += e.quantity;
       if(e.type == 'SOULD') this.revenue += (e.price * e.quantity);
      })
      
    })

   }

  ngOnInit() {
    this._user.getDetails().subscribe(e => {
      this.user = e;
      this.show = true;
    })
  }
  logout(){
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }
  

}
