import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Checkout } from './pages/checkout/checkout';
import { Success } from './pages/success/success';
import { Tracking } from './pages/tracking/tracking';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'checkout',
        component: Checkout
    },
    {
        path: 'success',
        component: Success
    },
    {
        path: 'tracking',
        component: Tracking
    }
];
