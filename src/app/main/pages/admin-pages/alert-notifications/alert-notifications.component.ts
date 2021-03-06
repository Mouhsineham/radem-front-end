import {Component, OnInit} from '@angular/core';
import {AlertModel} from '../../../models/alert.model';
import {AdminService} from '../../../services/admin.service';
import {BsModalRef} from 'ngx-bootstrap';
import {AlertNotificationModel} from '../../../models/alert-notification.model';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-alert-notifications',
    templateUrl: './alert-notifications.component.html',
    styleUrls: ['./alert-notifications.component.scss']
})
export class AlertNotificationsComponent implements OnInit {

    alertNotifications: any = Array<AlertNotificationModel>();
    page = 1;
    pageSize = 0;
    totalElements: number;
    totalPages: number;
    numberOfItems: number;
    itemsPerPage: number;
    sort: any;
    filter: any;
    agentsFilter: any = [];
    private translate: TranslateService;

    constructor(private adminService: AdminService,
                private toastrService: ToastrService) {
    }

    ngOnInit() {
        this.getAlertNotifications();
        this.agentsFilterable();
    }

    onSorted(sort: any): void {
        this.sort = sort;
        this.getAlertNotifications();
    }

    onFiltred(filter: any): void {
        this.filter = filter;
        this.getAlertNotifications();
    }

    getAlertNotifications() {
        this.adminService.getPageableAlertNotifications(this.page, this.pageSize, this.filter, this.sort)
            .subscribe(response => {
                this.alertNotifications = response.data.content;
                this.totalElements = response.data.totalElements;
                this.totalPages = response.data.totalPages;
                this.itemsPerPage = response.data.size;
                this.numberOfItems = response.data.numberOfElements;
            }, err => {
            });
    }

    pageChanged(page: number): void {
        this.page = page;
        this.getAlertNotifications();
    }

    pageFilter(pageSize: number): void {
        this.pageSize = pageSize;
        this.itemsPerPage = pageSize;
        this.page = 1;
        this.getAlertNotifications();
    }

    agentsFilterable(): void {
        this.adminService.getAgents().subscribe(response => {
            this.agentsFilter = response.data;
        }, error => {
        });
    }

    dropAlertNotification(alertNotificationId: number) {
        swal({
            title: this.translate.instant('ARE_YOU_SURE_YOU_WANT_TO_CONTINUE'),
            text: this.translate.instant('THIS_ACTION_IS_IRREVERSIBLE'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: this.translate.instant('YES_I_AM_SURE')
        }).then((result) => {
            if (result.value) {
                this.adminService.dropAlertNotification(alertNotificationId).subscribe((response) => {
                    if (response.status === 'OK') {
                        this.toastrService.success(this.translate.instant('SUCCESS_OPERATION'), '');
                        this.getAlertNotifications();
                    }
                }, (err) => {
                });
            }
        });
    }
}
