import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    designations,
    designations as designationsData,
  
} from 'app/mock-api/apps/designation/data';

@Injectable({
    providedIn: 'root',
})
export class DesignationMockApi {
    private _designation: any[] = designationsData;

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
        console.log('hh',this._fuseMockApiService)
        this._fuseMockApiService
            .onGet('api/apps/designations/designations')
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the designations
                let designation: any[] | null = cloneDeep(this._designation);
                console.log('designation',designation);

                // Sort the designations
                if (
                    sort === 'NAME' ||
                    sort === 'IS_ACTIVE'
                ) {
                    designation.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    designation.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the designations
                    designation = designation.filter((data) => {
                        if (
                            data.NAME.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });
                console.log('designation',designation);

                }

                // Paginate - Start
                const designationsLength = designation.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), designationsLength);
                const lastPage = Math.max(Math.ceil(designationsLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // visitors but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    designation = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    designation = designation.slice(begin, end);
                    console.log('designation',designation);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: designationsLength,
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
                        designations,
                        pagination,
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - GET
        // -----------------------------------------------------------------------------------------------------
        // this._fuseMockApiService
        //     .onGet('api/apps/designations/designations')
        //     .reply(({ request }) => {
        //         // Get the id from the params
        //         const id = request.params.get('ID');

        //         // Clone the visitors
        //         const designations = cloneDeep(this._designation);

              
        //          const designation = designations.find((item) => item.id === id);

        //         // Return the response
        //         return [200,designation];
        //     });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        // this._fuseMockApiService
        //     .onPost('api/apps/visitors/visitor')
        //     .reply(({ request }) => {
        //         const visitor = cloneDeep(request.body.visitor);
        //         // Unshift the new visitor
        //         const maxId = this._visitors.reduce(
        //             (max, character) =>
        //                 character.ID > max ? character.ID : max,
        //             this._visitors[0].ID
        //         );
        //         visitor.ID = maxId + 1;
        //         this._visitors.unshift(visitor);

        //         // Return the response
        //         return [200, visitor];
        //     });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        // this._fuseMockApiService
        //     .onPatch('api/apps/visitors/visitor')
        //     .reply(({ request }) => {
        //         // Get the id and visitor
        //         const id = request.body.ID;
        //         const visitor = cloneDeep(request.body.visitor); 
        //         // Prepare the updated visitor
        //         let updatedProduct = visitor;

        //         // Find the visitor and update it
        //         this._visitors.forEach((item, index, visitors) => {
        //             if (item.ID === id) {
        //                 // Update the visitor
        //                 visitors[index] = assign({}, visitors[index], visitor);

        //                 // Store the updated visitor
        //                 updatedProduct = visitors[index];
        //             }
                     
        //         });
        //         // Return the response
        //         return [200, updatedProduct];
        //     });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/designations/designations')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the visitor and delete it
                this._designation.forEach((item, index) => {
                    if (item.ID === id) {
                        this._designation.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Vendors - GET
        // -----------------------------------------------------------------------------------------------------


        // -----------------------------------------------------------------------------------------------------
        // @ Visits - GET
        // -----------------------------------------------------------------------------------------------------
     
    }
}
