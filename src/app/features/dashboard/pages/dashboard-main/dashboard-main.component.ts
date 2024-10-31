import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-dashboard-main',
    standalone: true,
    imports: [ChartModule],
    templateUrl: './dashboard-main.component.html',
    styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit {
    item: string = 'Hello Angular';

    lineChartData: any;

    lineChartOptions: any;

    pieChartData: any;

    pieChartOptions: any;

    ngOnInit() {
        this.initChart();
        // this.productService.getProductsSmall().then(data => this.products = data);

        // this.items = [
        //     { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        //     { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        // ];
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.lineChartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--primary-700'),
                    borderColor:
                        documentStyle.getPropertyValue('--primary-700'),
                    tension: 0.4,
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: '#f3dfa8',
                    borderColor: '#f3dfa8',
                    tension: 0.4,
                },
            ],
        };

        this.lineChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };

        this.pieChartData = {
            labels: ['Set A', 'Set B'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-700'),
                        // documentStyle.getPropertyValue('--primary-200'),
                        '#f3dfa8',
                    ],
                    tension: 0.4,
                },
            ],
        };

        this.pieChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }
}
