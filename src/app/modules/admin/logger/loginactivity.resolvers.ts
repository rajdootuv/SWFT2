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
    EventLogs,
    loginactivitydata,
    loginActivityPagination,
    StudioLogs,
} from './loginativity.type';
import { SetupPagination } from '../setup/setup.types';
import { useractivityMaster } from './user-activity/user-activity';
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

@Injectable({
    providedIn: 'root',
})
export class SetupEventResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _api: LoginService) {}

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
    ): Observable<{ pagination: SetupPagination; events: EventLogs[] }> {
        return this._api.getEvent();
    }
}

//  STUDIO lOG

@Injectable({
    providedIn: 'root',
})
export class SetupStudioResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _api: LoginService) {}

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
    ): Observable<{ pagination: SetupPagination; studios: StudioLogs[] }> {
        return this._api.getStudio();
    }
}



@Injectable({
    providedIn: 'root'
})
export class AuthenticationUseractivityResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: LoginService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: SetupPagination;useractivity: useractivityMaster[] }>
    {
        return this._inventoryService.getUseractivity(undefined,undefined,undefined,undefined,undefined,undefined);
    }
}




