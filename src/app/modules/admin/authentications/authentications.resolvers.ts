import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationService } from './authentications.service';
import {  Visitors, AuthenticationPagination,  AuthenticationVendor, Visits } from './authentications.types';
 
 

@Injectable({
    providedIn: 'root'
})
export class AuthenticationVisitorResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _inventoryService: AuthenticationService,
        private _router: Router
    )
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Visitors>
    {
        return this._inventoryService.getVisitorById(Number(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested visitor is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationVisitorsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: AuthenticationPagination; visitors: Visitors[] }>
    {
        return this._inventoryService.getVisitors();
    }
}


@Injectable({
    providedIn: 'root'
})
export class AuthenticationVisitsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: AuthenticationPagination; visits: Visits[] }>
    {
        return this._inventoryService.getVisits(undefined,undefined,undefined,undefined,undefined,undefined);
    }
}
 

@Injectable({
    providedIn: 'root'
})
export class AuthenticationVendorsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AuthenticationVendor[]>
    {
        return this._inventoryService.getVendors();
    }
}
