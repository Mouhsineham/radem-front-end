import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ServicesService} from '../../../services/services.service';
import {RefundRequestModel} from '../../../models/refund-request.model';
import {ActivatedRoute} from '@angular/router';
import * as JsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {Router} from '@angular/router';

@Component({
    selector: 'app-new-refund-detail',
    templateUrl: './new-refund-detail.component.html',
    styleUrls: ['./new-refund-detail.component.scss']
})
export class NewRefundDetailComponent implements OnInit {


    refundRequest: RefundRequestModel;

    constructor(private services: ServicesService,
                private route: ActivatedRoute,
                private router: Router,
                private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.getRefundDetail();
    }

    public captureScreen() {
        debugger;
        const data = document.getElementById('toPrint');
        html2canvas(data).then(canvas => {
            // Few necessary setting options
            const imgWidth = 208;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png')
            const pdf = new JsPDF('p', 'mm', 'a4'); // A4 size page of PDF
            const position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
            pdf.save('MYPdf.pdf'); // Generated PDF
        });
    }

    public generatePDF() {

        const doc = new JsPDF('p', 'px', 'a4');

        const source = window.document.getElementById('toPrint');

        const options = {
            pagesplit: true
        };
        doc.fromHTML(source, 10, 10, options, () => {
            doc.save(this.refundRequest.requestNo + '.pdf');
        });
    }

    getRefundDetail() {
        const requestNo: string = this.route.snapshot.paramMap.get('requestNo');
        if (requestNo !== null) {
            this.services.getRefundDetails(requestNo).subscribe(response => {
                if (response && response.data) {
                    this.refundRequest = response.data;
                } else {
                    // request not found
                }
            }, error => {
                console.log(error);
            })
        }
    }


    printComponent(cmpName) {
        const mywindow = window.open();


        mywindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../assets/app/css/bootstrap.css">');
        mywindow.document.write('<link rel="stylesheet" type="text/css" href="../../assets/app/css/stylePrint.css"></head><body>');
        mywindow.document.write(document.getElementById(cmpName).innerHTML);
        mywindow.document.write('</body></html>');


        mywindow.focus();
        setTimeout(function () {
            mywindow.print();
            mywindow.close();
        }, 1000);

    }

}
