import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumptionPageComponent } from './consumption-page.component';
import {ConsumptionPageRoutingModule} from './consumption-page-routing.module';
import { AdminService } from '../../services/admin.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  imports: [
    CommonModule,
    ConsumptionPageRoutingModule,
    AngularFontAwesomeModule
  ],
  declarations: [ConsumptionPageComponent],
  providers: [AdminService]
})
export class ConsumptionPageModule { }