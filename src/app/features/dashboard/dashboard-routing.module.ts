import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "",
                loadComponent: () =>
                    import(
                        "./pages/dashboard-main/dashboard-main.component"
                    ).then((m) => m.DashboardMainComponent),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
