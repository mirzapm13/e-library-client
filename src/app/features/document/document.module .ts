import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DocumentRoutingModule } from './document-routing.module';

@NgModule({
    imports: [CommonModule, ButtonModule, DocumentRoutingModule],
})
export class DocumentModule {}
