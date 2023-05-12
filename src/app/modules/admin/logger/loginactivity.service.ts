import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    Observable,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import {
    ActiveUsers,
    CheckedIN,
    EventLogs,
    feedbacksetting,
    loginactivitydata,
    loginActivityPagination,
    MeetingWith,
    SetupPagination,
    StudioLogs,
    VisitorLogs,
} from './loginativity.type';
import { AuthenticationPagination } from '../authentications/authentications.types';
import { useractivityMaster } from './user-activity/user-activity';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(private _httpClient: HttpClient) {}

    private _organization: BehaviorSubject<loginactivitydata[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<loginActivityPagination | null> =
        new BehaviorSubject(null);
    private _activeUsers: BehaviorSubject<ActiveUsers[] | null> =
        new BehaviorSubject(null);

    // event logs
    private _eventlog: BehaviorSubject<EventLogs | null> = new BehaviorSubject(
        null
    );
    private _eventlogs: BehaviorSubject<EventLogs[] | null> =
        new BehaviorSubject(null);

    // studio logs
    private _studiolog: BehaviorSubject<StudioLogs | null> =
        new BehaviorSubject(null);
    private _studiologs: BehaviorSubject<StudioLogs[] | null> =
        new BehaviorSubject(null);

    private _feedback: BehaviorSubject<feedbacksetting[] | null> =
        new BehaviorSubject(null);

    // Meeting  dropdown

    private _meet: BehaviorSubject<MeetingWith[] | null> = new BehaviorSubject(
        null
    );

    private _useractivity: BehaviorSubject<useractivityMaster[] | null> =
        new BehaviorSubject(null);

    // checkIn  form

    private _check: BehaviorSubject<CheckedIN[] | null> = new BehaviorSubject(
        null
    );

    /**
     * Getter for activeUsers
     */
    get activeUsers$(): Observable<ActiveUsers[]> {
        return this._activeUsers.asObservable();
    }
    /**
     * Getter for login activities
     */
    get organization$(): Observable<loginactivitydata[]> {
        return this._organization.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<loginActivityPagination> {
        return this._pagination.asObservable();
    }
    /**
     * Getter for event
     */
    get eventlog$(): Observable<EventLogs> {
        return this._eventlog.asObservable();
    }

    /**
     * Getter for events
     */
    get eventlogs$(): Observable<EventLogs[]> {
        return this._eventlogs.asObservable();
    }

    // STUDIO

    /**
     * Getter for studiolog
     */
    get studiolog$(): Observable<StudioLogs> {
        return this._studiolog.asObservable();
    }

    /**
     * Getter for studiologs
     */
    get studiologs$(): Observable<StudioLogs[]> {
        return this._studiologs.asObservable();
    }

    /**
     * Getter for // feedback
     */

    get feedback$(): Observable<feedbacksetting[]> {
        return this._feedback.asObservable();
    }

    /**
     * Getter for checkIn
     */
    get checkIn$(): Observable<CheckedIN[]> {
        return this._check.asObservable();
    }

    /**
     * Getter for actvity
     */
    get useractivity$(): Observable<useractivityMaster[]> {
        return this._useractivity.asObservable();
    }
    /////////login activities api methods////////
    getOrganization(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: loginActivityPagination;
        organization: loginactivitydata[];
    }> {
        return this._httpClient
            .get<{
                pagination: loginActivityPagination;
                organization: loginactivitydata[];
            }>('api/apps/login/loginactivity', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._organization.next(response.organization);
                })
            );
    }

    /////////Active  users api methods////////
    /**
     * Get Active  users
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getActiveUsers(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: loginActivityPagination;
        activeUsers: ActiveUsers[];
    }> {
        return this._httpClient
            .get<{
                pagination: loginActivityPagination;
                activeUsers: ActiveUsers[];
            }>('api/apps/active/users', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._activeUsers.next(response.activeUsers);
                })
            );
    }

    /**
     * Get events
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getEvent(
        page: number = 0,
        size: number = 10,
        sort: string = 'FULLNAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: SetupPagination; events: EventLogs[] }> {
        return this._httpClient
            .get<{ pagination: SetupPagination; events: EventLogs[] }>(
                'api/apps/eventvistor/eventvistors',
                {
                    params: {
                        page: '' + page,
                        size: '' + size,
                        sort,
                        order,
                        search,
                    },
                }
            )
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._eventlogs.next(response.events);
                })
            );
    }

    /**
     * Update event
     *
     * @param id
     * @param event
     */
    updatevents(id: number, event: EventLogs): Observable<EventLogs> {
        return this.eventlog$.pipe(
            take(1),
            switchMap((events) =>
                this._httpClient
                    .patch<EventLogs>('api/apps/eventvistor/eventss', {
                        id,
                        event,
                    })
                    .pipe(
                        map((updatedFloor) => {
                            // Update the events
                            this._eventlog.next(events);

                            // Return the updated event
                            return updatedFloor;
                        })
                    )
            )
        );
    }

    //   STUDIO lOGS

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get studios
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getStudio(
        page: number = 0,
        size: number = 10,
        sort: string = 'FULLNAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: SetupPagination; studios: StudioLogs[] }> {
        return this._httpClient
            .get<{ pagination: SetupPagination; studios: StudioLogs[] }>(
                'api/apps/studiovisitorlog/studioo',
                {
                    params: {
                        page: '' + page,
                        size: '' + size,
                        sort,
                        order,
                        search,
                    },
                }
            )
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._studiologs.next(response.studios);
                })
            );
    }

    /**
     * Get studio by id
     */
    getStudioById(id: number): Observable<StudioLogs> {
        return this._studiologs.pipe(
            take(1),
            map((studios) => {
                // Find the studio
                const studio = studios.find((item) => item.ID === id) || null;

                // Update the studio
                this._studiolog.next(studio);

                // Return the studio
                return studio;
            }),
            switchMap((studio) => {
                if (!studio) {
                    return throwError(
                        'Could not found studio with id of ' + id + '!'
                    );
                }

                return of(studio);
            })
        );
    }

    /**
     * Create studio
     */
    createStudio(studio: StudioLogs): Observable<StudioLogs> {
        return this.studiologs$.pipe(
            take(1),
            switchMap((studios) =>
                this._httpClient
                    .post<StudioLogs>('api/apps/studiovisitorlog/studios', {
                        studio,
                    })
                    .pipe(
                        map((newStudio) => {
                            // Update the studios with the new studio
                            this._studiologs.next([newStudio, ...studios]);

                            // Return the new studio
                            return newStudio;
                        })
                    )
            )
        );
    }

    /**
     * Update studio
     *
     * @param id
     * @param studio
     */
    updateStudio(id: number, studio: StudioLogs): Observable<StudioLogs> {
        return this.studiolog$.pipe(
            take(1),
            switchMap((studios) =>
                this._httpClient
                    .patch<StudioLogs>('api/apps/studiovisitorlog/studios', {
                        id,
                        studio,
                    })
                    .pipe(
                        map((updatedStudio) => {
                            // Update the events
                            this._studiolog.next(studios);

                            // Return the updated event
                            return updatedStudio;
                        })
                    )
            )
        );
    }

    // /**
    //  * Delete the studio
    //  *
    //  * @param id
    //  */
    // deleteStudio(id: number): Observable<boolean> {
    //     return this.studiolog$.pipe(
    //         take(1),
    //         switchMap((studios) =>
    //             this._httpClient
    //                 .delete('api/apps/studiovisitorlog/studios', { params: { id } })
    //                 .pipe(
    //                     map((isDeleted: boolean) => {
    //                         // Find the index of the deleted event
    //                         const index = studios.findIndex(
    //                             (item) => item.ID === id
    //                         );

    //                         // Delete the studio
    //                         studios.splice(index, 1);

    //                         // Update the studios
    //                         this.__studiologs.next(studios);

    //                         // Return the deleted status
    //                         return isDeleted;
    //                     })
    //                 )
    //         )
    //     );
    // }

    // create feedback

    // Feedback drawer add call

    /**
     * Create Feedback
     */
    createFeedback(feedback: feedbacksetting): Observable<feedbacksetting> {
        return this.feedback$.pipe(
            take(1),
            switchMap((feedbacks) =>
                this._httpClient
                    .post<feedbacksetting>(
                        'api/apps/studiovisitorlog/feedbackmessage',
                        { feedback }
                    )
                    .pipe(
                        map((newfeedback) => {
                            console.log(newfeedback, 'feedbacks');

                            // Update the feedbacks with the new event
                            this._feedback.next([newfeedback, ...feedbacks]);

                            // Return the new event
                            return newfeedback;
                        })
                    )
            )
        );
    }

    /**
     * Get Meetingwith for dropdown
     */
    getMeets(): Observable<MeetingWith[]> {
        return this._httpClient
            .get<MeetingWith[]>('api/apps/studiovisitorlog/meet')
            .pipe(
                tap((meets) => {
                    this._meet.next(meets);
                })
            );
    }

    /**
     * Create check in
     */
    createcheckin(checkin: CheckedIN): Observable<CheckedIN> {
        return this.checkIn$.pipe(
            take(1),
            switchMap((checkinss) =>
                this._httpClient
                    .post<CheckedIN>(
                        'api/apps/studiovisitorlog/checkinmessage',
                        {
                            checkin,
                        }
                    )
                    .pipe(
                        map((newcheckin) => {
                            console.log(newcheckin);

                            // Update the checkin with the new checkin
                            this._check.next([newcheckin, ...checkinss]);
                            console.log(...checkinss);

                            // Return the new checkins
                            console.log(typeof newcheckin);
                            return newcheckin;
                        })
                    )
            )
        );
    }
    private _visits: BehaviorSubject<VisitorLogs[] | null> =
        new BehaviorSubject(null);

    /**
     * Getter for visitors
     */
    get visits$(): Observable<VisitorLogs[]> {
        return this._visits.asObservable();
    }

    // Visitors Logs

    /**
     * Get visits
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getVisitors(
        page: number = 0,
        size: number = 10,
        sort: string = 'MEETINGWITH',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = '',
        filter: any
    ): Observable<{ pagination: SetupPagination; visits: VisitorLogs[] }> {
        return this._httpClient
            .get<{ pagination: SetupPagination; visits: VisitorLogs[] }>(
                'api/apps/studiovisitorlog/message',
                {
                    params: {
                        page: '' + page,
                        size: '' + size,
                        sort,
                        order,
                        search,
                        filter,
                    },
                }
            )
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._visits.next(response.visits);
                })
            );
    }

    //// Activity service methods///////

    getUseractivity(
        page: number = 0,
        size: number = 5,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = '',
        filter: any
    ): Observable<{
        pagination: SetupPagination;
        useractivity: useractivityMaster[];
    }> {
        console.log('hjhjhjhj');
        return this._httpClient
            .get<{
                pagination: SetupPagination;
                useractivity: useractivityMaster[];
            }>('api/apps/useractivity/useractivity', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                    filter,
                },
            })
            .pipe(
                tap((response) => {
                    console.log(response);

                    this._pagination.next(response.pagination);
                    this._useractivity.next(response.useractivity);
                })
            );
    }
}
