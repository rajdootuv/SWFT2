import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { properties as properties } from 'app/mock-api/apps/Properties/data';

@Injectable({
    providedIn: 'root',
})
export class PropertiesMockApi {
    private _prop: any[] = properties;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // GET
    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        //
        //
        this._fuseMockApiService
            .onGet('api/apps/Properties/properties', 300)
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'PROPERTY';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the properties
                let properties: any[] | null = cloneDeep(this._prop);

                // Sort the properties
                if (sort === 'PROPERTY' || sort === 'VALUE') {
                    properties.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();

                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    properties.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                    // console.log(this.fieldA+''+fieldB)
                }

                // If search exists...
                if (search) {
                    // Filter the properties

                    properties = properties.filter((data) => {
                        if (
                            data.PROPERTY.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.VALUE.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });
                }

                //

                // Paginate - Start
                const propertieslength = properties.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), propertieslength);
                const lastPage = Math.max(Math.ceil(propertieslength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // properties but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    properties = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    properties = properties.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: propertieslength,
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
                        properties,
                        pagination,
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/properties/message')
            .reply(({ request }) => {
                const property = cloneDeep(request.body.property);
                // Unshift the new floor
                const maxId = this._prop.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._prop[0].ID
                );
                property.ID = maxId + 1;
                this._prop.unshift(property);

                // Return the response
                return [200, property];
            });
        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------

        this._fuseMockApiService
            .onPatch('api/apps/properties/propertie')
            .reply(({ request }) => {
                // Get the id and properties
                const id = request.body.ID;
                const prop = cloneDeep(request.body.properties);
                // Prepare the updated properties
                let updatedProduct = prop;

                // Find the properties and update it
                this._prop.forEach((item, index, properties) => {
                    if (item.ID === id) {
                        // Update the properties
                        properties[index] = assign({}, properties[index], prop);

                        // Store the updated properties
                        updatedProduct = properties[index];
                    }
                });
                // Return the response
                return [200, updatedProduct];
            });
    }
}
