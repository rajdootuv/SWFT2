import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    visitors as visitorsData,
    vendors as vendorsData,
    visits as visitsData,
} from 'app/mock-api/apps/visitors/data';

@Injectable({
    providedIn: 'root',
})
export class VisitorsMockApi {
    private _visitors: any[] = visitorsData;
    private _vendors: any[] = vendorsData;
    private _visits: any[] = visitsData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Products - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/visitors/visitors', 300)
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the visitors
                let visitors: any[] | null = cloneDeep(this._visitors);

                // Sort the visitors
                if (
                    sort === 'NAME' ||
                    sort === 'EMAIL_ID' ||
                    sort === 'COMPANY_NAME' ||
                    sort === 'DESIGNATION' ||
                    sort === 'ID' ||
                    sort === 'MOBILE_NO' ||
                    sort === 'ACTIVE'
                ) {
                    visitors.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    visitors.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the visitors
                    visitors = visitors.filter((data) => {
                        if (
                            data.NAME.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.EMAIL_ID.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.MOBILE_NO.toString()
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            data.DESIGNATION.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.COMPANY_NAME.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });
                }

                // Paginate - Start
                const visitorsLength = visitors.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), visitorsLength);
                const lastPage = Math.max(Math.ceil(visitorsLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // visitors but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    visitors = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    visitors = visitors.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: visitorsLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                // Return the response
                return [
                    200,
                    {
                        visitors,
                        pagination,
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/visitors/visitor')
            .reply(({ request }) => {
                // Get the id from the params
                const id = request.params.get('ID');

                // Clone the visitors
                const visitors = cloneDeep(this._visitors);

                // Find the visitor
                const visitor = visitors.find((item) => item.id === id);

                // Return the response
                return [200, visitor];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/visitors/visitor')
            .reply(({ request }) => {
                const visitor = cloneDeep(request.body.visitor);
                // Unshift the new visitor
                const maxId = this._visitors.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._visitors[0].ID
                );
                visitor.ID = maxId + 1;
                this._visitors.unshift(visitor);

                // Return the response
                return [200, visitor];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/visitors/visitor')
            .reply(({ request }) => {
                // Get the id and visitor
                const id = request.body.ID;
                const visitor = cloneDeep(request.body.visitor); 
                // Prepare the updated visitor
                let updatedProduct = visitor;

                // Find the visitor and update it
                this._visitors.forEach((item, index, visitors) => {
                    if (item.ID === id) {
                        // Update the visitor
                        visitors[index] = assign({}, visitors[index], visitor);

                        // Store the updated visitor
                        updatedProduct = visitors[index];
                    }
                     
                });
                // Return the response
                return [200, updatedProduct];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/visitors/visitor')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the visitor and delete it
                this._visitors.forEach((item, index) => {
                    if (item.ID === id) {
                        this._visitors.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Vendors - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/visitors/vendors')
            .reply(() => [200, cloneDeep(this._vendors)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Visits - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/visitors/visits')
            .reply(({ request }) => {
                // Get available queries

                const search = request.params.get('search');
                const filter = request.params.get('filter');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the visits
                let visits: any[] | null = cloneDeep(this._visits);

                // Sort the visits
                if (
                    sort === 'NAME' ||
                    sort === 'PURPOSE_OF_VISIT' ||
                    sort === 'DATE_OF_VISIT' ||
                    sort === 'DURATION_OF_VISIT' ||
                    sort === 'MEETING_WITH_NAME'
                ) {
                    visits.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    visits.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                if (filter != 'undefined' && filter != 'null' && filter != '') {
                    // Filter the visits

                    visits = visits.filter((data) => data.VISITOR_ID == filter);
                }
                // If search exists...

                if (search != 'undefined' && search != 'null' && search != '') {
                    // Filter the visits
                    visits = visits.filter((data) => {
                        if (
                            data.NAME.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.PURPOSE_OF_VISIT.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.DATE_OF_VISIT.toString()
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            data.DURATION_OF_VISIT.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.MEETING_WITH_NAME.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });
                }

                // Paginate - Start
                const visitsLength = visits.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), visitsLength);
                const lastPage = Math.max(Math.ceil(visitsLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // visits but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    visits = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    visits = visits.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: visitsLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }
                console.log(visits, 'visits');
                // Return the response
                return [
                    200,
                    {
                        visits,
                        pagination,
                    },
                ];
            });
    }
}
