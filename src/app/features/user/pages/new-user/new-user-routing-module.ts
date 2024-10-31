import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NewUserComponent } from "./new-user.component";

@NgModule({
    imports:[RouterModule.forChild([
        {path: "", component: NewUserComponent}
    ])]
})

export class NewUserRoutingModule{}