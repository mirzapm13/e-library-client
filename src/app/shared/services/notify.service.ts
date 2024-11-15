import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class NotifyService {
    constructor(private messageService: MessageService) {}

    alert(severity, message): void {
        this.messageService.add({
            key: 'main',
            severity,
            detail: message,
        });
    }
}
