import {Component, OnInit} from '@angular/core';
import {ServicesService} from '../../../services/services.service';
import {ContractAttachModel} from '../../../models/contract-attach.model';
import {SubscriptionRequestModel} from '../../../models/subscription-request.model';
import {Setting} from '../../../models/setting.model';
import {AdminService} from '../../../services/admin.service';
import * as _ from 'underscore';
import {DynamicModel} from '../../../models/dynamic.model';

@Component({
  selector: 'app-subscription-requests',
  templateUrl: './subscription-requests.component.html',
  styleUrls: ['./subscription-requests.component.scss']
})
export class SubscriptionRequestsComponent implements OnInit {

  page = 1;
  pageSize = 0;
  totalElements: number;
  totalPages: number;
  numberOfItems: number;
  itemsPerPage: number;
  sort: any;
  filter: any;
  subscriptionRequests: Array<SubscriptionRequestModel>;
  clientContracts: Array<ContractAttachModel>;
  contractNo: string;
  dynamic: DynamicModel;
  selectedContract: string;
  private clientDetails: any;

  constructor(private services: ServicesService,
              private adminService: AdminService) {
  }

  ngOnInit() {
    this.getAdvice();
    this.getClientAttachedContracts();
  }


  getClientAttachedContracts() {
    this.services.clientAttachedContracts().subscribe(response => {
      this.clientContracts = response.data;
      if (this.clientContracts && this.clientContracts.length) {
        this.selectedContract = this.clientContracts[0].contractNo;
        const clientContractsNo = _.pluck(this.clientContracts, 'contractNo');
        const savedContractNo = localStorage.getItem('SELECTED_CONTRACT');
        if (savedContractNo && clientContractsNo.includes(savedContractNo)) {
          this.selectedContract = localStorage.getItem('SELECTED_CONTRACT');
        }
        this.setContract(this.selectedContract);

      }
    }, err => {
      console.log(err)
    });
  }

  getSubscriptions(contractNo: string): void {
    this.services.getSubscriptionRequests(contractNo, this.page, this.pageSize)
      .subscribe(response => {
        this.subscriptionRequests = response.data['content'];
        this.totalElements = response.data['totalElements'];
        this.totalPages = response.data['totalPages'];
        this.itemsPerPage = response.data['size'];
        this.numberOfItems = response.data['numberOfElements'];
      }, err => {
      });
  }

  setContract(contractNo: string) {
    this.contractNo = contractNo;
    localStorage.setItem('SELECTED_CONTRACT', contractNo);
    this.getSubscriptions(this.selectedContract);
    this.services.getClientDetailsByContractNo(contractNo).subscribe(response => {
      this.clientDetails = response.data;
      console.log(this.clientDetails);
    }, err => {
      console.log(err)
    });
  }

  pageChanged(page: number): void {
    this.page = page;
    this.getSubscriptions(this.selectedContract);
  }

  getAdvice() {
    this.adminService.getDynamicContent('conseil').subscribe(
      response => {
        this.dynamic = response.data;
      }, err => {
        console.log(err)
      });
  }

}
