import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ConfirmService {
    constructor(private confirmService: ConfirmationService) {}

    deleteConfirm(
        message = 'Are you sure that you want to proceed?',
        acceptCallback = () => {},
        rejectCallback = () => {}
    ) {
        this.confirmService.confirm({
            message: message,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            acceptButtonStyleClass: 'p-button-danger',
            dismissableMask: true,
            accept: () => {
                acceptCallback();
            },
            reject: () => {
                rejectCallback();
            },
        });
    }

    approveConfirm(
        message = 'Are you sure that you want to proceed?',
        acceptCallback = () => {},
        rejectCallback = () => {}
    ) {
        this.confirmService.confirm({
            message: message,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-danger',
            acceptButtonStyleClass: 'p-button-success',
            dismissableMask: true,
            accept: () => {
                acceptCallback();
            },
            reject: () => {
                rejectCallback();
            },
        });
    }
}
