import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateOrderRequest {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  quantity: number;
}

export interface CreateOrderResponse {
  trackingCode: string;
}

export interface OrderTrackingResponse {
  trackingCode: string;
  status: 'PendingPayment' | 'Paid' | 'Preparing' | 'Shipped' | 'OutForDelivery' | 'Delivered';
  quantity: number;
  createdAt: string;
  paidAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class OrdersApi {
  private readonly baseUrl = 'https://tochoko-back.onrender.com';

  constructor(private http: HttpClient) {}

  createOrder(payload: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(
      `${this.baseUrl}/orders`,
      payload
    );
  }

  trackOrder(code: string): Observable<OrderTrackingResponse> {
    return this.http.get<OrderTrackingResponse>(
      `${this.baseUrl}/orders/track/${code}`
    );
  }
}
