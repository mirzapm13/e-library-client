import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RoleRoutingModule } from './role-routing.module';

@NgModule({
    imports: [CommonModule, ButtonModule, RoleRoutingModule],
})
export class RoleModule {}
