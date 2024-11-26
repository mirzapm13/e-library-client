import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    let url = req.url[0] == '/' ? `${environment.apiUrl}${req.url}` : req.url;

    // const apiReq = req.clone({ url: `http://localhost:3000${req.url}` });
    const apiReq = req.clone({ url });

    return next(apiReq);
};
