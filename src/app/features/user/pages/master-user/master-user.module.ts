import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MasterUserComponent } from "./master-user.component";
import { MasterUserRoutingModule } from "./master-user-routing.module";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";

@NgModule({
    imports: [
        TableModule,
        ButtonModule,
        CommonModule,
        MasterUserRoutingModule
    ],
    declarations: [MasterUserComponent],
})

export class MasterUserModule{}