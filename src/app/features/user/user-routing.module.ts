import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', loadChildren: ()=> import("./pages/master-user/master-user.module").then(m => m.MasterUserModule)},
        { path: 'new', loadChildren: ()=> import("./pages/new-user/new-user.module").then(m => m.NewUserModule)},
    ]
)],
    exports: [RouterModule]
})
export class UserRoutingModule {}