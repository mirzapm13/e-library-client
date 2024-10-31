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
import { UserService } from './core/auth/services/user.service';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export function initAuth(jwtService: JwtService, userService: UserService) {
    return () => (jwtService.getToken() ? userService.getCurrentUser() : EMPTY);
}

@NgModule({
    declarations: [AppComponent],
    imports: [AppRoutingModule, AppLayoutModule, AuthModule],
    providers: [
        provideHttpClient(
            withInterceptors([
                apiInterceptor,
                errorInterceptor,
                tokenInterceptor,
            ])
        ),
        {
            provide: APP_INITIALIZER,
            useFactory: initAuth,
            deps: [JwtService, UserService],
            multi: true,
        },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
