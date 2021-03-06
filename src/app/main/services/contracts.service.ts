import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Response} from '../../core/models/response.model';
import {ContactModel} from '../models/contact.model';
import {ContractModel} from '../models/contract.model';
import {CounterModel} from '../models/counter.model';
import {UnpaidModel} from '../models/unpaid.model';

@Injectable()
export class ContractsService {
  private urlApi: string;
  private jsonServerApi: string;

  constructor(private httpClient: HttpClient) {
    this.urlApi = environment.apiConfig.apiUrl;
    this.jsonServerApi = environment.apiConfig.jsonApiUrl;
  }

  getWaterSubscriptions(): Observable<Response<Array<any>>> {
    return this.httpClient.get<Response<Array<any>>>(`${this.jsonServerApi}/subscriptions?type=eau`);
  }

  getElectricitySubscriptions(): Observable<Response<Array<any>>> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<Response<Array<any>>>(`${this.jsonServerApi}/subscriptions?type=electricite`);
  }

  getSubscriptions(page: number, pageSize: number, filter?: any, sort?: any): Observable<Response<any>> {
    return this.httpClient.get<Response<any>>(`${this.jsonServerApi}/subscriptions`);
    /*
    return this.httpClient.post<Response<any>>
    (`${this.urlApi}/client/subscription_requests?page=${page}&size=${pageSize}`,
        {
            filter,
            sort
        });
    */
  }

  getHistoryConsumptions(numContract: string): Observable<Response<any>> {
    return this.httpClient.get<Response<any>>(`${this.urlApi}/consumptions/${numContract}`);
  }

  getSoldeByNumContract(numContract: string): Observable<Response<number>> {
    return this.httpClient.get<Response<any>>(`${this.urlApi}/invoices/solde/${numContract}`);
  }

  getPageableContracts(page: number, pageSize: number): Observable<Response<ContractModel>> {
    return this.httpClient.get<Response<ContractModel>>
    (`${this.urlApi}/contracts/paged-list?page=${page}&size=${pageSize}`);
  }

  getDetailsContract(num_contract: string): Observable<Response<ContractModel>> {
    return this.httpClient.get<Response<ContractModel>>(`${this.urlApi}/contracts/${num_contract}`);
  }

  getDetailCounterByContractNo(contractNo: string): Observable<Response<CounterModel>> {
    return this.httpClient.get<Response<CounterModel>>(`${this.urlApi}/contracts/counter-details/${contractNo}`);
  }

  gePageabletUnpaidInvoicesByContractId(num_contract: string, page: number, pageSize: number): Observable<Response<ContractModel>> {
    return this.httpClient.get<Response<ContractModel>>(`${this.urlApi}/invoices/unpaid/${num_contract}/paged-list?page=${page}&size=${pageSize}`);
  }

  getUnpaidInvoicesByContractId(num_contract: string): Observable<Response<ContractModel>> {
    return this.httpClient.get<Response<ContractModel>>(`${this.urlApi}/invoices/unpaid/${num_contract}`);
  }

  getPageableBills(page: number, pageSize: number, filter?: any, sort?: any): Observable<Response<any>> {
    return this.httpClient.post<Response<any>>(`${this.urlApi}/bills/paged-list?page=${page}&size=${pageSize}`,
      {
        filter,
        sort
      });
  }

  getPageableUnpaidBills(page: number, pageSize: number, contracts: Array<string>): Observable<Response<any>> {
    return this.httpClient.post<Response<any>>(`${this.urlApi}/invoices/all/unpaid?page=${page}&size=${pageSize}`, contracts);
  }

  getAllBills(): Observable<Response<any>> {
    return this.httpClient.get<Response<any>>(`${this.jsonServerApi}/bills`);
  }

  getBill(numBill: string): Observable<Response<any>> {
    return this.httpClient.get<Response<any>>(`${this.jsonServerApi}/bills?numBill=${numBill}`);
  }

  getReleves(): Observable<Response<any>> {
    return this.httpClient.get<Response<any>>(`${this.jsonServerApi}2/releves`);
  }

  getMinMaxConsumption(id: String): Observable<Response<any>> {
    return this.httpClient.get<Response<any>>
    (`${this.jsonServerApi}2/MinMaxConsumption?id=${id}`);
  }

  getContracts(): Observable<Response<any>> {
    return this.httpClient.get<Response<any>>(`${this.jsonServerApi}2/contracts`);
  }

}
