import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { OrdersApi } from '../../services/orders.api';

type CompositionPart = {
  name: string;
  ingredients: string;
};

type ProductInfo = {
  dropName: string;
  weightApprox: string;
  allergens: string;
  made: string;
  description: string;
  composition: CompositionPart[];
};

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

  readonly product: ProductInfo = {
    dropName: 'Cereal & Milk',
    weightApprox: '850–900 g',
    allergens: 'Contiene gluten, lácteos y huevo. Puede contener trazas de frutos de cáscara.',
    made: '100% artesanal en pequeñas tandas.',
    description:
      'DROP 1: Cereal & Milk. Capas de tarta 3 leches, toffee cerealístico y crema de mascarpone cerealística, con sellado doble chocolate y crujiente final cerealístico.',
    composition: [
      {
        name: 'Tarta 3 leches',
        ingredients:
          'Huevo, harina de trigo fina, azúcar, leche entera, leche evaporada, leche condensada, leche en polvo tostada, esencia de vainilla y sal.',
      },
      {
        name: 'Toffee cerealístico',
        ingredients:
          'Azúcar blanca, mantequilla, nata 35% M.G., cereales con leche, leche en polvo tostada y sal.',
      },
      {
        name: 'Crema mascarpone cerealística',
        ingredients:
          'Queso Mascarpone, queso crema, leche condensada, cereales con leche, leche en polvo tostada y sal.',
      },
      {
        name: 'Sellado doble chocolate',
        ingredients:
          'Cobertura de chocolate blanco, chocolate con leche y polvo de cereal tostado.',
      },
      {
        name: 'Crujiente final cerealístico',
        ingredients:
          'Cereales con leche enteros envueltos en chocolate blanco y cereal tostado.',
      },
    ],
  };

  constructor(private ordersApi: OrdersApi) { }

  ngOnInit(): void {
    this.ordersApi.canCreateOrder().subscribe({
      next: (res) => {
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
      },
    });
  }

  get totalPrice(): number {
    return +(this.priceUnit * this.quantity).toFixed(2);
  }

  get totalOldPrice(): number {
    return +(this.priceOldUnit * this.quantity).toFixed(2);
  }

  get discountPct(): number {
    if (this.priceOldUnit <= 0) return 0;
    const pct = (1 - this.priceUnit / this.priceOldUnit) * 100;
    return Math.max(0, Math.round(pct));
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

    this.ordersApi
      .createCheckoutSession(this.quantity)
      .pipe(finalize(() => (this.isPaying = false)))
      .subscribe({
        next: (res) => {
          window.location.assign(res.url);
        },
        error: () => {
          alert('No se pudo iniciar el pago. Intenta de nuevo.');
        },
      });
  }
}
