import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {

  priceUnit = 59.99;
  priceOldUnit = 69.99;
  quantity = 1;
  selectedImage = 'assets/1.jpeg';

  constructor(private router: Router) { }


  get totalPrice(): number {
    return +(this.priceUnit * this.quantity).toFixed(2);
  }

  get totalOldPrice(): number {
    return +(this.priceOldUnit * this.quantity).toFixed(2);
  }
  increase() {
    this.quantity++;
  }

  decrease() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  goToCheckout() {
    this.router.navigate(['/checkout'], {
      queryParams: {
        qty: this.quantity
      }
    });
  }
}