import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    EmailSettingData as emailsettinglist,

} from 'app/mock-api/apps/emailsetting/data';

@Injectable({
    providedIn: 'root',
})



export class emailsettingMockApi {
    private _emailsetting: any[] = emailsettinglist;


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
            .onGet('api/apps/emailsetting/getemailsetting', 300)
            .reply(({ request }) => {
                // Get available queries

                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the properties
                let emailsetting: any[] | null = cloneDeep(this._emailsetting);

                // Sort the properties
                if (
                    sort === 'NAME' ||
                    sort === 'EMAIL_PROVIDER' ||
                    sort === 'EMAIL' ||
                    sort === 'OWNER' 

                    
                ) {
                    emailsetting.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                }
                else {
                    emailsetting.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the properties
                    emailsetting = emailsetting.filter((data) => {
                        if (
                            data.NAME.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.EMAIL_PROVIDER.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.EMAIL.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.OWNER.toLowerCase().includes(
                                search.toLowerCase()
                            ) 
                            
                        ) {
                            return true;
                        }
                    });
                }

                // Paginate - Start
                const propertiesLength = emailsetting.length;

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
                    emailsetting = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    emailsetting = emailsetting.slice(begin, end);

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
                        emailsetting,
                        pagination,
                    },
                ];
            });
    }
}
