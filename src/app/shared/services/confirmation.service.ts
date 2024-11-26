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
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
                acceptCallback();
            },
            reject: () => {
                // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
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
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
                acceptCallback();
            },
            reject: () => {
                // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                rejectCallback();
            },
        });
    }
}
