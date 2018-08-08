import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClaimRequestComponent} from './claim-request/claim-request.component';
import {SubscriptionRequestComponent} from './subscription-request/subscription-request.component';
import {CancellationRequestComponent} from './cancellation-request/cancellation-request.component';
import {OnlinePaymentComponent} from './online-payment/online-payment.component';
import {ServicesPagesRoutingModule} from './services-pages-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CancellationRequestsComponent} from './cancellation-requests/cancellation-requests.component';
import { NewCancellationRequestComponent } from './new-cancellation-request/new-cancellation-request.component';
import { ClaimRequestsComponent } from './claim-requests/claim-requests.component';
import { ClaimDetailComponent } from './claim-detail/claim-detail.component';
import { PrintableCancellationComponent } from './printable-cancellation/printable-cancellation.component';
import { NewSubscriptionRequestComponent } from './new-subscription-request/new-subscription-request.component';

@NgModule({
  imports: [
    CommonModule,
    ServicesPagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ClaimRequestComponent,
    SubscriptionRequestComponent,
    CancellationRequestComponent,
    CancellationRequestsComponent,
    NewCancellationRequestComponent,
    OnlinePaymentComponent,
    ClaimRequestsComponent,
    ClaimDetailComponent,
    PrintableCancellationComponent,
    NewSubscriptionRequestComponent,
  ]
})
export class ServicesPagesModule {
}