import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginService } from './loginactivity.service';
import {
    ActiveUsers,
    loginactivitydata,
    loginActivityPagination,
} from './loginativity.type';
// import { LoginService } from './organizationlist.service';
// import { loginactivitydata, loginActivityPagination } from './organizationlist.types';

@Injectable({
    providedIn: 'root',
})
@Injectable({
    providedIn: 'root',
})
export class LoginActivityResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: LoginService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<{
        pagination: loginActivityPagination;
        organization: loginactivitydata[];
    }> {
        return this._inventoryService.getOrganization();
    }
}

@Injectable({
    providedIn: 'root',
})
export class ActiveResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: LoginService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<{
        pagination: loginActivityPagination;
        activeUsers: ActiveUsers[];
    }> {
        return this._inventoryService.getActiveUsers();
    }
}
