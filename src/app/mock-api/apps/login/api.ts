import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    logindata as logindata,

} from 'app/mock-api/apps/login/data';

@Injectable({
    providedIn: 'root',
})



export class loginMockApi {
    private _organization: any[] = logindata;


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
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------



    /**
     * Get visitors
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */


    /**
     * 
     * 
     * Register Mock API handlers
     */
    registerHandlers(): void {
        this._fuseMockApiService
            .onGet('api/apps/login/loginactivity', 300)
            .reply(({ request }) => {
                // Get available queries

                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the properties
                let organization: any[] | null = cloneDeep(this._organization);

                // Sort the properties
                if (
                    sort === 'NAME' ||
                    sort === 'DATE' ||
                    sort === 'IPADDRESS' ||
                    sort === 'LOCATION' ||
                    sort === 'DEVICEID' 
                    
                   
                ) {
                    organization.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                }
                else {
                    organization.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the properties
                    organization = organization.filter((data) => {
                        if (
                            data.NAME.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.DATE.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.IPADDRESS.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.LOCATION.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.DEVICEID.toLowerCase().includes(
                                search.toLowerCase()
                            )


                        ) {
                            return true;
                        }
                    });
                }

                // Paginate - Start
                const propertiesLength = organization.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), propertiesLength);
                const lastPage = Math.max(Math.ceil(propertiesLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // properties but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    organization = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    organization = organization.slice(begin, end);

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
                        organization,
                        pagination,
                    },
                ];
            });
    }
}
