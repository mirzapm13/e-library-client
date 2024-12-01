import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MasterRoutingModule } from './master-routing.module';

@NgModule({
    imports: [CommonModule, ButtonModule, MasterRoutingModule],
})
export class MasterModule {}
