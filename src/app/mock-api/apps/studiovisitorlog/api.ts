import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { studiolog as studio } from 'app/mock-api/apps/studiovisitorlog/data';
import { feedback as feedback } from 'app/mock-api/apps/studiovisitorlog/data';
import { Meets as Meet } from 'app/mock-api/apps/studiovisitorlog/data';
import { check as checksappdata } from 'app/mock-api/apps/studiovisitorlog/data';
import { visits as visitsData } from 'app/mock-api/apps/studiovisitorlog/data';

@Injectable({
    providedIn: 'root',
})
export class StudioVisitsMockApi {
    private _studio: any[] = studio;
    private _feedbacks: any[] = feedback;
    private _Meet: any[] = Meet;
    private _check: any[] = checksappdata;
    private _visits: any[] = visitsData;

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
            .onGet('api/apps/studiovisitorlog/studioo', 300)
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'FULLNAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the studios
                let studios: any[] | null = cloneDeep(this._studio);

                // Sort the studios
                if (
                    sort === 'FULLNAME' ||
                    sort === 'EMAILID' ||
                    sort === 'CONTACTNO'
                ) {
                    studios.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    studios.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the studios
                    studios = studios.filter((data) => {
                        if (
                            data.FULLNAME.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.EMAILID.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });
                }

                // Paginate - Start
                const floorsLength = studios.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), floorsLength);
                const lastPage = Math.max(Math.ceil(floorsLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                if (page > lastPage) {
                    studios = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    studios = studios.slice(begin, end);

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
                        studios,
                        pagination,
                    },
                ];
            });

        // // -----------------------------------------------------------------------------------------------------
        // // @ Product - GET
        // // -----------------------------------------------------------------------------------------------------
        // this._fuseMockApiService
        //     .onGet('api/apps/studiovisitorlog/studios')
        //     .reply(({ request }) => {
        //         // Get the id from the params
        //         const id = request.params.get('ID');

        //         // Clone the studios
        //         const studios = cloneDeep(this._studio);

        //         // Find the event
        //         const event = studios.find((item) => item.id === id);

        //         // Return the response
        //         return [200, event];
        //     });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/studiovisitorlog/studios')
            .reply(({ request }) => {
                const event = cloneDeep(request.body.Theme);
                // Unshift the new event
                const maxId = this._studio.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._studio[0].ID
                );
                event.ID = maxId + 1;
                console.log(event.ID, 'event.IDtheme.IDtheme.ID');
                this._studio.unshift(event);

                // Return the response
                return [200, event];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/studiovisitorlog/studios')
            .reply(({ request }) => {
                // Get the id and event
                const id = request.body.ID;
                const event = cloneDeep(request.body.event);
                // Prepare the updated event
                let updatedTheme = event;

                // Find the event and update it
                this._studio.forEach((item, index, studios) => {
                    if (item.ID === id) {
                        // Update the event
                        studios[index] = assign({}, studios[index], event);

                        // Store the updated event
                        updatedTheme = studios[index];
                    }
                });
                // Return the response
                return [200, updatedTheme];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/studiovisitorlog/studios')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the event and delete it
                this._studio.forEach((item, index) => {
                    if (item.ID === id) {
                        this._studio.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });



        // Check In
          /**
     * Register Mock API handlers
     */
    
       
        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/studiovisitorlog/checkinmessage')
            .reply(({ request }) => {
                const checkin = cloneDeep(request.body.checkin);
                // Unshift the new checkin
                console.log(typeof(checkin));
                console.log(checkin);


                const maxId = this._check.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._check[0].ID
                );
                checkin.ID = maxId + 1;
                this._check.unshift(checkin);

                // Return the response
                return [200, checkin];
            });

        // Feedback POST

        // -----------------------------------------------------------------------------------------------------
        // @ Product -  // Feedback POST
        // -----------------------------------------------------------------------------------------------------
       
         // Get Feedback
         this._fuseMockApiService
         .onGet('api/apps/studiovisitorlog/feedbak', 300)
         .reply(({ request }) => {
             // Get available queries

             const search = request.params.get('search');
             const sort = request.params.get('sort') || 'Feedback';
             const order = request.params.get('order') || 'asc';
             const page = parseInt(request.params.get('page') ?? '1', 10);
             const size = parseInt(request.params.get('size') ?? '10', 10);

             // Clone the sms
             let feedback: any[] | null = cloneDeep(this._feedbacks);

             // Sort the feedback
             if (
                 sort === 'Feedback' 
              
             ) {
                 feedback.sort((a, b) => {
                     const fieldA = a[sort].toString().toUpperCase();
                     const fieldB = b[sort].toString().toUpperCase();
                     return order === 'asc'
                         ? fieldA.localeCompare(fieldB)
                         : fieldB.localeCompare(fieldA);
                 });
             } else {
                 feedback.sort((a, b) =>
                     order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                 );
             }

             // If search exists...
             if (search) {
                 // Filter the feedback
                 feedback = feedback.filter((data) => {
                     if (
                         data.Feedback.toLowerCase().includes(
                             search.toLowerCase()
                         ) 
                     ) {
                         return true;
                     }
                 });
             }

             // Paginate - Start
             const propertiesLength = feedback.length;

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
             // feedback but also send the last possible page so
             // the app can navigate to there
             if (page > lastPage) {
                 feedback = null;
                 pagination = {
                     lastPage,
                 };
             } else {
                 // Paginate the results by size
                 feedback = feedback.slice(begin, end);

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
             console.log(feedback)
             return [
                 200,
                 {
                     feedback,
                     pagination,
                 },
             ];
         });
       
       
       
        this._fuseMockApiService
            .onPost('api/apps/studiovisitorlog/feedbackmessage')
            .reply(({ request }) => {
                const feedback = cloneDeep(request.body.feedback);
                // Unshift the new floor
                const maxId = this._feedbacks.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._feedbacks[0].ID
                );
                feedback.ID = maxId + 1;
                this._feedbacks.unshift(feedback);

                console.log(feedback);

                // Return the response
                return [200, feedback];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Meeting - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/studiovisitorlog/meet')
            .reply(() => [200, cloneDeep(this._Meet)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Visitors - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/studiovisitorlog/message')
            .reply(({ request }) => {
                // Get available queries

                const search = request.params.get('search');
                const filter = request.params.get('filter');
                const sort = request.params.get('sort') || 'MEETINGWITH';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the visits
                let visits: any[] | null = cloneDeep(this._visits);

                // Sort the visits
                if (
                    sort === 'MEETINGWITH' ||
                    sort === 'DATE' ||
                    sort === 'LOCATION' ||
                    sort === 'PURPOSE' ||
                    sort === 'INOUTTIME'
                ) {
                    visits.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    visits.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                if (filter != 'undefined' && filter != 'null' && filter != '') {
                    // Filter the visits

                    visits = visits.filter((data) => data.VISITOR_ID == filter);
                }
                // If search exists...

                if (search != 'undefined' && search != 'null' && search != '') {
                    // Filter the visits
                    visits = visits.filter((data) => {
                        if (
                            data.MEETINGWITH.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.DATE.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.LOCATION.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.PURPOSE.toLowerCase().includes(
                                search.toLowerCase()
                            ) ||
                            data.INOUTTIME.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });
                }

                // Paginate - Start
                const visitsLength = visits.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), visitsLength);
                const lastPage = Math.max(Math.ceil(visitsLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // visits but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    visits = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    visits = visits.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: visitsLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }
                console.log(visits, 'visits');
                // Return the response
                return [
                    200,
                    {
                        visits,
                        pagination,
                    },
                ];
            });
    }
}
