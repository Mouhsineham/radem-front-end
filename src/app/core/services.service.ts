import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs/Observable';
import {Response} from './models/response.model';

let headers = new HttpHeaders();
headers = headers.set('Content-Type', 'application/json; charset=utf-8');

@Injectable()
export class ServicesService {
  private urlApi: string;
  private jsonServerApi: string;

  constructor(private httpClient: HttpClient) {
    this.urlApi = environment.apiConfig.apiUrl;
    this.jsonServerApi = environment.apiConfig.jsonApiUrl;
  }

  // termination requests
  getWaterSubscriptions(): Observable<Response<Array<any>>> {
    return this.httpClient.get<Response<Array<any>>>(`${this.jsonServerApi}/subscriptions?type=eau`);
  }
  getElectricitySubscriptions(): Observable<Response<Array<any>>> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<Response<Array<any>>>(`${this.jsonServerApi}/subscriptions?type=electricite`);
  }
  getSubscriptions(): Observable<Response<Array<any>>> {
    return this.httpClient.get<Response<Array<any>>>(`${this.urlApi}/subscriptions`);
  }

  getTerminationRequests(): Observable<Response<Array<any>>> {
    return this.httpClient.get<Response<Array<any>>>(`${this.urlApi}/termination_requests`);
  }

  getTerminationRequest(id: string): Observable<Response<Array<any>>> {
    return this.httpClient.get<Response<Array<any>>>(`${this.urlApi}/termination_requests/${id}/find`);
  }

  saveTerminationRequest(request: any): Observable<Response<number>> {
    return this.httpClient.post<Response<number>>(`${this.urlApi}/termination_requests/save`, request, {headers: headers});
  }
}
