import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { MasterModule } from './features/master/master.module';
import { AuthGuard } from './auth-guard.service';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
};

const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            // { path: '', loadChildren: () => import('./demo/components/dashboards/dashboards.module').then((m) => m.DashboardsModule) },
            {
                path: 'uikit',
                data: { breadcrumb: 'UI Kit' },
                loadChildren: () =>
                    import('./demo/components/uikit/uikit.module').then(
                        (m) => m.UIkitModule
                    ),
            },
            {
                path: '',
                loadChildren: () =>
                    import('./features/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'user',
                loadChildren: () =>
                    import('./features/user/user.module').then(
                        (m) => m.UserModule
                    ),
            },
            {
                path: 'library',
                children: [
                    {
                        path: '**',
                        loadChildren: () =>
                            import(
                                './shared/components/accessdenied/accessdenied.module'
                            ).then((m) => m.AccessdeniedModule),
                    },
                ],
            },
            {
                path: 'master-data',
                loadChildren: () =>
                    import('./features/master/master.module').then(
                        (m) => MasterModule
                    ),
            },
            {
                path: 'document',
                loadChildren: () =>
                    import('./features/document/document.module ').then(
                        (m) => m.DocumentModule
                    ),
            },
            {
                path: 'utilities',
                data: { breadcrumb: 'Utilities' },
                loadChildren: () =>
                    import('./demo/components/utilities/utilities.module').then(
                        (m) => m.UtilitiesModule
                    ),
            },
            {
                path: 'pages',
                data: { breadcrumb: 'Pages' },
                loadChildren: () =>
                    import('./demo/components/pages/pages.module').then(
                        (m) => m.PagesModule
                    ),
            },
            {
                path: 'profile',
                data: { breadcrumb: 'User Management' },
                loadChildren: () =>
                    import('./demo/components/profile/profile.module').then(
                        (m) => m.ProfileModule
                    ),
            },
            {
                path: 'documentation',
                data: { breadcrumb: 'Documentation' },
                loadChildren: () =>
                    import(
                        './demo/components/documentation/documentation.module'
                    ).then((m) => m.DocumentationModule),
            },
            {
                path: 'blocks',
                data: { breadcrumb: 'Prime Blocks' },
                loadChildren: () =>
                    import(
                        './demo/components/primeblocks/primeblocks.module'
                    ).then((m) => m.PrimeBlocksModule),
            },
            {
                path: 'ecommerce',
                data: { breadcrumb: 'E-Commerce' },
                loadChildren: () =>
                    import('./demo/components/ecommerce/ecommerce.module').then(
                        (m) => m.EcommerceModule
                    ),
            },
            {
                path: 'apps',
                data: { breadcrumb: 'Apps' },
                loadChildren: () =>
                    import('./demo/components/apps/apps.module').then(
                        (m) => m.AppsModule
                    ),
            },
        ],
    },
    {
        path: 'auth',
        data: { breadcrumb: 'Auth' },
        children: [
            {
                path: 'login',
                loadChildren: () =>
                    import('./features/auth/login/login.module').then(
                        (m) => m.LoginModule
                    ),
            },
        ],
    },
    {
        path: 'landing',
        loadChildren: () =>
            import('./demo/components/landing/landing.module').then(
                (m) => m.LandingModule
            ),
    },
    {
        path: 'notfound',
        loadChildren: () =>
            import('./demo/components/notfound/notfound.module').then(
                (m) => m.NotfoundModule
            ),
    },
    { path: '**', redirectTo: '/notfound' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
