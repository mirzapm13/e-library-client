import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { AuthConfigModule } from './auth/auth-config.module';
import { AbstractSecurityStorage } from 'angular-auth-oidc-client';
import { MyStorageService } from './auth/auth-custom-storage';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        AuthConfigModule,
        ToastModule,
        ConfirmDialogModule,
    ],
    providers: [
        provideHttpClient(
            withInterceptors([
                errorInterceptor,
                tokenInterceptor,
                apiInterceptor,
            ])
        ),
        { provide: AbstractSecurityStorage, useClass: MyStorageService },
        MessageService,
        ConfirmationService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
