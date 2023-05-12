import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { whatsapp as Whatsappdata } from 'app/mock-api/apps/whatsapp/data';

@Injectable({
    providedIn: 'root',
})
export class WhatsappMockApi {
    private _whatsapp: any[] = Whatsappdata;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        //
        // Whatsapp
        this._fuseMockApiService
            .onGet('api/apps/whatsapp/whatsapp', 300)
            .reply(({ request }) => {
                // Get available queries

                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the properties
                let whatsapp: any[] | null = cloneDeep(this._whatsapp);

                // Sort the properties
                if (
                    sort === 'NAME' ||
                    sort === 'BaseUrl' ||
                    sort === 'AuthenticationHeader' ||
                    sort === 'Method' ||
                    sort === 'Body'
                ) {
                    whatsapp.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    whatsapp.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the properties
                    whatsapp = whatsapp.filter((data) => {
                        if (
                            data.NAME.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.BaseUrl.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.AuthenticationHeader.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.Method.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.Body.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });
                }

                // Paginate - Start
                const propertiesLength = whatsapp.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), propertiesLength);
                const lastPage = Math.max(
                    Math.ceil(propertiesLength / size),
                    1
                );

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // properties but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    whatsapp = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    whatsapp = whatsapp.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: propertiesLength,
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
                        whatsapp,
                        pagination,
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/whatsapp/message')
            .reply(({ request }) => {
                const whatsapp = cloneDeep(request.body.whatsapp);
                // Unshift the new wp
                const maxId = this._whatsapp.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._whatsapp[0].ID
                );
                whatsapp.ID = maxId + 1;
                this._whatsapp.unshift(whatsapp);

                // Return the response
                return [200, whatsapp];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/whatsapp/message')
            .reply(({ request }) => {
                // Get the id and wp
                const id = request.body.ID;
                const whatsapp = cloneDeep(request.body.whatsapp);
                // Prepare the updated whatsapp
                let updatedProduct = whatsapp;

                // Find the whatsapp and update it
                this._whatsapp.forEach((item, index, messages) => {
                    if (item.ID === id) {
                        // Update the whatsapp
                        messages[index] = assign({}, messages[index], whatsapp);

                        // Store the updated whatsapp
                        updatedProduct = messages[index];
                    }
                });
                // Return the response
                return [200, updatedProduct];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/whatsapp/message')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the whatsapp and delete it
                this._whatsapp.forEach((item, index) => {
                    if (item.ID === id) {
                        this._whatsapp.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });
    }
}
