import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    floors as floorsData, 
} from 'app/mock-api/apps/floors/data';

@Injectable({
    providedIn: 'root',
})
export class FloorsMockApi {
    private _floors: any[] = floorsData; 

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
            .onGet('api/apps/floors/floors', 300)
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the floors
                let floors: any[] | null = cloneDeep(this._floors);

                // Sort the floors
                if (
                    sort === 'NAME' ||
                    sort === 'LOCATION' ||
                    sort === 'LENGTH' ||
                    sort === 'WIDTH' ||
                    sort === 'ID' ||
                    sort === 'HEIGHT'  
                ) {
                    floors.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    floors.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the floors
                    floors = floors.filter((data) => {
                        if (
                            data.NAME.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.LOCATION.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.LENGTH.toString().toString()
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            data.WIDTH.toString().toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            (data.HEIGHT != undefined && data.HEIGHT.toString().toLowerCase().includes(
                                search.toLowerCase()
                            ))
                        ) {
                            return true;
                        }
                    });
                }

                // Paginate - Start
                const floorsLength = floors.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), floorsLength);
                const lastPage = Math.max(Math.ceil(floorsLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // floors but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    floors = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    floors = floors.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: floorsLength,
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
                        floors,
                        pagination,
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/floors/visitor')
            .reply(({ request }) => {
                // Get the id from the params
                const id = request.params.get('ID');

                // Clone the floors
                const floors = cloneDeep(this._floors);

                // Find the visitor
                const visitor = floors.find((item) => item.id === id);

                // Return the response
                return [200, visitor];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/floors/visitor')
            .reply(({ request }) => {
                const visitor = cloneDeep(request.body.visitor);
                // Unshift the new visitor
                const maxId = this._floors.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._floors[0].ID
                );
                visitor.ID = maxId + 1;
                this._floors.unshift(visitor);

                // Return the response
                return [200, visitor];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/floors/visitor')
            .reply(({ request }) => {
                // Get the id and visitor
                const id = request.body.ID;
                const visitor = cloneDeep(request.body.visitor); 
                // Prepare the updated visitor
                let updatedProduct = visitor;

                // Find the visitor and update it
                this._floors.forEach((item, index, floors) => {
                    if (item.ID === id) {
                        // Update the visitor
                        floors[index] = assign({}, floors[index], visitor);

                        // Store the updated visitor
                        updatedProduct = floors[index];
                    }
                     
                });
                // Return the response
                return [200, updatedProduct];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/floors/visitor')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the visitor and delete it
                this._floors.forEach((item, index) => {
                    if (item.ID === id) {
                        this._floors.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });

  
    }
}
