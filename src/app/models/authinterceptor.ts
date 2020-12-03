import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenStorageService } from '../services/token-storage.service';

const TOKEN_HEADER = 'Authorization';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private token: TokenStorageService){

    }

    intercept(request: HttpRequest<any>, next: HttpHandler){
        let authRequest = request;
        const token = this.token.getToken();
        if (token != null){
            authRequest = request.clone({headers: request.headers.set(TOKEN_HEADER,
                                                                    'Bearer ' + token)});
        }
        return next.handle(authRequest);
    }
}
export const authInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];