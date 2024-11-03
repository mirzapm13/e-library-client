import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    let url = req.url[0] == '/' ? `http://localhost:3000${req.url}` : req.url;

    // const apiReq = req.clone({ url: `http://localhost:3000${req.url}` });
    const apiReq = req.clone({ url });

    return next(apiReq);
};
