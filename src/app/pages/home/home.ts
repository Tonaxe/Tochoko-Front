import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrdersApi } from '../../services/orders.api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {

  priceUnit = 59.99;
  priceOldUnit = 69.99;
  quantity = 1;
  selectedImage = 'assets/1.jpeg';

  canCreateOrder: boolean | null = null;

  constructor(
    private router: Router,
    private ordersApi: OrdersApi
  ) { }

  ngOnInit(): void {
    this.ordersApi.canCreateOrder().subscribe({
      next: res => {
        this.canCreateOrder = res.canCreate;
      },
      error: () => {
        this.canCreateOrder = true;
      }
    });
  }

  get totalPrice(): number {
    return +(this.priceUnit * this.quantity).toFixed(2);
  }

  get totalOldPrice(): number {
    return +(this.priceOldUnit * this.quantity).toFixed(2);
  }

  increase() {
    if (this.canCreateOrder === false) return;
    this.quantity++;
  }

  decrease() {
    if (this.canCreateOrder === false) return;
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  goToCheckout() {
    if (this.canCreateOrder === false) return;

    this.router.navigate(['/checkout'], {
      queryParams: {
        qty: this.quantity
      }
    });
  }
}
