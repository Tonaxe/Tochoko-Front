import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { OrdersApi } from '../../services/orders.api';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {

  priceUnit = 39.99;
  priceOldUnit = 69.99;
  quantity = 1;
  selectedImage = 'assets/1.webp';

  canCreateOrder: boolean | null = null;
  remainingUnits = 0;
  hasLimitInfo = false;

  isPaying = false;

  constructor(private ordersApi: OrdersApi) {}

  ngOnInit(): void {
    this.ordersApi.canCreateOrder().subscribe({
      next: res => {
        this.canCreateOrder = res.canCreate;
        this.remainingUnits = Math.max(res.max - res.current, 0);
        this.hasLimitInfo = true;

        if (this.remainingUnits > 0 && this.quantity > this.remainingUnits) {
          this.quantity = this.remainingUnits;
        }
      },
      error: () => {
        this.canCreateOrder = true;
        this.hasLimitInfo = false;
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
    if (!this.hasLimitInfo || this.quantity < this.remainingUnits) this.quantity++;
  }

  decrease() {
    if (this.canCreateOrder === false) return;
    if (this.quantity > 1) this.quantity--;
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  buyNow() {
    if (this.canCreateOrder === false) return;
    if (this.isPaying) return;

    this.isPaying = true;

    this.ordersApi.createCheckoutSession(this.quantity)
      .pipe(finalize(() => (this.isPaying = false)))
      .subscribe({
        next: (res) => {
          window.location.assign(res.url);
        },
        error: () => {
          alert('No se pudo iniciar el pago. Intenta de nuevo.');
        }
      });
  }
}
