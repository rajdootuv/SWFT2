import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    users as usersData,
} from 'app/mock-api/apps/users/data';

@Injectable({
    providedIn: 'root',
})
export class UsersMockApi {
    private _users: any[] = usersData;

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
        .onGet('api/apps/users/users', 300)
        .reply(({ request }) => {
            // Get available queries
            const search = request.params.get('search');
            const sort = request.params.get('sort') || 'NAME';
            const order = request.params.get('order') || 'asc';
            const page = parseInt(request.params.get('page') ?? '1', 10);
            const size = parseInt(request.params.get('size') ?? '10', 10);

            // Clone the visitors
            let users: any[] | null = cloneDeep(this._users);

            // Sort the visitors
            if (
                sort === 'NAME' ||
                sort === 'EMAIL_ID' ||
                sort === 'MOBILE_NO' ||
                sort === 'DOB' ||
                sort === 'USER_TYPE' ||
                sort === 'ID'
            ) {
                users.sort((a, b) => {
                    const fieldA = a[sort].toString().toUpperCase();
                    const fieldB = b[sort].toString().toUpperCase();
                    return order === 'asc'
                        ? fieldA.localeCompare(fieldB)
                        : fieldB.localeCompare(fieldA);
                });
            } else {
                users.sort((a, b) =>
                    order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                );
            }

            // If search exists...
            if (search) {
                // Filter the USER
                users = users.filter((data) => {
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
                        data.USER_TYPE.toLowerCase().includes(
                            search.toLowerCase()
                        )
                    ) {
                        return true;
                    }
                });
            }

            // Paginate - Start
            const usersLength = users.length;

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
                users = null;
                pagination = {
                    lastPage,
                };
            } else {
                // Paginate the results by size
                users = users.slice(begin, end);

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
                    users,
                    pagination,
                },
            ];
        });




          // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/users/user')
            .reply(({ request }) => {
                const user = cloneDeep(request.body.user);
                // Unshift the new visitor
                const maxId = this._users.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._users[0].ID
                );
                user.ID = maxId + 1;
                this._users.unshift(user);

                // Return the response
                return [200, user];
            });
 





    // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/users/user')
            .reply(({ request }) => {
                // Get the id and visitor
                const id = request.body.ID;
                const user = cloneDeep(request.body.user); 
                // Prepare the updated visitor
                let updatedProduct = user;

                // Find the visitor and update it
                this._users.forEach((item, index, users) => {
                    if (item.ID === id) {
                        // Update the visitor
                        users[index] = assign({}, users[index], user);

                        // Store the updated visitor
                        updatedProduct = users[index];
                    }
                     
                });
                // Return the response
                return [200, updatedProduct];
            });

        
        
         // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/users/user')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the visitor and delete it
                this._users.forEach((item, index) => {
                    if (item.ID === id) {
                        this._users.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });



        
        
        
        
        }
}
