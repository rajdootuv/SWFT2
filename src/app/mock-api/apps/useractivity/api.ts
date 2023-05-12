import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    useractivity as useractivityData,
  
} from 'app/mock-api/apps/useractivity/data';

@Injectable({
    providedIn: 'root',
})
export class UseractivityMockApi {
    private _useractivity: any[] = useractivityData;

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
            .onGet('api/apps/useractivity/useractivity')
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the useractivity
                let useractivity: any[] | null = cloneDeep(this._useractivity);
                console.log('useractivity',useractivity);

                // Sort the useractivity
                if (
                    sort === 'NAME' ||
                    sort === 'IS_ACTIVE'
                ) {
                    useractivity.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    useractivity.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the designations
                    useractivity = useractivity.filter((data) => {
                        if (
                            data.NAME.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });
                console.log('useractivity',useractivity);

                }

                // Paginate - Start
                const useractivityLength =useractivity.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), useractivityLength);
                const lastPage = Math.max(Math.ceil(useractivityLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // visitors but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    useractivity = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    useractivity = useractivity.slice(begin, end);
                    console.log('useractivity',useractivity);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: useractivityLength,
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
                        useractivity,
                        pagination,
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - GET
        // -----------------------------------------------------------------------------------------------------
        // this._fuseMockApiService
        //     .onGet('api/apps/designation/designations')
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
    //     this._fuseMockApiService
    //         .onDelete('api/apps/designation/designations')
    //         .reply(({ request }) => {
    //             // Get the id
    //             const id = request.params.get('id');

    //             // Find the visitor and delete it
    //             this._designation.forEach((item, index) => {
    //                 if (item.ID === id) {
    //                     this._designation.splice(index, 1);
    //                 }
    //             });

    //             // Return the response
    //             return [200, true];
    //         });


     }
}
