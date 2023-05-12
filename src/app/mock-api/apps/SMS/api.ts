import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { sms as SMSsappdata } from 'app/mock-api/apps/SMS/data';

@Injectable({
    providedIn: 'root',
})
export class SMSMockApi {
    private _sms: any[] = SMSsappdata;

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
        // SMS
        this._fuseMockApiService
            .onGet('api/apps/SMS/sms', 300)
            .reply(({ request }) => {
                // Get available queries

                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the sms
                let sms: any[] | null = cloneDeep(this._sms);

                // Sort the sms
                if (
                    sort === 'NAME' ||
                    sort === 'BaseUrl' ||
                    sort === 'AuthenticationHeader' ||
                    sort === 'Method' ||
                    sort === 'Body'
                ) {
                    sms.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    sms.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the sms
                    sms = sms.filter((data) => {
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
                const propertiesLength = sms.length;

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
                // sms but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    sms = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    sms = sms.slice(begin, end);

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
                        sms,
                        pagination,
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/sms/message')
            .reply(({ request }) => {
                const sms = cloneDeep(request.body.sms);
                // Unshift the new sms
                const maxId = this._sms.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._sms[0].ID
                );
                sms.ID = maxId + 1;
                this._sms.unshift(sms);

                // Return the response
                return [200, sms];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/sms/message')
            .reply(({ request }) => {
                // Get the id and sms
                const id = request.body.ID;
                const sms = cloneDeep(request.body.sms);
                // Prepare the updated sms
                let updatedProduct = sms;

                // Find the sms and update it
                this._sms.forEach((item, index, messages) => {
                    if (item.ID === id) {
                        // Update the sms
                        messages[index] = assign({}, messages[index], sms);

                        // Store the updated sms
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
            .onDelete('api/apps/sms/message')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the sms and delete it
                this._sms.forEach((item, index) => {
                    if (item.ID === id) {
                        this._sms.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });
    }
}
