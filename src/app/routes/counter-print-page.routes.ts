import {Routes} from '@angular/router';

export const COUNTER_PRINT_ROUTES: Routes = [
    {
        path: 'service-approach/counter-print',
        loadChildren: './main/pages/counter-print-page/counter-print-page.module#CounterPrintPageModule'
    }
];
