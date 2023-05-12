import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
// import { EmailSettingData,EmailSettingPagination } from './organizationlist.types';
import {
    EmailSettingPagination,
    EmailSettingData,
    Properties,
    SettingsPagination,
    smsPagination,
    smssetting,
    smtpsetting,
    whatsappPagination,
    whatsappsetting,
    SettingsPaginationsmtp,
} from './setting.type';
import { Visitors } from '../authentications/authentications.types';

@Injectable({
    providedIn: 'root',
})
export class SettingService {
    constructor(private _httpClient: HttpClient) {}

    private _emailsetting: BehaviorSubject<EmailSettingData[] | null> =
        new BehaviorSubject(null);
    private _pagination1: BehaviorSubject<EmailSettingPagination | null> =
        new BehaviorSubject(null);
    // Private
    private _pagination: BehaviorSubject<SettingsPagination | null> =
        new BehaviorSubject(null);
    private _pagination2: BehaviorSubject<smsPagination | null> =
        new BehaviorSubject(null);
    private _pagination3: BehaviorSubject<whatsappPagination | null> =
        new BehaviorSubject(null);

    private _visitorss: BehaviorSubject<Visitors[] | null> =
        new BehaviorSubject(null);
    private _properties: BehaviorSubject<Properties[] | null> =
        new BehaviorSubject(null);
    private _smtp: BehaviorSubject<smtpsetting[] | null> = new BehaviorSubject(
        null
    );
    private _smtps: BehaviorSubject<smtpsetting | null> = new BehaviorSubject(
        null
    );

    private _sms: BehaviorSubject<smssetting[] | null> = new BehaviorSubject(
        null
    );
    private _smss: BehaviorSubject<smssetting | null> = new BehaviorSubject(
        null
    );
    private _whatsapp: BehaviorSubject<whatsappsetting[] | null> =
        new BehaviorSubject(null);

    private _whatsapps: BehaviorSubject<whatsappsetting | null> =
        new BehaviorSubject(null);

    get emailsetting$(): Observable<EmailSettingData[]> {
        return this._emailsetting.asObservable();
    }

 

    get properties$(): Observable<Properties[]> {
        return this._properties.asObservable();
    }

    get smtp$(): Observable<smtpsetting[]> {
        return this._smtp.asObservable();
    }

    get sms$(): Observable<smssetting[]> {
        return this._sms.asObservable();
    }

    get whatsapp$(): Observable<whatsappsetting[]> {
        return this._whatsapp.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<SettingsPagination> {
        return this._pagination.asObservable();
    }

    get pagination1$(): Observable<SettingsPaginationsmtp> {
        return this._pagination1.asObservable();
    }

    get pagination2$(): Observable<smsPagination> {
        return this._pagination2.asObservable();
    }

    get pagination3$(): Observable<whatsappPagination> {
        return this._pagination3.asObservable();
    }


    getemailsettingdata(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: EmailSettingPagination;
        emailsetting: EmailSettingData[];
    }> {
        return this._httpClient
            .get<{
                pagination: EmailSettingPagination;
                emailsetting: EmailSettingData[];
            }>('api/apps/emailsetting/getemailsetting', {
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
                    this._pagination1.next(response.pagination);
                    this._emailsetting.next(response.emailsetting);
                })
            );
    }

        //    SMTP

