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

@NgModule({
    declarations: [AppComponent],
    imports: [AppRoutingModule, AppLayoutModule, AuthConfigModule],
    providers: [
        provideHttpClient(
            withInterceptors([
                apiInterceptor,
                errorInterceptor,
                tokenInterceptor,
            ])
        ),
        { provide: AbstractSecurityStorage, useClass: MyStorageService },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
