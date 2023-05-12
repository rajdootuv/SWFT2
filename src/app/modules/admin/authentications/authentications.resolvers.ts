import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationService } from './authentications.service';
import {
    Visitors,
    AuthenticationPagination,
    AuthenticationVendor,
    Visits,
    Customers,
    Selectoptions,
    TagsList,
    Users,
    Designations,
} from './authentications.types';
import { designationMaster } from './designation/adddetails/adddetails';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationVisitorResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _inventoryService: AuthenticationService,
        private _router: Router
    ) {}

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
    ): Observable<Visitors> {
        return this._inventoryService
            .getVisitorById(Number(route.paramMap.get('id')))
            .pipe(
                // Error here means the requested visitor is not available
                catchError((error) => {
                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url
                        .split('/')
                        .slice(0, -1)
                        .join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationVisitorsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService) {}

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
        pagination: AuthenticationPagination;
        visitors: Visitors[];
    }> {
        return this._inventoryService.getVisitors();
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationVisitsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService) {}

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
    ): Observable<{ pagination: AuthenticationPagination; visits: Visits[] }> {
        return this._inventoryService.getVisits(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
        );
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationVendorsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService) {}

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
    ): Observable<AuthenticationVendor[]> {
        return this._inventoryService.getVendors();
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationUsersResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService) {}

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
    ): Observable<{ pagination: AuthenticationPagination; users: Users[] }> {
        return this._inventoryService.getUsers();
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationCustomersResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService) {}

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
        pagination: AuthenticationPagination;
        customers: Customers[];
    }> {
        return this._inventoryService.getCustomers();
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationSelectoptionsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService) {}

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
        pagination: AuthenticationPagination;
        selectoptions: Selectoptions[];
    }> {
        return this._inventoryService.getSelectoptions();
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationTaglistsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService) {}

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
        pagination: AuthenticationPagination;
        taglists: TagsList[];
    }> {
        return this._inventoryService.gettagsList();
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationDesignationResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: AuthenticationService) {}

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
        pagination: AuthenticationPagination;
        designations: Designations[];
    }> {
        return this._inventoryService.getDesignations(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
        );
    }
}
