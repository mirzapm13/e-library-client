
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "",
                loadComponent: () =>
                    import(
                        "./pages/document-main/document-main.component"
                    ).then((m) => m.DocumentMainComponent),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DocumentRoutingModule {}
