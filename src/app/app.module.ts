import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { AuthModule } from './demo/components/auth/auth.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { EMPTY } from 'rxjs';
import { JwtService } from './core/auth/services/jwt.service';
import { AuthService } from './core/auth/services/auth.service';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { AuthConfigModule } from './auth/auth-config.module';

export function initAuth(jwtService: JwtService, authService: AuthService) {
    return () => (jwtService.getToken() ? authService.getCurrentUser() : EMPTY);
}

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
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