        getSMTP(
            page: number = 0,
            size: number = 10,
            sort: string = 'SERVICENAME',
            order: 'asc' | 'desc' | '' = 'asc',
            search: string = ''
        ): Observable<{ pagination: SettingsPaginationsmtp; smtp: smtpsetting[] }> {
            return this._httpClient
                .get<{ pagination: SettingsPaginationsmtp; smtp: smtpsetting[] }>(
                    'api/apps/smtp/smtp',
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
                        this._pagination1.next(response.pagination);
                        this._smtp.next(response.smtp);
                    })
                );
        }
    
        /**
         * Get smtp by id
         */
        getSMTPById(id: number): Observable<smtpsetting> {
            return this._smtp.pipe(
                take(1),
                map((smtps) => {
                    // Find the smtp
                    const smtp = smtps.find((item) => item.ID === id) || null;
    
                    // Update the smtp
                    this._smtps.next(smtp);
    
                    // Return the smtp
                    return smtp;
                }),
                switchMap((smtp) => {
                    if (!smtp) {
                        return throwError(
                            'Could not found smtp with id of ' + id + '!'
                        );
                    }
    
                    return of(smtp);
                })
            );
        }
    
        /**
         * Create smtp
         */
        createSMTP(smtp: smtpsetting): Observable<smtpsetting> {
            return this.smtp$.pipe(
                take(1),
                switchMap((smtps) =>
                    this._httpClient
                        .post<smtpsetting>('api/apps/smtp/message', { smtp })
                        .pipe(
                            map((newSmtp) => {
                                // Update the smtps with the new smtp
                                this._smtp.next([newSmtp, ...smtps]);
    
                                // Return the new smtp
                                return newSmtp;
                            })
                        )
                )
            );
        }
    
        /**
         * Update smtp
         *
         * @param id
         * @param smtp
         */
        updateSMTP(id: number, smtp: smtpsetting): Observable<smtpsetting> {
            return this.smtp$.pipe(
                take(1),
                switchMap((floors) =>
                    this._httpClient
                        .patch<smtpsetting>('api/apps/smtp/message', {
                            id,
                            smtp,
                        })
                        .pipe(
                            map((updatedSmtp) => {
                                // Update the smtps
                                this._smtp.next(floors);
    
                                // Return the updated smtp
                                return updatedSmtp;
                            })
                        )
                )
            );
        }
    
        /**
         * Delete the smtp
         *
         * @param id
         */
        deleteSMTP(id: number): Observable<boolean> {
            return this.smtp$.pipe(
                take(1),
                switchMap((smtps) =>
                    this._httpClient
                        .delete('api/apps/floors/floor', { params: { id } })
                        .pipe(
                            map((isDeleted: boolean) => {
                                // Find the index of the deleted smtp
                                const index = smtps.findIndex(
                                    (item) => item.ID === id
                                );
    
                                // Delete the smtp
                                smtps.splice(index, 1);
    
                                // Update the smtps
                                this._smtp.next(smtps);
    
                                // Return the deleted status
                                return isDeleted;
                            })
                        )
                )
            );
        }
    
        /**
         * Get sms
         */
        getSMS(
            page: number = 0,
            size: number = 10,
            sort: string = 'NAME',
            order: 'asc' | 'desc' | '' = 'asc',
            search: string = ''
        ): Observable<{ pagination: smsPagination; sms: smssetting[] }> {
            return this._httpClient
                .get<{ pagination: smsPagination; sms: smssetting[] }>(
                    'api/apps/SMS/sms',
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
                        this._pagination2.next(response.pagination);
                        this._sms.next(response.sms);
                    })
                );
        }
    
        /**
         * Get sms by id
         */
        getsmsById(id: number): Observable<smssetting> {
            return this._sms.pipe(
                take(1),
                map((smss) => {
                    // Find the sms
                    const sms = smss.find((item) => item.ID === id) || null;
    
                    // Update the sms
                    this._smss.next(sms);
    
                    // Return the sms
                    return sms;
                }),
                switchMap((sms) => {
                    if (!sms) {
                        return throwError(
                            'Could not found sms with id of ' + id + '!'
                        );
                    }
    
                    return of(sms);
                })
            );
        }
    
        /**
         * Create sms
         */
        createsms(sms: smssetting): Observable<smssetting> {
            return this.sms$.pipe(
                take(1),
                switchMap((smss) =>
                    this._httpClient
                        .post<smssetting>('api/apps/sms/message', { sms })
                        .pipe(
                            map((newsms) => {
                                console.log(newsms, 'newsms');
                                // Update the smss with the new sms
                                this._sms.next([newsms, ...smss]);
    
                                // Return the new sms
                                return newsms;
                            })
                        )
                )
            );
        }
    
        /**
         * Update sms
         *
         * @param id
         * @param sms
         */
        updatesms(id: number, sms: smssetting): Observable<smssetting> {
            return this.sms$.pipe(
                take(1),
                switchMap((smss) =>
                    this._httpClient
                        .patch<smssetting>('api/apps/sms/message', {
                            id,
                            sms,
                        })
                        .pipe(
                            map((updatedsms) => {
                                // Update the smss
                                this._sms.next(smss);
    
                                // Return the updated sms
                                return updatedsms;
                            })
                        )
                )
            );
        }
    
        /**
         * Delete the sms
         *
         * @param id
         */
        deletesms(id: number): Observable<boolean> {
            return this.sms$.pipe(
                take(1),
                switchMap((sms) =>
                    this._httpClient
                        .delete('api/apps/sms/message', { params: { id } })
                        .pipe(
                            map((isDeleted: boolean) => {
                                // Find the index of the deleted floor
                                const index = sms.findIndex(
                                    (item) => item.ID === id
                                );
    
                                // Delete the sms
                                sms.splice(index, 1);
    
                                // Update the sms
                                this._sms.next(sms);
    
                                // Return the deleted status
                                return isDeleted;
                            })
                        )
                )
            );
        }
    
        // Whatsapp
    
        getWhatsapp(
            page: number = 0,
            size: number = 10,
            sort: string = 'NAME',
            order: 'asc' | 'desc' | '' = 'asc',
            search: string = ''
        ): Observable<{
            pagination: whatsappPagination;
            whatsapp: whatsappsetting[];
        }> {
            return this._httpClient
                .get<{
                    pagination: whatsappPagination;
                    whatsapp: whatsappsetting[];
                }>('api/apps/whatsapp/whatsapp', {
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
                        this._pagination3.next(response.pagination);
                        this._whatsapp.next(response.whatsapp);
                    })
                );
        }
    
        /**
         * Get whatsapp by id
         */
        getWhatsappById(id: number): Observable<whatsappsetting> {
            return this._whatsapp.pipe(
                take(1),
                map((whatsapps) => {
                    // Find the whatsapp
                    const whatsapp =
                        whatsapps.find((item) => item.ID === id) || null;
    
                    // Update the whatsapp
                    this._whatsapps.next(whatsapp);
    
                    // Return the whatsapp
                    return whatsapp;
                }),
                switchMap((whatsapp) => {
                    if (!whatsapp) {
                        return throwError(
                            'Could not found whatsapp with id of ' + id + '!'
                        );
                    }
    
                    return of(whatsapp);
                })
            );
        }
    
        /**
         * Create whatsapp
         */
        createWhatsapp(whatsapp: whatsappsetting): Observable<whatsappsetting> {
            return this.whatsapp$.pipe(
                take(1),
                switchMap((whatsapps) =>
                    this._httpClient
                        .post<whatsappsetting>('api/apps/whatsapp/message', {
                            whatsapp,
                        })
                        .pipe(
                            map((newwhatsapp) => {
                                // Update the whatsapp with the new whatsapp
                                this._whatsapp.next([newwhatsapp, ...whatsapps]);
    
                                // Return the new whatsapp
                                return newwhatsapp;
                            })
                        )
                )
            );
        }
    
        /**
         * Update whatsapp
         *
         * @param id
         * @param whatsapp
         */
        updatewhatsapp(
            id: number,
            whatsapp: whatsappsetting
        ): Observable<whatsappsetting> {
            return this.whatsapp$.pipe(
                take(1),
                switchMap((whatsapp) =>
                    this._httpClient
                        .patch<whatsappsetting>('api/apps/whatsapp/whatsapps', {
                            id,
                            whatsapp,
                        })
                        .pipe(
                            map((updatedFloor) => {
                                // Update the whatsapp
                                this._whatsapp.next(whatsapp);
    
                                // Return the updated floor
                                return updatedFloor;
                            })
                        )
                )
            );
        }
    
        /**
         * Delete the whatsapp
         *
         * @param id
         */
        deleteWhatsapp(id: number): Observable<boolean> {
            return this.whatsapp$.pipe(
                take(1),
                switchMap((whatsapp) =>
                    this._httpClient
                        .delete('api/apps/whatsapp/whatsapps', { params: { id } })
                        .pipe(
                            map((isDeleted: boolean) => {
                                // Find the index of the deleted whatsapp
                                const index = whatsapp.findIndex(
                                    (item) => item.ID === id
                                );
    
                                // Delete the whatsapp
                                whatsapp.splice(index, 1);
    
                                // Update the whatsapp
                                this._whatsapp.next(whatsapp);
    
                                // Return the deleted status
                                return isDeleted;
                            })
                        )
                )
            );
        }
    
        getProperties(
            page: number = 0,
            size: number = 10,
            sort: string = 'PROPERTY',
            order: 'asc' | 'desc' | '' = 'asc',
            search: string = ''
        ): Observable<{
            pagination: SettingsPagination;
            properties: Properties[];
        }> {
            return this._httpClient
                .get<{ pagination: SettingsPagination; properties: Properties[] }>(
                    'api/apps/Properties/properties',
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
                        this._properties.next(response.properties);
                    })
                );
        }
    
        /**
         * Update Properties
         *
         * @param id
         * @param properties
         */
        updateProperties(
            id: number,
            properties: Properties
        ): Observable<Properties> {
            return this.properties$.pipe(
                take(1),
                switchMap((abc) =>
                    this._httpClient
                        .patch<Properties>('api/apps/properties/propertie', {
                            id,
                            properties,
                        })
                        .pipe(
                            map((updatedproperties) => {
                                // Update the visitors
                                this._properties.next(abc);
    
                                // Return the updated visitor
                                return updatedproperties;
                            })
                        )
                )
            );
        }
    
        /**
         * Create property
         */
        createproperties(property: Properties): Observable<Properties> {
            return this.properties$.pipe(
                take(1),
                switchMap((properties) =>
                    this._httpClient
                        .post<Properties>('api/apps/properties/message', {
                            property,
                        })
                        .pipe(
                            map((newProperties) => {
                                // Update the properties with the new property
                                this._properties.next([
                                    newProperties,
                                    ...properties,
                                ]);
    
                                // Return the new property
                                return newProperties;
                            })
                        )
                )
            );
        }
}
