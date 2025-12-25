import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersApi, OrderTrackingResponse } from '../../services/orders.api';

type ViewStatus = 'idle' | 'loading' | 'found' | 'not-found';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tracking.html',
  styleUrl: './tracking.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tracking {

  private fb = inject(FormBuilder);
  private ordersApi = inject(OrdersApi);
  private cdr = inject(ChangeDetectorRef);

  viewStatus: ViewStatus = 'idle';

  order: OrderTrackingResponse | null = null;

  form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(5)]],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const code = this.form.getRawValue().code.trim().toUpperCase();

    // Mostrar feedback inmediato
    this.viewStatus = 'loading';
    this.cdr.markForCheck();

    this.ordersApi.trackOrder(code).subscribe({
      next: (order) => {
        this.order = order;
        this.viewStatus = 'found';
        this.cdr.markForCheck();
      },
      error: () => {
        this.order = null;
        this.viewStatus = 'not-found';
        this.cdr.markForCheck();
      }
    });
  }

  reset() {
    this.order = null;
    this.viewStatus = 'idle';
    this.form.reset();
    this.cdr.markForCheck();
  }
  
  get statusLabel(): string {
    if (!this.order) return '';

    switch (this.order.status) {
      case 'PendingPayment':
        return 'Pendiente de pago';
      case 'Paid':
        return 'Pagado';
      case 'Preparing':
        return 'En preparación';
      case 'Shipped':
        return 'Enviado';
      case 'OutForDelivery':
        return 'En reparto';
      case 'Delivered':
        return 'Entregado';
      default:
        return '';
    }
  }

  get statusMessage(): string {
    if (!this.order) return '';

    switch (this.order.status) {
      case 'PendingPayment':
        return 'Estamos esperando la confirmación del pago.';
      case 'Paid':
        return 'El pago ha sido confirmado correctamente.';
      case 'Preparing':
        return 'Tu Tochoko se está preparando artesanalmente.';
      case 'Shipped':
        return 'Tu pedido ha salido de nuestro obrador.';
      case 'OutForDelivery':
        return 'El repartidor está en camino.';
      case 'Delivered':
        return 'Tu pedido ha sido entregado. ¡Disfrútalo!';
      default:
        return '';
    }
  }
}
