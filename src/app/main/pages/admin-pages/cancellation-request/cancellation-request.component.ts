import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    TemplateRef,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {WizardComponent, WizardState} from 'angular-archwizard';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AdminService} from '../../../services/admin.service';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import swal from 'sweetalert2';

// @ts-ignore
import _ = require('underscore');
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-cancellation-request',
    templateUrl: './cancellation-request.component.html',
    styleUrls: ['./cancellation-request.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CancellationRequestComponent implements OnInit {
    @ViewChild('wizard') wizard: WizardComponent;
    @ViewChild('StepButton') StepButton: ElementRef;
    @ViewChild('UpdateButton') UpdateButton: ElementRef;
    @ViewChild('commentaire') commentaire: ElementRef;
    public selectedStep: number;
    public requestForm: FormGroup;
    public commentForm: FormGroup;
    public addInterventionForm: FormGroup;
    public request: any;
    public impaye = 0;
    public isEmpty = true;
    public isPublic: Boolean = false;
    public requestUpdate: any;
    public modalRef: BsModalRef;
    private wizardState: WizardState;
    public config = {
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'modal-lg'
    };
    public agents = [{
        id: 1,
        firstname: 'younes',
        lastname: 'elansari',
        phone: '0633433443'
    }, {
        id: 2,
        firstname: 'Admin',
        lastname: 'AL ADMIN',
        phone: '0633334444'
    }
    ];

  private translate: TranslateService;

    constructor(private requestService: AdminService,
                private router: Router,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private modalService: BsModalService,
                private toastrService: ToastrService) {
        this.requestForm = this.formBuilder.group({
            agent: ['', Validators.required],
            dateIntervention: ['', Validators.required],
            phone: ['', Validators.required]
        });
        this.commentForm = this.formBuilder.group({
            comment: ['', Validators.required],
            checkbox: ['']
        });
        this.addInterventionForm = this.formBuilder.group({
            agent: ['', Validators.required],
            dateIntervention: ['', Validators.required],
            phone: ['', Validators.required]
        });
    }

    // RequestForm
    get agent() {
        return this.requestForm.get('agent');
    }

    get dateIntervention() {
        return this.requestForm.get('dateIntervention');
    }

    get phone() {
        return this.requestForm.get('phone');
    }

    // CommentForm
    get comment() {
        return this.commentForm.get('comment');
    }

    get checkbox() {
        return this.commentForm.get('checkbox');
    }

    // InterventionForm
    get agentIntervention() {
        return this.addInterventionForm.get('agent');
    }

    get interventionDate() {
        return this.addInterventionForm.get('dateIntervention');
    }

    get phoneIntervenant() {
        return this.addInterventionForm.get('phone');
    }

    checkStatus() {
        console.log('%%%%%' + this.request);
        switch (this.request.status) {
            case 'CREATED':
                this.selectedStep = 0;
                break;
            case 'RECEIVED':
                this.selectedStep = 1;
                break;
            case 'IN_PROGRESS':
                this.selectedStep = 2;
                break;
            case 'DEPOSITED_COUNTER':
                this.selectedStep = 3;
                break;
            case 'UNPAID_VERIFICATION':
                this.selectedStep = 4;
                break;
            case 'SETTLEMENT':
                this.selectedStep = 5;
                break;
            case 'CLOSED':
                this.selectedStep = 6;
                break;
        }
        this.wizardState = this.wizard.model;
        this.wizardState.navigationMode.goToStep(this.selectedStep, new EventEmitter(), new EventEmitter());
    }

    ngOnInit() {
        const id: string = this.route.snapshot.paramMap.get('id');
        if (id !== null) {
            this.requestService.getRequest(id).subscribe(response => {
                this.request = response.data;
                console.log(this.request);
                this.checkStatus();
                if (this.request.status === 'RECEIVED' || this.request.status === 'CREATED') {
                    this.UpdateButton.nativeElement.disabled = true;
                } else {
                    this.UpdateButton.nativeElement.disabled = false;
                }
            });
        }
    }

    // Choice of step + show Add Intervenant Popup
    AddIntervention(template: TemplateRef<any>) {
        if (this.request.status === 'UNPAID_VERIFICATION') {
            this.requestService.getSolde().subscribe(response => {
                this.impaye = response[0].impaye;
                this.nextStep(this.request.id);
            })
        } else if (this.request.status === 'RECEIVED') {
            this.modalRef = this.modalService.show(template, this.config);
        } else {
            this.nextStep(this.request.id);
        }
    }

    // Stepper
    nextStep(id) {
        swal({
            title: this.translate.instant('ARE_YOU_SURE'),
            text: this.translate.instant('THIS_ACTION_IS_IRREVERSIBLE'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.translate.instant('CANCEL'),
            confirmButtonText: this.translate.instant('YES_DELETE')
        }).then((result) => {
            if (result.value) {
                const agentId: number = JSON.parse(localStorage.getItem('user')).id;
                console.log(agentId);
                if (this.request.status === 'CREATED') {
                    this.requestService.setAsReceived(id, agentId).subscribe(response => {
                        this.selectedStep = this.selectedStep + 1;
                        this.ngOnInit();
                    }, err => {
                    })
                } else if (this.request.status === 'IN_PROGRESS') {
                    this.requestService.setAsDepositedCounter(id, agentId).subscribe(response => {
                        this.selectedStep = this.selectedStep + 1;
                        this.ngOnInit();
                    }, err => {
                    })
                } else if (this.request.status === 'DEPOSITED_COUNTER') {
                    this.requestService.setAsUnpaidVerification(id, agentId).subscribe(response => {
                        this.selectedStep = this.selectedStep + 1;
                        this.ngOnInit();
                    }, err => {
                    })
                } else if (this.request.status === 'UNPAID_VERIFICATION') {
                    this.requestService.setAsSettlement(id, agentId).subscribe(response => {
                        this.selectedStep = this.selectedStep + 1;
                        this.ngOnInit();
                    }, err => {
                    })
                } else if (this.request.status === 'SETTLEMENT') {
                    this.requestService.setAsClosed(id, agentId).subscribe(response => {
                        this.selectedStep = this.selectedStep + 1;
                        this.ngOnInit();
                    }, err => {
                    })
                }
                /*this.requestService.nextStep(id, this.impaye, agentId).subscribe(response => {
                  this.request = response.data;
                  if (this.request.status === 'CLOSED') {
                    this.StepButton.nativeElement.disabled = true;
                  }
                });*/
            }
        });
    }

    // Add Comment
    addComment() {
        if (this.checkbox.value === null || this.checkbox.value === '') {
            this.isPublic = false;
        } else {
            this.isPublic = true;
        }

        this.request.feedback.push({message: this.comment.value, sendingDate: new Date(), ispublic: this.isPublic});

        this.request.agent = JSON.parse(localStorage.getItem('user'));

        this.request.subscriptions = _.pluck(this.request.subscriptions, 'id');

        this.requestService.saveTerminationRequest(this.request).subscribe(response => {
                this.commentForm.reset();
                this.isEmpty = true;
                this.ngOnInit();
            },
            (err) => {
            });
    }

    // Add Intervenant Popup impl
    addIntervenant() {
        this.request.interventionDate = this.addInterventionForm.controls.dateIntervention.value;
        this.request.intervenant = {
            id: Number.parseInt(this.addInterventionForm.controls.agent.value, 10)
        };
        this.request.subscriptions = _.pluck(this.request.subscriptions, 'id');
        console.log(this.request);
        const agentId: number = JSON.parse(localStorage.getItem('user')).id;
        this.requestService.setAsInProgress(this.request.id, agentId, this.request.intervenant.id, this.request.interventionDate)
            .subscribe(response => {
                this.modalRef.hide();
                this.ngOnInit();
            })
    }

    // Update Intervenant Popup impl
    updateIntervenant() {
        this.request.interventionDate = this.requestForm.controls.dateIntervention.value;
        this.request.intervenant = {
            id: Number.parseInt(this.requestForm.controls.agent.value, 10)
        }
        console.log(this.request);
        this.requestService.saveTerminationRequest(this.request).subscribe(response => {
            console.log(response);
            this.ngOnInit();
        })
    }

    openUpdateForm(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.config);
        this.requestForm.controls.agent.setValue(this.request.intervenant.id);
        this.requestForm.controls.dateIntervention.setValue(moment(this.request.interventionDate).format('YYYY-MM-DD'));
        this.requestForm.controls.phone.setValue(this.agents[this.request.intervenant.id - 1].phone);
    }

    focus() {
        this.commentaire.nativeElement.focus();
    }

    getPhone(value: number) {
        console.log(value);
        value = value - 1;
        console.log(value);
        this.addInterventionForm.controls.phone.setValue(this.agents[value].phone);
        this.requestForm.controls.phone.setValue(this.agents[value].phone);
    }

    validate(value: String) {
        if (value !== '') {
            this.isEmpty = false;
        } else {
            this.isEmpty = true;
        }
    }

}
