import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { SettingService } from './setting.service';
import { EmailSettingPagination ,EmailSettingData, Properties, SettingsPagination, smsPagination, smssetting, smtpsetting, whatsappPagination, whatsappsetting} from './setting.type';
@Injectable({
    providedIn: 'root',
})
export class EmailsettingResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: SettingService) {}

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
        pagination: EmailSettingPagination;
        emailsetting: EmailSettingData[];
    }> {
        return this._inventoryService.getemailsettingdata();
    }
}


@Injectable({
    providedIn: 'root'
})
export class AuthenticationPropertiesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: SettingService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: SettingsPagination; properties: Properties[] }>
    {
        return this._inventoryService.getProperties();
    }
}


@Injectable({
    providedIn: 'root'
})
export class AuthenticationSMTPResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: SettingService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: SettingsPagination; smtp: smtpsetting[] }>
    {
        return this._inventoryService.getSMTP();
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationSMSResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: SettingService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: smsPagination; sms: smssetting[] }>
    {
        return this._inventoryService.getSMS();
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationwpResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: SettingService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: whatsappPagination; whatsapp: whatsappsetting[] }>
    {
        return this._inventoryService.getWhatsapp();
    }
}