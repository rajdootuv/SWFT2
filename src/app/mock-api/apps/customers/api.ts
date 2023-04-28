import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    customers as customersData,
} from 'app/mock-api/apps/customers/data';

@Injectable({
    providedIn: 'root',
})
export class CustomersMockApi {
    private _customers: any[] = customersData;

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
        .onGet('api/apps/customers/customers', 300)
        .reply(({ request }) => {
            // Get available queries
            const search = request.params.get('search');
            const sort = request.params.get('sort') || 'NAME';
            const order = request.params.get('order') || 'asc';
            const page = parseInt(request.params.get('page') ?? '1', 10);
            const size = parseInt(request.params.get('size') ?? '10', 10);

            // Clone the visitors
            let customers: any[] | null = cloneDeep(this._customers);

            // Sort the visitors
            if (
                sort === 'NAME' ||
                sort === 'EMAIL_ID' ||
                sort === 'MOBILE_NO' ||
                sort === 'DOB' ||
                sort === 'CITY' ||
                sort === 'ID'
            ) {
                customers.sort((a, b) => {
                    const fieldA = a[sort].toString().toUpperCase();
                    const fieldB = b[sort].toString().toUpperCase();
                    return order === 'asc'
                        ? fieldA.localeCompare(fieldB)
                        : fieldB.localeCompare(fieldA);
                });
            } else {
                customers.sort((a, b) =>
                    order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                );
            }

            // If search exists...
            if (search) {
                // Filter the USER
                customers = customers.filter((data) => {
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
                        data.DOB.toLowerCase().includes(
                            search.toLowerCase()
                        ) ||
                        data.CITY.toLowerCase().includes(
                            search.toLowerCase()
                        )
                    ) {
                        return true;
                    }
                });
            }

            // Paginate - Start
            const custmersLength = customers.length;

            // Calculate pagination details
            const begin = page * size;
            const end = Math.min(size * (page + 1), custmersLength);
            const lastPage = Math.max(Math.ceil(custmersLength / size), 1);

            // Prepare the pagination object
            let pagination = {};

            // If the requested page number is bigger than
            // the last possible page number, return null for
            // visitors but also send the last possible page so
            // the app can navigate to there
            if (page > lastPage) {
                customers = null;
                pagination = {
                    lastPage,
                };
            } else {
                // Paginate the results by size
                customers = customers.slice(begin, end);

                // Prepare the pagination mock-api
                pagination = {
                    length: custmersLength,
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
                    customers,
                    pagination,
                },
            ];
        });




          // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/customers/customer')
            .reply(({ request }) => {
                const customer = cloneDeep(request.body.customer);
                // Unshift the new visitor
                const maxId = this._customers.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._customers[0].ID
                );
                customer.ID = maxId + 1;
                this._customers.unshift(customer);

                // Return the response
                return [200, customer];
            });
 





    // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/customers/customer')
            .reply(({ request }) => {
                // Get the id and visitor
                const id = request.body.ID;
                const customer = cloneDeep(request.body.customer); 
                // Prepare the updated visitor
                let updatedProduct = customer;

                // Find the visitor and update it
                this._customers.forEach((item, index, customers) => {
                    if (item.ID === id) {
                        // Update the visitor
                        customers[index] = assign({}, customers[index], customer);

                        // Store the updated visitor
                        updatedProduct = customers[index];
                    }
                     
                });
                // Return the response
                return [200, updatedProduct];
            });

        
        
         // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/customers/customer')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the visitor and delete it
                this._customers.forEach((item, index) => {
                    if (item.ID === id) {
                        this._customers.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });



        
        
        
        
        }
}
