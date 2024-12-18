import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AccessRoutingModule } from './access-routing.module';

@NgModule({
    imports: [CommonModule, ButtonModule, AccessRoutingModule],
})
export class AccessModule {}
