import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartsModule} from 'ng2-charts';
import {ContractsPageRoutingModule} from './contracts-page-routing.module';
import {ContractsPageComponent} from './contracts-page.component';
import {ContractsService} from '../../services/contracts.service';
import {ComponentsModule} from '../../../shared/components/components.module';
import {FormsModule} from '@angular/forms';
import {BsDropdownModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {SharedModule} from '../../../shared/shared.module';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {createTranslateLoader} from '../../../app.translate.factory';
import {HttpClient} from '@angular/common/http';
import {NgxPermissionsModule} from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule,
    TooltipModule,
    TabsModule,
    ContractsPageRoutingModule,
    ChartsModule,
    ComponentsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxPermissionsModule.forChild(),
    SharedModule
  ],
  declarations: [ContractsPageComponent],
  providers: [
    ContractsService
  ]
})
export class ContractsPageModule {
  constructor(private translate: TranslateService) {
    this.translate.use(localStorage['language']);
  }
}
