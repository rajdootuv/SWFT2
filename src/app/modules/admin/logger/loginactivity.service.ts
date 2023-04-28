import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject, 
    Observable, 
    tap 
} from 'rxjs';
import {
    ActiveUsers,
    loginactivitydata,
    loginActivityPagination,
} from './loginativity.type'; 

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(private _httpClient: HttpClient) {}

    private _organization: BehaviorSubject<loginactivitydata[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<loginActivityPagination | null> =
        new BehaviorSubject(null);
    private _activeUsers: BehaviorSubject<ActiveUsers[] | null> = new BehaviorSubject(
        null
    );

    /**
     * Getter for activeUsers
     */
    get activeUsers$(): Observable<ActiveUsers[]> {
        return this._activeUsers.asObservable();
    }
    /**
     * Getter for login activities
     */
    get organization$(): Observable<loginactivitydata[]> {
        return this._organization.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<loginActivityPagination> {
        return this._pagination.asObservable();
    }

    /////////login activities api methods////////
    getOrganization(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: loginActivityPagination;
        organization: loginactivitydata[];
    }> {
        return this._httpClient
            .get<{
                pagination: loginActivityPagination;
                organization: loginactivitydata[];
            }>('api/apps/login/loginactivity', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._organization.next(response.organization);
                })
            );
    }

    /////////Active  users api methods////////
    /**
     * Get Active  users
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getActiveUsers(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: loginActivityPagination;
        activeUsers: ActiveUsers[];
    }> {
        return this._httpClient
            .get<{
                pagination: loginActivityPagination;
                activeUsers: ActiveUsers[];
            }>('api/apps/active/users', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._activeUsers.next(response.activeUsers);
                })
            );
    }
}
