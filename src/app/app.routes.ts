import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Checkout } from './pages/checkout/checkout';
import { Success } from './pages/success/success';
import { Tracking } from './pages/tracking/tracking';
import { Cookies } from './pages/cookies/cookies';
import { Privacy } from './pages/privacy/privacy';
import { Terms } from './pages/terms/terms';
import { DropComingSoon } from './pages/drop-coming-soon/drop-coming-soon';
import { ProductDetail } from './pages/product-detail/product-detail';

export const routes: Routes = [
    {
        path: 'home',
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
    },
    {
        path: 'terminos',
        component: Terms
    },
    {
        path: 'privacidad',
        component: Privacy
    },
    {
        path: 'cookies',
        component: Cookies
    },
    {
        path: 'producto',
        component: ProductDetail
    },

    { path: '', component: DropComingSoon },
    { path: '**', redirectTo: '' }
];
