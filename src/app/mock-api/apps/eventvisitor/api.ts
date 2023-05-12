import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { events as eventData } from 'app/mock-api/apps/eventvisitor/data';

@Injectable({
    providedIn: 'root',
})
export class EventMockApi {
    private _event: any[] = eventData;

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
        //Theme------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/eventvistor/eventvistors', 300)
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'FULLNAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the events
                let events: any[] | null = cloneDeep(this._event);

                // Sort the events
                if (
                    sort === 'FULLNAME' ||
                    sort === 'EMAILID' ||
                    sort === 'CONTACTNO' ||
                    sort === 'COMPANY' ||
                    sort === 'VISITEDON'
                ) {
                    events.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    events.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the events
                    events = events.filter((data) => {
                        if (
                            data.FULLNAME.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.EMAILID.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.CONTACTNO.toString()
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            data.COMPANY.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });
                }

                // Paginate - Start
                const floorsLength = events.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), floorsLength);
                const lastPage = Math.max(Math.ceil(floorsLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                if (page > lastPage) {
                    events = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    events = events.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: floorsLength,
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
                        events,
                        pagination,
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/eventvistor/eventss')
            .reply(({ request }) => {
                // Get the id from the params
                const id = request.params.get('ID');

                // Clone the events
                const events = cloneDeep(this._event);

                // Find the event
                const event = events.find((item) => item.id === id);

                // Return the response
                return [200, event];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/eventvistor/eventss')
            .reply(({ request }) => {
                const event = cloneDeep(request.body.Theme);
                // Unshift the new event
                const maxId = this._event.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._event[0].ID
                );
                event.ID = maxId + 1;
                console.log(event.ID, 'event.IDtheme.IDtheme.ID');
                this._event.unshift(event);

                // Return the response
                return [200, event];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/eventvistor/eventss')
            .reply(({ request }) => {
                // Get the id and event
                const id = request.body.ID;
                const event = cloneDeep(request.body.event);
                // Prepare the updated event
                let updatedTheme = event;

                // Find the event and update it
                this._event.forEach((item, index, events) => {
                    if (item.ID === id) {
                        // Update the event
                        events[index] = assign({}, events[index], event);

                        // Store the updated event
                        updatedTheme = events[index];
                    }
                });
                // Return the response
                return [200, updatedTheme];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/eventvistor/eventss')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the event and delete it
                this._event.forEach((item, index) => {
                    if (item.ID === id) {
                        this._event.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });
    }
}
