import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MasterUserComponent } from "./master-user.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {path: '', component: MasterUserComponent},
        ])
    ]
})

export class MasterUserRoutingModule {}