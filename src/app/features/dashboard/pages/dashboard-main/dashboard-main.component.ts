import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { UserService } from 'src/app/core/auth/services/user.service';
import { BookmarkService } from 'src/app/shared/services/bookmark.service';
import { DocumentService } from 'src/app/shared/services/document.service';

@Component({
    selector: 'app-dashboard-main',
    standalone: true,
    imports: [CommonModule, ButtonModule, DataViewModule],
    templateUrl: './dashboard-main.component.html',
    styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit {
    constructor(
        private oidcSecurityService: OidcSecurityService,
        private bookmarkService: BookmarkService,
        private documentService: DocumentService,
        private router: Router
    ) {}

    item: string = 'Hello Angular';

    lineChartData: any;

    lineChartOptions: any;

    pieChartData: any;

    pieChartOptions: any;

    bookmarks: any;

    documents: any;

    ngOnInit() {
        this.bookmarkService.getBookmarks().subscribe((data) => {
            this.bookmarks = data;
        });

        this.documentService.getDocuments().subscribe((data) => {
            this.documents = data;
        });
    }

    getToken() {
        this.oidcSecurityService
            .checkAuth()
            .subscribe(
                ({
                    isAuthenticated,
                    userData,
                    accessToken,
                    idToken,
                    configId,
                }) => {
                    console.log(userData);
                }
            );
    }

    goToDocument(id) {
        this.router.navigateByUrl(`/library/dokumen/${id}`);
    }

    // initChart() {
    //     const documentStyle = getComputedStyle(document.documentElement);
    //     const textColor = documentStyle.getPropertyValue('--text-color');
    //     const textColorSecondary = documentStyle.getPropertyValue(
    //         '--text-color-secondary'
    //     );
    //     const surfaceBorder =
    //         documentStyle.getPropertyValue('--surface-border');

    //     this.lineChartData = {
    //         labels: [
    //             'January',
    //             'February',
    //             'March',
    //             'April',
    //             'May',
    //             'June',
    //             'July',
    //         ],
    //         datasets: [
    //             {
    //                 label: 'First Dataset',
    //                 data: [65, 59, 80, 81, 56, 55, 40],
    //                 fill: false,
    //                 backgroundColor:
    //                     documentStyle.getPropertyValue('--primary-700'),
    //                 borderColor:
    //                     documentStyle.getPropertyValue('--primary-700'),
    //                 tension: 0.4,
    //             },
    //             {
    //                 label: 'Second Dataset',
    //                 data: [28, 48, 40, 19, 86, 27, 90],
    //                 fill: false,
    //                 backgroundColor: '#f3dfa8',
    //                 borderColor: '#f3dfa8',
    //                 tension: 0.4,
    //             },
    //         ],
    //     };

    //     this.lineChartOptions = {
    //         plugins: {
    //             legend: {
    //                 labels: {
    //                     color: textColor,
    //                 },
    //             },
    //         },
    //         scales: {
    //             x: {
    //                 ticks: {
    //                     color: textColorSecondary,
    //                 },
    //                 grid: {
    //                     color: surfaceBorder,
    //                     drawBorder: false,
    //                 },
    //             },
    //             y: {
    //                 ticks: {
    //                     color: textColorSecondary,
    //                 },
    //                 grid: {
    //                     color: surfaceBorder,
    //                     drawBorder: false,
    //                 },
    //             },
    //         },
    //     };

    //     this.pieChartData = {
    //         labels: ['Set A', 'Set B'],
    //         datasets: [
    //             {
    //                 label: 'First Dataset',
    //                 data: [65, 59],
    //                 backgroundColor: [
    //                     documentStyle.getPropertyValue('--primary-700'),
    //                     // documentStyle.getPropertyValue('--primary-200'),
    //                     '#f3dfa8',
    //                 ],
    //                 tension: 0.4,
    //             },
    //         ],
    //     };

    //     this.pieChartOptions = {
    //         plugins: {
    //             legend: {
    //                 labels: {
    //                     color: textColor,
    //                 },
    //             },
    //         },
    //         scales: {
    //             x: {
    //                 ticks: {
    //                     color: textColorSecondary,
    //                 },
    //                 grid: {
    //                     color: surfaceBorder,
    //                     drawBorder: false,
    //                 },
    //             },
    //             y: {
    //                 ticks: {
    //                     color: textColorSecondary,
    //                 },
    //                 grid: {
    //                     color: surfaceBorder,
    //                     drawBorder: false,
    //                 },
    //             },
    //         },
    //     };
    // }
}
