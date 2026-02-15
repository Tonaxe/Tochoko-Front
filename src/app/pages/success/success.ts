import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, switchMap, timer, of } from 'rxjs';
import { OrdersApi, OrderTrackingResponse } from '../../services/orders.api';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './success.html',
  styleUrl: './success.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Success {
  private route = inject(ActivatedRoute);
  private ordersApi = inject(OrdersApi);

  trackingCode$ = this.route.queryParamMap.pipe(
    map(params => (params.get('code') ?? '').trim().toUpperCase())
  );

  order$ = this.trackingCode$.pipe(
    switchMap(code => {
      if (!code) return of(null);

      return timer(0, 2000).pipe(
        switchMap(() => this.ordersApi.trackOrder(code)),
        map(order => ({
          ...order,
          paidAt: new Date().toISOString(), // fuerza pagado “visual”
          // status NO lo toques
        }))
      );
    })
  );
}
