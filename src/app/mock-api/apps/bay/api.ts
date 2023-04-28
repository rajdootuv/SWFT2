import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    // visitors as visitorsData,
    // vendors as vendorsData,
    // visits as visitsData,
    bays as baysData,
} from 'app/mock-api/apps/bay/data';

@Injectable({
    providedIn: 'root',
})
export class BaysMockApi {
    // private _visitors: any[] = visitorsData;
    // private _vendors: any[] = vendorsData;
    // private _visits: any[] = visitsData;
    private _bays: any[] = baysData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.ResisterHandlerBay();
    }

    ResisterHandlerBay(): void {
        this._fuseMockApiService
            .onGet('api/apps/bay/bays')
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the visitors
                let bays: any[] | null = cloneDeep(this._bays);

                // Sort the visitors
                if (
                    sort === 'NAME' || sort === 'EMAIL_ID' ||
                    sort === 'COMPANY_NAME' ||
                    // sort === 'DESIGNATION' ||
                    sort === 'MOBILE_NO'
                ) {
                    bays.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    bays.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                    console.log(bays);

                }

                // If search exists...
                if (search) {
                    // Filter the visitors
                    bays = bays.filter((data) => {
                        if (
                            data.NAME.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });

                }

                // Paginate - Start
                const visitorsLength = bays.length;

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
                    bays = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    bays = bays.slice(begin, end);

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
                console.log(bays);

                // Return the response
                return [
                    200,
                    {
                        bays,
                        pagination,
                    },
                ];
            });

        this._fuseMockApiService
            .onPost('api/apps/bay/bay')
            .reply(({ request }) => {
                const bay = cloneDeep(request.body.bay);
                // Unshift the new visitor
                const maxId = this._bays.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._bays[0].ID
                );
                bay.ID = maxId + 1;
                this._bays.unshift(bay);

                // Return the response
                return [200, bay];
            });

        this._fuseMockApiService
            .onPatch('api/apps/bay/bay')
            .reply(({ request }) => {
                // Get the id and visitor
                const id = request.body.ID;
                const talent = cloneDeep(request.body.talent);
                // Prepare the updated visitor
                let updatedProduct = talent;

                // Find the visitor and update it
                this._bays.forEach((item, index, bays) => {
                    if (item.ID === id) {
                        // Update the visitor
                        bays[index] = assign({}, bays[index], talent);

                        // Store the updated visitor
                        updatedProduct = bays[index];
                    }

                });
                // Return the response
                return [200, updatedProduct];
            });

        this._fuseMockApiService
            .onPost('api/apps/bay/bay')
            .reply(({ request }) => {
                const bay = cloneDeep(request.body.bay);
                // Unshift the new visitor
                const maxId = this._bays.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._bays[0].ID
                );
                bay.ID = maxId + 1;
                this._bays.unshift(bay);

                // Return the response
                return [200, bay];
            });

            // this._fuseMockApiService
            // .onPost('api/apps/visitors/talents')
            // .reply(({ request }) => {
            //     const talent = cloneDeep(request.body.talent);
            //     // Unshift the new visitor
            //     const maxId = this._talents.reduce(
            //         (max, character) =>
            //             character.ID > max ? character.ID : max,
            //         this._talents[0].ID
            //     );
            //     talent.ID = maxId + 1;
            //     this._talents.unshift(talent);

            //     // Return the response
            //     return [200, talent];
            // });



    }
}
