import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { SetupService } from './setup.service';
import {
    Bays,
    Floors,
    Language,
    LanguageTranslation,
    OrganizationData,
    SetupPagination,
    Theme,
    themePagination,
} from './setup.types';
import { Studio } from './setup.types';
import { AuthenticationPagination } from '../authentications/authentications.types';

@Injectable({
    providedIn: 'root',
})
export class SetupVisitorResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _api: SetupService, private _router: Router) {}

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
    ): Observable<Floors> {
        return this._api.getFloorById(Number(route.paramMap.get('id'))).pipe(
            // Error here means the requested floor is not available
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
    providedIn: 'root',
})
export class SetupFloorsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _api: SetupService) {}

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
    ): Observable<{ pagination: SetupPagination; floors: Floors[] }> {
        return this._api.getFloors();
    }
}

@Injectable({
    providedIn: 'root',
})
export class StudioResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: SetupService) {}

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
    ): Observable<{ pagination: SetupPagination; studio: Studio[] }> {
        return this._inventoryService.getstudio();
    }
}

// Languages Resolver

@Injectable({
    providedIn: 'root',
})
export class AuthenticationLaunguagesResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: SetupService) {}

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
        language: Language[];
    }> {
        return this._inventoryService.getLanguage();
    }
}

// Language Translation Resolver
@Injectable({
    providedIn: 'root',
})
export class AuthenticationLaunguagesTranslationResolver
    implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: SetupService) {}

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
        language: LanguageTranslation[];
    }> {
        return this._inventoryService.getLanguageTranslations();
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationBaysResolver implements Resolve<any> {
    /**
    
      * Constructor
    
      */

    constructor(
        private _inventoryService: SetupService
    ) {} /** // ----------------------------------------------------------------------------------------------------- // @ Public methods // -----------------------------------------------------------------------------------------------------
    
      * Resolver
    
      *
    
      * @param route
    
      * @param state
    
      */

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<{ pagination: AuthenticationPagination; bays: Bays[] }> {
        return this._inventoryService.getBays();
    }
}

@Injectable({
    providedIn: 'root',
})
export class ThemeResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _api: SetupService) {}

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
    ): Observable<{ pagination: themePagination; floors: Theme[] }> {
        return this._api.getTheme();
    }
}

@Injectable({
    providedIn: 'root',
})
export class OrganizationResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: SetupService) {}

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
        pagination: SetupPagination;
        organization: OrganizationData[];
    }> {
        return this._inventoryService.getOrganization();
    }
}
