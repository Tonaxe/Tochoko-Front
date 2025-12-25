import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersApi } from '../../services/orders.api';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  quantity = 1;
  unitPrice = 49.99;

  constructor(private route: ActivatedRoute, private ordersApi: OrdersApi, private router: Router) { }
  private fb = inject(FormBuilder);

  isSubmitting = false;

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(9)]],
    addressLine1: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postalCode: ['', [
      Validators.required,
      peninsulaPostalCodeValidator
    ]],
    country: ['España', [Validators.required]],
    instagram: ['', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const q = Number(params['qty']);
      this.quantity = q && q > 0 ? q : 1;
    });
  }

  get totalPrice(): number {
    return this.quantity * this.unitPrice;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      ...this.form.getRawValue(),
      quantity: this.quantity
    };

    this.ordersApi.createOrder(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.router.navigate(['/success'], {
          queryParams: { code: res.trackingCode }
        });
      },
      error: () => {
        this.isSubmitting = false;
        alert('Error al crear el pedido. Inténtalo de nuevo.');
      }
    });
  }
}

export function peninsulaPostalCodeValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value?.toString().trim();

  if (!value || !/^\d{5}$/.test(value)) {
    return { invalidPostalCode: true };
  }

  const prefix = Number(value.substring(0, 2));

  if (
    prefix === 7 ||
    prefix === 51 ||
    prefix === 52 ||
    (prefix >= 35 && prefix <= 38)
  ) {
    return { notPeninsula: true };
  }

  return null;
}