import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import {
    AuthenticationPagination,
    Visitors,
    AuthenticationVendor,
    Visits,
    Customers,
    Users,
    Talents,
    TagsList,
    Selectoptions,
    Designations,
} from 'app/modules/admin/authentications/authentications.types';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    // Private
    private _pagination: BehaviorSubject<AuthenticationPagination | null> =
        new BehaviorSubject(null);
    private _visitor: BehaviorSubject<Visitors | null> = new BehaviorSubject(
        null
    );
    private _visitors: BehaviorSubject<Visitors[] | null> = new BehaviorSubject(
        null
    );
    private _designations: BehaviorSubject<Designations[] | null> = new BehaviorSubject(
        null
    );
    private _vendors: BehaviorSubject<AuthenticationVendor[] | null> =
        new BehaviorSubject(null);
    private _visits: BehaviorSubject<Visits[] | null> = new BehaviorSubject(
        null
    );
    private _user: BehaviorSubject<Users | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);
    private _customer: BehaviorSubject<Customers | null> = new BehaviorSubject(
        null
    );
    private _customers: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    private _selectoption: BehaviorSubject<Selectoptions | null> =
        new BehaviorSubject(null);
    private _selectoptions: BehaviorSubject<Selectoptions[] | null> =
        new BehaviorSubject(null);
    private _talents: BehaviorSubject<Talents[] | null> = new BehaviorSubject(
        null
    );

    private _taglist: BehaviorSubject<TagsList | null> = new BehaviorSubject(
        null
    );
    private _taglists: BehaviorSubject<TagsList[] | null> = new BehaviorSubject(
        null
    );

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<AuthenticationPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for visitor
     */
    get visitor$(): Observable<Visitors> {
        return this._visitor.asObservable();
    }

    /**
     * Getter for visitors
     */
    get visitors$(): Observable<Visitors[]> {
        return this._visitors.asObservable();
    }

    /**
     * Getter for designations
     */
    get designations$(): Observable<Designations[]> {
        return this._designations.asObservable();
    }

    /**
     * Getter for visitors
     */
    get visits$(): Observable<Visits[]> {
        return this._visits.asObservable();
    }

    /**
     * Getter for vendors
     */
    get vendors$(): Observable<AuthenticationVendor[]> {
        return this._vendors.asObservable();
    }

    get user$(): Observable<Users> {
        return this._user.asObservable();
    }

    get customer$(): Observable<Customers> {
        return this._customer.asObservable();
    }

    get selectoption$(): Observable<Selectoptions> {
        return this._selectoption.asObservable();
    }
    get customers$(): Observable<Customers[]> {
        return this._customers.asObservable();
    }

    get users$(): Observable<Users[]> {
        return this._users.asObservable();
    }

    get selectoptions$(): Observable<Selectoptions[]> {
        return this._selectoptions.asObservable();
    }
    get taglists$(): Observable<TagsList[]> {
        return this._taglists.asObservable();
    }
    get taglist$(): Observable<TagsList> {
        return this._taglist.asObservable();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get visits
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getVisits(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = '',
        filter: any
    ): Observable<{ pagination: AuthenticationPagination; visits: Visits[] }> {
        return this._httpClient
            .get<{ pagination: AuthenticationPagination; visits: Visits[] }>(
                'api/apps/visitors/visits',
                {
                    params: {
                        page: '' + page,
                        size: '' + size,
                        sort,
                        order,
                        search,
                        filter,
                    },
                }
            )
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._visits.next(response.visits);
                })
            );
    }

    /**
     * Get visitors
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getVisitors(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: AuthenticationPagination;
        visitors: Visitors[];
    }> {
        return this._httpClient
            .get<{
                pagination: AuthenticationPagination;
                visitors: Visitors[];
            }>('api/apps/visitors/visitors', {
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
                    this._visitors.next(response.visitors);
                })
            );
    }

    /**
     * Get visitor by id
     */
    getVisitorById(id: number): Observable<Visitors> {
        return this._visitors.pipe(
            take(1),
            map((visitors) => {
                // Find the visitor
                const visitor = visitors.find((item) => item.ID === id) || null;

                // Update the visitor
                this._visitor.next(visitor);

                // Return the visitor
                return visitor;
            }),
            switchMap((visitor) => {
                if (!visitor) {
                    return throwError(
                        'Could not found visitor with id of ' + id + '!'
                    );
                }

                return of(visitor);
            })
        );
    }

    /**
     * Create visitor
     */
    createVisitor(visitor: Visitors): Observable<Visitors> {
        return this.visitors$.pipe(
            take(1),
            switchMap((visitors) =>
                this._httpClient
                    .post<Visitors>('api/apps/visitors/visitor', { visitor })
                    .pipe(
                        map((newVisitor) => {
                            // Update the visitors with the new visitor
                            this._visitors.next([newVisitor, ...visitors]);

                            // Return the new visitor
                            return newVisitor;
                        })
                    )
            )
        );
    }

    /**
     * Update visitor
     *
     * @param id
     * @param visitor
     */
    updateVisitor(id: number, visitor: Visitors): Observable<Visitors> {
        return this.visitors$.pipe(
            take(1),
            switchMap((visitors) =>
                this._httpClient
                    .patch<Visitors>('api/apps/visitors/visitor', {
                        id,
                        visitor,
                    })
                    .pipe(
                        map((updatedVisitor) => {
                            // Update the visitors
                            this._visitors.next(visitors);

                            // Return the updated visitor
                            return updatedVisitor;
                        })
                    )
            )
        );
    }

    /**
     * Delete the visitor
     *
     * @param id
     */
    deleteVisitor(id: number): Observable<boolean> {
        return this.visitors$.pipe(
            take(1),
            switchMap((visitors) =>
                this._httpClient
                    .delete('api/apps/visitors/visitor', { params: { id } })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted visitor
                            const index = visitors.findIndex(
                                (item) => item.ID === id
                            );

                            // Delete the visitor
                            visitors.splice(index, 1);

                            // Update the visitors
                            this._visitors.next(visitors);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    /**
     * Get vendors
     */
    getVendors(): Observable<AuthenticationVendor[]> {
        return this._httpClient
            .get<AuthenticationVendor[]>('api/apps/visitors/vendors')
            .pipe(
                tap((vendors) => {
                    this._vendors.next(vendors);
                })
            );
    }

    getSelectOptions(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: AuthenticationPagination;
        selectoptions: Selectoptions[];
    }> {
        return this._httpClient
            .get<{
                pagination: AuthenticationPagination;
                selectoptions: Selectoptions[];
            }>('api/apps/selectoptions/selectoptions', {
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
                    this._selectoptions.next(response.selectoptions);
                })
            );
    }

    updateSelectOptions(
        id: number,
        user: Selectoptions
    ): Observable<Selectoptions> {
        return this.selectoptions$.pipe(
            take(1),
            switchMap((selectoptions) =>
                this._httpClient
                    .patch<Selectoptions>(
                        'api/apps/selectoptions/selectoption',
                        {
                            id,
                            user,
                        }
                    )
                    .pipe(
                        map((updatedOption) => {
                            // Update the visitors
                            this._selectoptions.next(selectoptions);

                            // Return the updated visitor
                            return updatedOption;
                        })
                    )
            )
        );
    }

    deleteOptions(id: any): Observable<boolean> {
        return this.selectoptions$.pipe(
            take(1),
            switchMap((selectoptions) =>
                this._httpClient
                    .delete('api/apps/customers/customer', { params: { id } })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted visitor
                            const index = selectoptions.findIndex(
                                (item) => item.ID === id
                            );

                            // Delete the visitor
                            selectoptions.splice(index, 1);

                            // Update the visitors
                            this._selectoptions.next(selectoptions);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    createOptions(selectoptions: Selectoptions): Observable<Selectoptions> {
        return this.selectoptions$.pipe(
            take(1),
            switchMap((selectoptions) =>
                this._httpClient
                    .post<Selectoptions>(
                        'api/apps/selectoptions/selectoption',
                        { selectoptions }
                    )
                    .pipe(
                        map((newOptions) => {
                            // Update the visitors with the new visitor
                            this._selectoptions.next([
                                newOptions,
                                ...selectoptions,
                            ]);

                            // Return the new visitor
                            return newOptions;
                        })
                    )
            )
        );
    }

    //////services for talent/////////////
    get talents$(): Observable<Talents[]> {
        return this._talents.asObservable();
    }

    updateTalent(id: number, talent: Talents): Observable<Talents> {
        return this.talents$.pipe(
            take(1),
            switchMap((talents) =>
                this._httpClient
                    .patch<Talents>('api/apps/talents/talents', {
                        id,
                        talent,
                    })
                    .pipe(
                        map((updatedTalent) => {
                            // Update the visitors
                            this._talents.next(talents);

                            // Return the updated visitor
                            return updatedTalent;
                        })
                    )
            )
        );
    }

    getTalents(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: AuthenticationPagination;
        talents: Talents[];
    }> {
        return this._httpClient
            .get<{ pagination: AuthenticationPagination; talents: Talents[] }>(
                'api/apps/talents/talents',
                {
                    params: {
                        page: '' + page,
                        size: '' + size,
                        sort,
                        order,
                        search,
                    },
                }
            )
            .pipe(
                tap((response) => {
                    console.log(response);

                    this._pagination.next(response.pagination);
                    this._talents.next(response.talents);
                })
            );
    }

    createTalent(talent: Talents): Observable<Talents> {
        return this.talents$.pipe(
            take(1),
            switchMap((talents) =>
                this._httpClient
                    .post<Talents>('api/apps/talents/talents', { talent })
                    .pipe(
                        map((newTalent) => {
                            // Update the visitors with the new visitor
                            this._talents.next([newTalent, ...talents]);

                            // Return the new visitor
                            return newTalent;
                        })
                    )
            )
        );
    }

    // get user

    getUsers(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: AuthenticationPagination; users: Users[] }> {
        return this._httpClient
            .get<{ pagination: AuthenticationPagination; users: Users[] }>(
                'api/apps/users/users',
                {
                    params: {
                        page: '' + page,
                        size: '' + size,
                        sort,
                        order,
                        search,
                    },
                }
            )
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._users.next(response.users);
                })
            );
    }

    /**
     * Create Users
     */
    createUser(user: Users): Observable<Users> {
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._httpClient
                    .post<Users>('api/apps/users/user', { user })
                    .pipe(
                        map((newUser) => {
                            // Update the visitors with the new visitor
                            this._users.next([newUser, ...users]);

                            // Return the new visitor
                            return newUser;
                        })
                    )
            )
        );
    }

    updateUser(id: number, user: Users): Observable<Users> {
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._httpClient
                    .patch<Users>('api/apps/users/user', {
                        id,
                        user,
                    })
                    .pipe(
                        map((updatedUser) => {
                            // Update the visitors
                            this._users.next(users);

                            // Return the updated visitor
                            return updatedUser;
                        })
                    )
            )
        );
    }

    deleteUser(id: number): Observable<boolean> {
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._httpClient
                    .delete('api/apps/users/user', { params: { id } })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted visitor
                            const index = users.findIndex(
                                (item) => item.ID === id
                            );

                            // Delete the visitor
                            users.splice(index, 1);

                            // Update the visitors
                            this._users.next(users);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    getCustomers(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: AuthenticationPagination;
        customers: Customers[];
    }> {
        return this._httpClient
            .get<{
                pagination: AuthenticationPagination;
                customers: Customers[];
            }>('api/apps/customers/customers', {
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
                    this._customers.next(response.customers);
                })
            );
    }

    updateCustomer(id: number, user: Customers): Observable<Customers> {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) =>
                this._httpClient
                    .patch<Customers>('api/apps/customers/customer', {
                        id,
                        user,
                    })
                    .pipe(
                        map((updatedCustomer) => {
                            // Update the visitors
                            this._customers.next(customers);

                            // Return the updated visitor
                            return updatedCustomer;
                        })
                    )
            )
        );
    }

    deleteCustomer(id: number): Observable<boolean> {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) =>
                this._httpClient
                    .delete('api/apps/customers/customer', { params: { id } })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted visitor
                            const index = customers.findIndex(
                                (item) => item.ID === id
                            );

                            // Delete the visitor
                            customers.splice(index, 1);

                            // Update the visitors
                            this._customers.next(customers);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    createCustomer(customer: Customers): Observable<Customers> {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) =>
                this._httpClient
                    .post<Customers>('api/apps/customers/customer', {
                        customer,
                    })
                    .pipe(
                        map((newCustomer) => {
                            // Update the visitors with the new visitor
                            this._customers.next([newCustomer, ...customers]);

                            // Return the new visitor
                            return newCustomer;
                        })
                    )
            )
        );
    }

    // get user

    getSelectoptions(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: AuthenticationPagination;
        selectoptions: Selectoptions[];
    }> {
        return this._httpClient
            .get<{
                pagination: AuthenticationPagination;
                selectoptions: Selectoptions[];
            }>('api/apps/selectoptions/selectoptions', {
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
                    this._selectoptions.next(response.selectoptions);
                })
            );
    }

    /**
     * Create Users
     */
    createSelectoption(selectoption: Selectoptions): Observable<Selectoptions> {
        return this.selectoptions$.pipe(
            take(1),
            switchMap((selectoptions) =>
                this._httpClient
                    .post<Selectoptions>(
                        'api/apps/selectoptions/selectoption',
                        { selectoption }
                    )
                    .pipe(
                        map((newUser) => {
                            // Update the visitors with the new visitor
                            this._selectoptions.next([
                                newUser,
                                ...selectoptions,
                            ]);

                            // Return the new visitor
                            return newUser;
                        })
                    )
            )
        );
    }

    updateSelectoption(
        id: number,
        selectoption: Selectoptions
    ): Observable<Selectoptions> {
        return this.selectoptions$.pipe(
            take(1),
            switchMap((selectoptions) =>
                this._httpClient
                    .patch<Selectoptions>(
                        'api/apps/selectoptions/selectoption',
                        {
                            id,
                            selectoption,
                        }
                    )
                    .pipe(
                        map((updateSelectoption) => {
                            // Update the visitors
                            this._selectoptions.next(selectoptions);

                            // Return the updated visitor
                            return updateSelectoption;
                        })
                    )
            )
        );
    }

    deleteSelectoption(id: number): Observable<boolean> {
        return this.selectoptions$.pipe(
            take(1),
            switchMap((selectoptions) =>
                this._httpClient
                    .delete('api/apps/selectoptions/selectoption', {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted visitor
                            const index = selectoptions.findIndex(
                                (item) => item.ID === id
                            );

                            // Delete the visitor
                            selectoptions.splice(index, 1);

                            // Update the visitors
                            this._selectoptions.next(selectoptions);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    createTagslist(taglist: TagsList): Observable<TagsList> {
        return this.taglists$.pipe(
            take(1),
            switchMap((taglists) =>
                this._httpClient
                    .post<TagsList>('api/apps/taglists/taglist', { taglist })
                    .pipe(
                        map((newUser) => {
                            // Update the visitors with the new visitor
                            this._taglists.next([newUser, ...taglists]);

                            // Return the new visitor
                            return newUser;
                        })
                    )
            )
        );
    }

    deleteTaglist(id: number): Observable<boolean> {
        return this.taglists$.pipe(
            take(1),
            switchMap((taglists) =>
                this._httpClient
                    .delete('api/apps/taglists/taglist', { params: { id } })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted visitor
                            const index = taglists.findIndex(
                                (item) => item.ID === id
                            );

                            // Delete the visitor
                            taglists.splice(index, 1);

                            // Update the visitors
                            this._taglists.next(taglists);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    gettagsList(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: AuthenticationPagination;
        taglists: TagsList[];
    }> {
        return this._httpClient
            .get<{
                pagination: AuthenticationPagination;
                taglists: TagsList[];
            }>('api/apps/taglists/taglists', {
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
                    this._taglists.next(response.taglists);
                })
            );
    }

    /**
     * Get designations
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getDesignations(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: AuthenticationPagination;
        designations: Designations[];
    }> {
        return this._httpClient
            .get<{
                pagination: AuthenticationPagination;
                designations: Designations[];
            }>('api/apps/designations/designations', {
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
                    this._designations.next(response.designations);
                })
            );
    }



    /**
     * Create designation
     */
    createDesignation(designation: Designations): Observable<Designations> {
        return this.designations$.pipe(
            take(1),
            switchMap((designations) =>
                this._httpClient
                    .post<Designations>('api/apps/designations/designation', { designation })
                    .pipe(
                        map((newDesignation) => {
                            // Update the designations with the new designation
                            this._designations.next([newDesignation, ...designations]);

                            // Return the new designation
                            return newDesignation;
                        })
                    )
            )
        );
    }

    /**
     * Update designation
     *
     * @param id
     * @param designation
     */
    updateDesignation(id: number, designation: Designations): Observable<Designations> {
        return this.designations$.pipe(
            take(1),
            switchMap((designations) =>
                this._httpClient
                    .patch<Designations>('api/apps/designations/designation', {
                        id,
                        designation,
                    })
                    .pipe(
                        map((updatedDesignation) => {
                            // Update the designations
                            this._designations.next(designations);

                            // Return the updated designation
                            return updatedDesignation;
                        })
                    )
            )
        );
    }

    /**
     * Delete the designation
     *
     * @param id
     */
    deleteDesignation(id: number): Observable<boolean> {
        return this.designations$.pipe(
            take(1),
            switchMap((designations) =>
                this._httpClient
                    .delete('api/apps/designations/designation', { params: { id } })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted designation
                            const index = designations.findIndex(
                                (item) => item.ID === id
                            );

                            // Delete the designation
                            designations.splice(index, 1);

                            // Update the designations
                            this._designations.next(designations);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }
}
