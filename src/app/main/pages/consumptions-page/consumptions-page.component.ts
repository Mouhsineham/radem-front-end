import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonUtil} from '../../../core/helpers/common.util';
import {ContractsService} from '../../services/contracts.service';

import {UtilsService} from '../../services/utils.service';
import {FileModel} from '../../../core/models/file.model';
import {ServicesService} from '../../services/services.service';
import {User} from '../../models/user.model';
import {AuthHelper} from '../../../core/services/security/auth.helper';
import * as moment from 'moment';
import * as _ from 'underscore';
import {BaseChartDirective, Color} from 'ng2-charts';
import {ContractAttachModel} from '../../models/contract-attach.model';
import {ContractModel} from '../../models/contract.model';
import {ConsumptionHistoryModel} from '../../models/consumptionHistory.model';
import {ConsumptionReportModel} from '../../models/consumptionReport.model';
import {ToastrService} from 'ngx-toastr';
import {HttpHeaderResponse, HttpResponse} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {CounterModel} from '../../models/counter.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-consumption-page',
  templateUrl: './consumptions-page.component.html',
  styleUrls: ['./consumptions-page.component.scss']
})
export class ConsumptionsPageComponent implements OnInit {
  @ViewChild('chart1') chart1: BaseChartDirective;
  @ViewChild('chart2') chart2: BaseChartDirective;
  public user: User;
  clientContracts: Array<ContractAttachModel>;
  contracts: Array<ContractModel>;
  historyForm: FormGroup;
  consumptionsHistory: Array<ConsumptionHistoryModel> = [];
  consumptionsHistoryCurrentYear: Array<ConsumptionHistoryModel> = [];
  consumptionsReport: Array<ConsumptionReportModel> = [];
  legth: any;
  selectedContract: string;

  today: any = moment();
  minDate: any = moment().subtract(5, 'years');
  selectedLink: any = 'volume';
  page = 1;
  pageSize = 0;
  numberOfItems: number;
  totalElements: number;
  totalPages: number;
  itemsPerPage: number;


  public chartType = 'bar';
  public chartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  currentYear = moment().format('YYYY');
  lastYear = moment().subtract(1, 'years').format('YYYY');
  public chartDataSetsVolume: Array<any> = [
    {data: [], label: this.currentYear.toString()},
    {data: [], label: this.lastYear.toString()}
  ];
  public chartDataSetsInvoice: Array<any> = [
    {data: [], label: this.currentYear.toString()},
    {data: [], label: this.lastYear.toString()}
  ];

