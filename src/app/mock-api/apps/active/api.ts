

import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    users as activeUsersData,
    // vendors as vendorsData,
    // visits as visitsData,
} from 'app/mock-api/apps/active/data';


@Injectable({
    providedIn: 'root',
})
export class ActiveMockApi {
    private _activeUsers: any[] = activeUsersData;
    // private _vendors: any[] = vendorsData;
    // private _visits: any[] = visitsData;

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
            .onGet('api/apps/active/users', 300)
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                //     // Clone the activeUsers
                let activeUsers: any[] | null = cloneDeep(this._activeUsers);

                // Sort the activeUsers
                if (
                    sort === 'FULL_NAME' ||
                    sort === 'ACTIVE_SINCE' ||
                    sort === 'LOCATION' ||
                    sort === 'IP_ADDRESS' ||
                    sort === 'DEVICE'
                    // sort === 'MOBILE_NO' ||
                    // sort === 'ACTIVE'
                ) {
                    activeUsers.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    activeUsers.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the activeUsers
                    activeUsers = activeUsers.filter((data) => {
                        if (
                            data.FULL_NAME.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.ACTIVE_SINCE.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.LOCATION.toString()
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||

                            data.IP_ADDRESS.toString()
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||

                                data.DEVICE.toString()
                                .toLowerCase()
                                .includes(search.toLowerCase())

                        ) {
                            return true;
                        }
                    });
                }



                    // Paginate - Start
                    const activeUsersLength = activeUsers.length;

                    // Calculate pagination details
                    const begin = page * size;
                    const end = Math.min(size * (page + 1), activeUsersLength);
                    const lastPage = Math.max(Math.ceil(activeUsersLength / size), 1);
    
                    // Prepare the pagination object
                    let pagination = {};
    
                    if (page > lastPage) {
                        activeUsers = null;
                        pagination = {
                            lastPage,
                        };
                    } else {
                        // Paginate the results by size
                        activeUsers = activeUsers.slice(begin, end);
    
                        // Prepare the pagination mock-api
                        pagination = {
                            length: activeUsersLength,
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
                            activeUsers,
                            pagination,
                        },
                    ];
            });





    }
}
