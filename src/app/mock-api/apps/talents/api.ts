import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    // visitors as visitorsData,
    // vendors as vendorsData,
    // visits as visitsData,
    talents as talentsData,
} from 'app/mock-api/apps/talents/data';

@Injectable({
    providedIn: 'root',
})
export class TalentsMockApi {
    // private _visitors: any[] = visitorsData;
    // private _vendors: any[] = vendorsData;
    // private _visits: any[] = visitsData;
    private _talents: any[] = talentsData;

    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.ResisterHandlerTalent();
    }

    ResisterHandlerTalent(): void {
        this._fuseMockApiService
            .onGet('api/apps/talents/talents')
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the visitors
                let talents: any[] | null = cloneDeep(this._talents);

                // Sort the visitors
                if (
                    sort === 'NAME' || sort === 'EMAIL_ID' ||
                    sort === 'COMPANY_NAME' ||
                    // sort === 'DESIGNATION' ||
                    sort === 'MOBILE_NO'
                ) {
                    talents.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    talents.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                    console.log(talents);

                }

                // If search exists...
                if (search) {
                    // Filter the visitors
                    talents = talents.filter((data) => {
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
                const visitorsLength = talents.length;

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
                    talents = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    talents = talents.slice(begin, end);

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
                console.log(talents);

                // Return the response
                return [
                    200,
                    {
                        talents,
                        pagination,
                    },
                ];
            });

        this._fuseMockApiService
            .onPost('api/apps/talents/talents')
            .reply(({ request }) => {
                const talent = cloneDeep(request.body.talent);
                // Unshift the new visitor
                const maxId = this._talents.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._talents[0].ID
                );
                talent.ID = maxId + 1;
                this._talents.unshift(talent);

                // Return the response
                return [200, talent];
            });

        this._fuseMockApiService
            .onPatch('api/apps/talents/talents')
            .reply(({ request }) => {
                // Get the id and visitor
                const id = request.body.ID;
                const talent = cloneDeep(request.body.talent);
                // Prepare the updated visitor
                let updatedProduct = talent;

                // Find the visitor and update it
                this._talents.forEach((item, index, talents) => {
                    if (item.ID === id) {
                        // Update the visitor
                        talents[index] = assign({}, talents[index], talent);

                        // Store the updated visitor
                        updatedProduct = talents[index];
                    }

                });
                // Return the response
                return [200, updatedProduct];
            });

        this._fuseMockApiService
            .onPost('api/apps/talents/talents')
            .reply(({ request }) => {
                const talent = cloneDeep(request.body.talent);
                // Unshift the new visitor
                const maxId = this._talents.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._talents[0].ID
                );
                talent.ID = maxId + 1;
                this._talents.unshift(talent);

                // Return the response
                return [200, talent];
            });
    }
}
