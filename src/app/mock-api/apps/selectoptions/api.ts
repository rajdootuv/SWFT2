import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
// import {
//     users as usersData,
// } from 'app/mock-api/apps/users/data';

import {
    selectoptions as selectoptionsData,
} from 'app/mock-api/apps/selectoptions/data'

@Injectable({
    providedIn: 'root',
})
export class SelectoptionsMockApi {
    // private _users: any[] = usersData;
    private _selectoptions: any[] = selectoptionsData;


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
        .onGet('api/apps/selectoptions/selectoptions', 300)
        .reply(({ request }) => {
            // Get available queries
            const search = request.params.get('search');
            const sort = request.params.get('sort') || 'NAME';
            const order = request.params.get('order') || 'asc';
            const page = parseInt(request.params.get('page') ?? '1', 10);
            const size = parseInt(request.params.get('size') ?? '10', 10);

            // Clone the visitors
            let selectoptions: any[] | null = cloneDeep(this._selectoptions);

            // Sort the visitors
            if (
                sort === 'FIELD_ID' ||
                sort === 'VALUE' ||
                sort === 'HTML' ||
                sort === 'ID'
            ) {
                selectoptions.sort((a, b) => {
                    const fieldA = a[sort].toString().toUpperCase();
                    const fieldB = b[sort].toString().toUpperCase();
                    return order === 'asc'
                        ? fieldA.localeCompare(fieldB)
                        : fieldB.localeCompare(fieldA);
                });
            } else {
                selectoptions.sort((a, b) =>
                    order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                );
            }

            // If search exists...
            if (search) {
                // Filter the USER
                selectoptions = selectoptions.filter((data) => {
                    if (
                        data.FIELD_ID.toLowerCase().includes(
                            search.toLowerCase()
                        ) ||
                        data.VALUE.toLowerCase().includes(
                            search.toLowerCase()
                        ) ||
                        data.HTML.toString()
                            .toLowerCase()
                            .includes(search.toLowerCase())
                       
                    ) {
                        return true;
                    }
                });
            }

            // Paginate - Start
            const usersLength = selectoptions.length;

            // Calculate pagination details
            const begin = page * size;
            const end = Math.min(size * (page + 1), usersLength);
            const lastPage = Math.max(Math.ceil(usersLength / size), 1);

            // Prepare the pagination object
            let pagination = {};

            // If the requested page number is bigger than
            // the last possible page number, return null for
            // visitors but also send the last possible page so
            // the app can navigate to there
            if (page > lastPage) {
                selectoptions = null;
                pagination = {
                    lastPage,
                };
            } else {
                // Paginate the results by size
                selectoptions = selectoptions.slice(begin, end);

                // Prepare the pagination mock-api
                pagination = {
                    length: usersLength,
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
                    selectoptions,
                    pagination,
                },
            ];
        });




          // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/selectoptions/selectoption')
            .reply(({ request }) => {
                const selectoption = cloneDeep(request.body.selectoption);
                // Unshift the new visitor
                const maxId = this._selectoptions.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._selectoptions[0].ID
                );
                selectoption.ID = maxId + 1;
                this._selectoptions.unshift(selectoption);

                // Return the response
                return [200, selectoption];
            });
 





    // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/selectoptions/selectoption')
            .reply(({ request }) => {
                // Get the id and visitor
                const id = request.body.ID;
                const selectoption = cloneDeep(request.body.selectoption); 
                // Prepare the updated visitor
                let updatedProduct = selectoption;

                // Find the visitor and update it
                this._selectoptions.forEach((item, index, selectoptions) => {
                    if (item.ID === id) {
                        // Update the visitor
                        selectoptions[index] = assign({}, selectoptions[index], selectoptions);

                        // Store the updated visitor
                        updatedProduct = selectoptions[index];
                    }
                     
                });
                // Return the response
                return [200, updatedProduct];
            });

        
        
         // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/selectoptions/selectoption')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the visitor and delete it
                this._selectoptions.forEach((item, index) => {
                    if (item.ID === id) {
                        this._selectoptions.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });



        
        
        
        
        }
}
