import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {ServicesService} from '../../../services/services.service';

@Component({
    selector: 'app-new-subscription-request',
    templateUrl: './new-subscription-request.component.html',
    styleUrls: ['./new-subscription-request.component.scss']
})
export class NewSubscriptionRequestComponent implements OnInit {

    subscriptionForm: FormGroup;

    public subscriptionRequestForm = new FormGroup({
        subscriptionType: new FormControl(''),
        firstAndLastName: new FormControl(''),
        profession: new FormControl(''),
        workingPlace: new FormControl(''),
        addressOfWork: new FormControl(''),
        cellphone: new FormControl(''),
        homePhonenumber: new FormControl(''),
        workPhonenumber: new FormControl(''),
        address: new FormControl(''),
        predecessor: new FormControl(''),
        oldWaterSubscription: new FormControl(''),
        oldElectricitySubscription: new FormControl('')
    });

    constructor(private servicesService: ServicesService,
                private formBuilder: FormBuilder) {
        this.subscriptionForm = this.formBuilder.group({
            'subscriptionType': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'firstAndLastName': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'profession': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'workingPlace': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'addressOfWork': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'cellphone': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'homePhonenumber': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'workPhonenumber': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'address': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'predecessor': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'oldWaterSubscription': ['', Validators.compose(
                [
                    Validators.required
                ])],
            'oldElectricitySubscription': ['', Validators.compose(
                [
                    Validators.required
                ])]
        });
    }

    ngOnInit() {
    }

    saveRequest(): void {
        let subscriptionReq: any = {
            requestNumber: 1111,
            client: JSON.parse(localStorage.getItem('user')),
            subscriptionType: 'NEW'
        };
        if (this.subscriptionRequestForm.controls.subscriptionType.value) {
            subscriptionReq.predecessor = this.subscriptionRequestForm.controls.predecessor.value;
            subscriptionReq.oldWaterSubscription = this.subscriptionRequestForm.controls.oldWaterSubscription.value;
            subscriptionReq.oldElectricitySubscription = this.subscriptionRequestForm.controls.oldElectricitySubscription.value;
            subscriptionReq.subscriptionType = 'MUTATION';
        }
        subscriptionReq = {
            requestNumber: 1122
        };
        this.servicesService.saveSubscriptionRequest(subscriptionReq).subscribe(response => {
            console.log(response);
        }, err => {
        });
        console.log(subscriptionReq);
    }

}
