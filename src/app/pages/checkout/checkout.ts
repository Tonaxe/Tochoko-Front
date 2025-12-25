import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersApi } from '../../services/orders.api';

const SAFE_TEXT_REGEX = /^[a-zA-ZÀ-ÿ0-9\s.,\-#ºª]{3,150}$/;
const CITY_REGEX = /^[a-zA-ZÀ-ÿ\s\-]{2,80}$/;
const PHONE_REGEX = /^[0-9+\s]{9,15}$/;
const INSTAGRAM_REGEX = /^[a-zA-Z0-9._]{1,30}$/;

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
  isSubmitting = false;

  private fb = inject(FormBuilder);

  constructor(
    private route: ActivatedRoute,
    private ordersApi: OrdersApi,
    private router: Router
  ) { }

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.pattern(SAFE_TEXT_REGEX)]],
    email: ['', [Validators.required, Validators.email]],
    instagram: ['', [Validators.required, Validators.pattern(INSTAGRAM_REGEX)]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
    addressLine1: ['', [Validators.required, Validators.pattern(SAFE_TEXT_REGEX)]],
    city: ['', [Validators.required, Validators.pattern(CITY_REGEX)]],
    postalCode: ['', [Validators.required, peninsulaPostalCodeValidator]],
    country: ['España', [Validators.required, Validators.pattern(/^España$/)]],
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

  blockPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text/plain') ?? '';
    if (/[<>]/.test(text)) {
      event.preventDefault();
    }
  }

  private sanitizePayload(data: any) {
    const cleaned: any = {};
    Object.keys(data).forEach(key => {
      cleaned[key] =
        typeof data[key] === 'string'
          ? data[key].trim().replace(/[<>]/g, '')
          : data[key];
    });
    return cleaned;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = this.sanitizePayload({
      ...this.form.getRawValue(),
      quantity: this.quantity
    });

    this.ordersApi.createOrder(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.router.navigate(['/success'], {
          queryParams: { code: res.trackingCode }
        });
      },
      error: () => {
        this.isSubmitting = false;
        alert('Error al crear el pedido.');
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
