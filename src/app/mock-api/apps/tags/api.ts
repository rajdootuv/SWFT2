import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    tags as tagsData,
} from 'app/mock-api/apps/tags/data';


@Injectable({
    providedIn: 'root',
})
export class TagsMockApi {
    private _tags: any[] = tagsData;

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
      

        this._fuseMockApiService
        .onGet('api/apps/taglists/taglists', 300)
        .reply(({ request }) => {
            // Get available queries
            const search = request.params.get('search');
            const sort = request.params.get('sort') || 'NAME';
            const order = request.params.get('order') || 'asc';
            const page = parseInt(request.params.get('page') ?? '1', 10);
            const size = parseInt(request.params.get('size') ?? '10', 10);

            // Clone the visitors
            let taglists: any[] | null = cloneDeep(this._tags);

            // Sort the visitors
            if (
                sort === 'TAG_NAME' ||
                sort === 'ID'
            ) {
                taglists.sort((a, b) => {
                    const fieldA = a[sort].toString().toUpperCase();
                    const fieldB = b[sort].toString().toUpperCase();
                    return order === 'asc'
                        ? fieldA.localeCompare(fieldB)
                        : fieldB.localeCompare(fieldA);
                });
            } else {
                taglists.sort((a, b) =>
                    order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                );
            }

            // If search exists...
            if (search) {
                // Filter the USER
                taglists = taglists.filter((data) => {
                    if (
                        data.TAG_NAME.toLowerCase().includes(
                            search.toLowerCase()
                        )
                       
                    ) {
                        return true;
                    }
                });
            }

            // Paginate - Start
            const usersLength = taglists.length;

            // Calculate pagination details
            const begin = page * size;
            const end = Math.min(size * (page + 1), usersLength);
            const lastPage = Math.max(Math.ceil(usersLength / size), 1);

            // Prepare the pagination object
            let pagination = {};

            // If the requested page number is bigger than
            // the last possible page number, return null for
            // visitors but also send the last possible page so
            // the app can navigate to there
            if (page > lastPage) {
                taglists = null;
                pagination = {
                    lastPage,
                };
            } else {
                // Paginate the results by size
                taglists = taglists.slice(begin, end);

                // Prepare the pagination mock-api
                pagination = {
                    length: usersLength,
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
                    taglists,
                    pagination,
                },
            ];
        });




          // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/taglists/taglist')
            .reply(({ request }) => {
                const taglist = cloneDeep(request.body.taglist);
                // Unshift the new visitor
                const maxId = this._tags.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._tags[0].ID
                );
                taglist.ID = maxId + 1;
                this._tags.unshift(taglist);

                // Return the response
                return [200, taglist];
            });
 

        
         // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/taglists/taglist')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the visitor and delete it
                this._tags.forEach((item, index) => {
                    if (item.ID === id) {
                        this._tags.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });



        
        
        
        
        }
}