  public chartOptionsEau: any = {

    title: {
      display: true,
      text: 'Volume'
    },
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public chartOptionsFact: any = {
    title: {
      display: true,
      text: 'Facturation en DH'
    },
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  private WaterBar1: Color = {
    backgroundColor: 'rgba(151,187,205, 1)',
    borderWidth: 1,
    borderColor: 'rgba(151,187,205,1)',
    pointBackgroundColor: 'rgba(151,187,205,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(220,220,220,1)'
  };
  private WaterBar2: Color = {
    backgroundColor: 'rgba(180, 228, 250, 1)',
    borderWidth: 1,
    borderColor: 'rgba(180, 228, 250,1)',
    pointBackgroundColor: 'rgba(180, 228, 250,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(151,187,205,1)'
  };
  public chartColorsEau: Array<any> = [
    this.WaterBar1,
    this.WaterBar2
  ];
  private FactBar1: Color = {
    backgroundColor: 'rgba(102,205,170, 1)',
    borderWidth: 1,
    borderColor: 'rgba(102,205,170, 1)',
    pointBackgroundColor: 'rgba(231, 76, 60,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(231, 76, 60, 1)'
  };
  private FactBar2: Color = {
    backgroundColor: 'rgba(163,225,204, 1)',
    borderWidth: 1,
    borderColor: 'rgba(163,225,204, 1)',
    pointBackgroundColor: 'rgba(151,187,205,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(151,187,205,1)'
  };
  public chartColorsFact: Array<any> = [
    this.FactBar1,
    this.FactBar2
  ];
  private clientDetails: any;
  private contract: ContractModel;
  private counter: CounterModel;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: false,
    class: 'modal-lg'
  };



  constructor(
    private contractServices: ContractsService,
    private adminService: AdminService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private services: ServicesService,
    private translate: TranslateService) {
    this.historyForm = this.formBuilder.group({
      contract: ['', Validators.required],
      startDate: [this.today, Validators.required],
      endDate: [this.today, Validators.required]
    });
  }

  ngOnInit() {
    if (localStorage.getItem(AuthHelper.USER_ID)) {
      this.user = JSON.parse(localStorage.getItem(AuthHelper.USER_ID));
    }
    this.getClientAttachedContracts();
  }


  refresh_chart() {
    /*
    setTimeout(() => {
      this.chartDataSetsVolume = [
        {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: this.currentYear.toString()},
        {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: this.lastYear.toString()}
      ];
      this.chartDataSetsInvoice = [
        {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: this.currentYear.toString()},
        {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: this.lastYear.toString()}
      ];
      this.chart.ngOnDestroy();
      this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
      if (this.chart && this.chart.chart && this.chart.chart.config) {
        this.chart.chart.update();
      }
    }, 100);
    */
  }

  getClientAttachedContracts() {
    this.services.clientAttachedContracts().subscribe(response => {
      this.clientContracts = response.data;
      if (this.clientContracts.length) {
        this.selectedContract = this.clientContracts[0].contractNo;
        const clientContractsNo = [];
        this.clientContracts.forEach(function (value) {
          clientContractsNo.push(value.contractNo);
        });
        const savedContractNo = localStorage.getItem('SELECTED_CONTRACT');
        if (savedContractNo && clientContractsNo.includes(savedContractNo)) {
          this.selectedContract = localStorage.getItem('SELECTED_CONTRACT');
        }
        this.setReportContract(this.selectedContract);
      }
    }, err => {
      console.log(err)
    });
  }

  getConsumptionHistory() {
    const contract = this.historyForm.controls['contract'].value;
    const startDate = moment(new Date(this.historyForm.controls['startDate'].value));
    const endDate = moment(new Date(this.historyForm.controls['endDate'].value));
    this.adminService.getPageableHistoryConsumptions(contract,
      startDate,
      endDate,
      this.page,
      this.pageSize)
      .subscribe(response => {
        this.consumptionsHistory = response.data['content'];
        this.totalElements = response.data['totalElements'];
        this.totalPages = response.data['totalPages'];
        this.itemsPerPage = response.data['size'];
        this.numberOfItems = response.data['numberOfElements'];
      }, err => console.log(err));
  }

  getConsumptionHistoryCurrentYear(contractNo) {
    this.adminService.getPageableHistoryConsumptionsCurrentYear(contractNo)
      .subscribe(response => {
        this.consumptionsHistoryCurrentYear = response.data;
      }, err => console.log(err));
  }

  pageChanged(pageNo: number) {
    this.page = pageNo;
    this.getConsumptionHistory();
  }

  pageFilter(pageSize: number): void {
    this.pageSize = pageSize;
    this.itemsPerPage = pageSize;
    this.page = 1;
    this.getConsumptionHistory();
  }

  getConsumptionReport(contractNo) {
    this.chartDataSetsInvoice = [
      {data: [], label: this.currentYear.toString()},
      {data: [], label: this.lastYear.toString()}
    ];
    this.chartDataSetsVolume = [
      {data: [], label: this.currentYear.toString()},
      {data: [], label: this.lastYear.toString()}
    ];


    this.adminService.getConsumptionReport(contractNo).subscribe(response => {
      this.consumptionsReport = response.data;
      _.each(this.consumptionsReport, (consumption, i) => {

        _.each(consumption.volumes, (volume, j) => {
          this.chartDataSetsVolume[i].label = consumption.year;
          this.chartDataSetsVolume[i].data[j] = volume ? parseFloat(volume) : 0;
        });

        _.each(consumption.amounts, (amount, j) => {
          this.chartDataSetsInvoice[i].label = consumption.year;
          this.chartDataSetsInvoice[i].data[j] = amount ? parseFloat(amount) : 0;
        });
      });


      if (this.isSelected('volume')) {
        this.chart1.ngOnChanges({});
      }
      if (this.isSelected('facturation')) {
        this.chart2.ngOnChanges({});
      }
    }, error => {
    })
  }

  setHistoryContract() {
    this.getConsumptionHistory();
  }
  openContractDetails(template: TemplateRef<any>) {
    if (localStorage.getItem('SELECTED_CONTRACT')) {
      this.contractServices.getDetailsContract(localStorage.getItem('SELECTED_CONTRACT')).subscribe(responseContract => {
        this.contractServices.getDetailCounterByContractNo(localStorage.getItem('SELECTED_CONTRACT')).subscribe(responseCounter => {
          // this.contractsServices.getSoldeByNumContract(numContract).subscribe(responseSolde => {
          this.contract = responseContract.data;
          this.counter = responseCounter.data;
          /*
          this.solde = {
              soldeExigible: responseSolde.data['soldeExigible'] || 0,
              soldetot: responseSolde.data['soldetot'] || 0
          };
          */
          this.modalRef = this.modalService.show(template, this.config);
          // }, error => console.log(error));
        }, err => console.log(err));
      }, err => console.log(err));
    }
  }

  setReportContract(contractNo: string) {
    localStorage.setItem('SELECTED_CONTRACT', contractNo);
    this.getConsumptionHistoryCurrentYear(contractNo);
    this.getConsumptionReport(contractNo);
    this.services.getClientDetailsByContractNo(contractNo).subscribe(response => {
      this.clientDetails = response.data;
      console.log(this.clientDetails);
    }, err => {
      console.log(err)
    });
  }

  downloadXlsConsumptions() {
    const contract = this.historyForm.controls['contract'].value;
    const startDate = moment(new Date(this.historyForm.controls['startDate'].value));
    const endDate = moment(new Date(this.historyForm.controls['endDate'].value));
    this.services.downloadXlsConsumptions(contract, startDate, endDate).subscribe((response) => {
      if (response && response['body']) {
        const file = new FileModel('mes-consommations.xls', CommonUtil._arrayBufferToBase64(response['body']));

        CommonUtil.downloadFile(file);
      }
    });
  }

  downloadPdfConsumptions() {
    const contract = this.historyForm.controls['contract'].value;
    const startDate = moment(new Date(this.historyForm.controls['startDate'].value));
    const endDate = moment(new Date(this.historyForm.controls['endDate'].value));
    if (contract && startDate && endDate) {
      this.services.downloadPdfConsumptions(contract, startDate, endDate).subscribe((response) => {
        if (response && response instanceof HttpResponse && response.status === 204) {
          this.toastrService.info(this.translate.instant('no-content-to-download'));
          return;
        }
        if (response && response['body']) {
          const file = new FileModel('mes-consommations.pdf', CommonUtil._arrayBufferToBase64(response['body']));
          CommonUtil.downloadFile(file);
        }
      }, error => {
      });
    } else {
      this.toastrService.warning('Veuillez remplir tous les champs', '');
    }

  }


  setRadio(e: string): void {

    this.selectedLink = e;

  }

  isSelected(name: string): boolean {

    if (!this.selectedLink) {
      return false;
    }

    return (name === this.selectedLink);
  }
}
