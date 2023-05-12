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
import {
    SetupPagination,
    Floors,
    Studio,
    Language,
    LanguageTranslation,
    Bays,
    Theme,
    themePagination,
    OrganizationData,
} from 'app/modules/admin/setup/setup.types';
import { AuthenticationPagination } from '../authentications/authentications.types';

@Injectable({
    providedIn: 'root',
})
export class SetupService {
    // Private
    private _pagination: BehaviorSubject<SetupPagination | null> =
        new BehaviorSubject(null);
    private _floor: BehaviorSubject<Floors | null> = new BehaviorSubject(null);
    private _floors: BehaviorSubject<Floors[] | null> = new BehaviorSubject(
        null
    );
    private _Studio: BehaviorSubject<Studio[] | null> = new BehaviorSubject(
        null
    );
    private _languages: BehaviorSubject<Language[] | null> =
        new BehaviorSubject(null);

    private _language: BehaviorSubject<Language | null> = new BehaviorSubject(
        null
    );

    private _LanguageTranslation: BehaviorSubject<
        LanguageTranslation[] | null
    > = new BehaviorSubject(null);
    private _theme: BehaviorSubject<Theme[] | null> = new BehaviorSubject(null);

    private _them: BehaviorSubject<Theme | null> = new BehaviorSubject(null);
    private _organization: BehaviorSubject<OrganizationData[] | null> =
        new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<SetupPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for floor
     */
    get floor$(): Observable<Floors> {
        return this._floor.asObservable();
    }

    /**
     * Getter for floors
     */
    get floors$(): Observable<Floors[]> {
        return this._floors.asObservable();
    }

    /**
     * Getter for studio
     */
    get studio$(): Observable<Studio[]> {
        return this._Studio.asObservable();
    }

    get organization$(): Observable<OrganizationData[]> {
        return this._organization.asObservable();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get floors
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    
    getFloors(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: SetupPagination; floors: Floors[] }> {
        return this._httpClient
            .get<{ pagination: SetupPagination; floors: Floors[] }>(
                'api/apps/floors/floors',
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
                    this._floors.next(response.floors);
                })
            );
    }

    /**
     * Get floor by id
     */
    getFloorById(id: number): Observable<Floors> {
        return this._floors.pipe(
            take(1),
            map((floors) => {
                // Find the floor
                const floor = floors.find((item) => item.ID === id) || null;

                // Update the floor
                this._floor.next(floor);

                // Return the floor
                return floor;
            }),
            switchMap((floor) => {
                if (!floor) {
                    return throwError(
                        'Could not found floor with id of ' + id + '!'
                    );
                }

                return of(floor);
            })
        );
    }

    /**
     * Create floor
     */
    createFloor(floor: Floors): Observable<Floors> {
        return this.floors$.pipe(
            take(1),
            switchMap((floors) =>
                this._httpClient
                    .post<Floors>('api/apps/floors/floor', { floor })
                    .pipe(
                        map((newFloor) => {
                            // Update the floors with the new floor
                            this._floors.next([newFloor, ...floors]);

                            // Return the new floor
                            return newFloor;
                        })
                    )
            )
        );
    }

    /**
     * Update floor
     *
     * @param id
     * @param floor
     */
    updateFloor(id: number, floor: Floors): Observable<Floors> {
        return this.floors$.pipe(
            take(1),
            switchMap((floors) =>
                this._httpClient
                    .patch<Floors>('api/apps/floors/floor', {
                        id,
                        floor,
                    })
                    .pipe(
                        map((updatedFloor) => {
                            // Update the floors
                            this._floors.next(floors);

                            // Return the updated floor
                            return updatedFloor;
                        })
                    )
            )
        );
    }

    /**
     * Delete the floor
     *
     * @param id
     */
    deleteFloor(id: number): Observable<boolean> {
        return this.floors$.pipe(
            take(1),
            switchMap((floors) =>
                this._httpClient
                    .delete('api/apps/floors/floor', { params: { id } })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted floor
                            const index = floors.findIndex(
                                (item) => item.ID === id
                            );

                            // Delete the floor
                            floors.splice(index, 1);

                            // Update the floors
                            this._floors.next(floors);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

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
    getstudio(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: SetupPagination; studio: Studio[] }> {
        return this._httpClient
            .get<{ pagination: SetupPagination; studio: Studio[] }>(
                'api/apps/studio/studio',
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
                    this._Studio.next(response.studio);
                })
            );
    }

    /**
     * Getter for Languages
     */
    get languages$(): Observable<Language[]> {
        return this._languages.asObservable();
    }

    /**
     * Getter for Language
     */
    get language$(): Observable<Language> {
        return this._language.asObservable();
    }

    /**
     * Get languages
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */

    getLanguage(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: AuthenticationPagination;
        language: Language[];
    }> {
        return this._httpClient
            .get<{
                pagination: AuthenticationPagination;
                language: Language[];
            }>('api/apps/language/languages', {
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
                    this._languages.next(response.language);
                })
            );
    }

    /**
     * Get Language by id
     */
    getLanguageById(id: number): Observable<Language> {
        return this._languages.pipe(
            take(1),
            map((languages) => {
                // Find the language
                const language =
                    languages.find((item) => item.ID === id) || null;

                // Update the language
                this._language.next(language);

                // Return the language
                return language;
            }),
            switchMap((language) => {
                if (!language) {
                    return throwError(
                        'Could not found language with id of ' + id + '!'
                    );
                }

                return of(language);
            })
        );
    }

    /**
     * Create Language
     */
    createLanguage(language: Language): Observable<Language> {
        return this.languages$.pipe(
            take(1),
            switchMap((languages) =>
                this._httpClient
                    .post<Language>('api/apps/language/language', { language })
                    .pipe(
                        map((newlanguage) => {
                            // Update the languages with the new language
                            this._languages.next([newlanguage, ...languages]);

                            // Return the new language
                            return newlanguage;
                        })
                    )
            )
        );
    }

    /**
     * Update Language
     *
     * @param id
     * @param language
     */
    updateLanguage(id: number, language: Language): Observable<Language> {
        return this.languages$.pipe(
            take(1),
            switchMap((languages) =>
                this._httpClient
                    .patch<Language>('api/apps/language/language', {
                        id,
                        language,
                    })
                    .pipe(
                        map((updatedlanguage) => {
                            // Update the languages
                            this._languages.next(languages);

                            // Return the updated languages
                            return updatedlanguage;
                        })
                    )
            )
        );
    }

    /**
     * Getter for LanguageTranslation
     */
    get languageTranslations$(): Observable<LanguageTranslation[]> {
        return this._LanguageTranslation.asObservable();
    }

    /**
     * Get LanguageTranslation
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */

    getLanguageTranslations(
        page: number = 0,
        size: number = 10,
        sort: string = 'ENGLISH',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: AuthenticationPagination;
        language: LanguageTranslation[];
    }> {
        return this._httpClient
            .get<{
                pagination: AuthenticationPagination;
                language: LanguageTranslation[];
            }>('api/apps/language-translation/languageTranslationData', {
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
                    this._LanguageTranslation.next(response.language);
                })
            );
    }

    /////////////bay services///////////////
    private _bays: BehaviorSubject<Bays[] | null> = new BehaviorSubject(null);
    get bays$(): Observable<Bays[]> {
        return this._bays.asObservable();
    }

    getBays(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: AuthenticationPagination; bays: Bays[] }> {
        return this._httpClient
            .get<{ pagination: AuthenticationPagination; bays: Bays[] }>(
                'api/apps/bay/bays',
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

                    this._bays.next(response.bays);
                })
            );
    }

    createBay(bay: Bays): Observable<Bays> {
        return this.bays$.pipe(
            take(1),

            switchMap((bays) =>
                this._httpClient.post<Bays>('api/apps/bay/bay', { bay }).pipe(
                    map((newTalent) => {
                        // Update the visitors with the new visitor

                        this._bays.next([newTalent, ...bays]); // Return the new visitor

                        return newTalent;
                    })
                )
            )
        );
    }

    updateBays(id: number, bay: Bays): Observable<Bays> {
        return this.bays$.pipe(
            take(1),

            switchMap((bays) =>
                this._httpClient
                    .patch<Bays>('api/apps/bay/bay', {
                        id,

                        bay,
                    })
                    .pipe(
                        map((updatedTalent) => {
                            // Update the visitors

                            this._bays.next(bays); // Return the updated visitor

                            return updatedTalent;
                        })
                    )
            )
        );
    }

    /////////Theme Services////////
    get theme$(): Observable<Theme[]> {
        return this._theme.asObservable();
    }

    // */
    get them$(): Observable<Theme> {
        return this._them.asObservable();
    }

    /**
     * Get floors
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getTheme(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: themePagination; floors: Theme[] }> {
        return this._httpClient
            .get<{ pagination: themePagination; floors: Theme[] }>(
                'api/apps/theme/Theme',
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
                    this._theme.next(response.floors);
                })
            );
    }

    /**
     * Get floor by id
     */
    getThemeId(id: number): Observable<Theme> {
        return this._theme.pipe(
            take(1),
            map((floors) => {
                // Find the floor
                const theme = floors.find((item) => item.ID === id) || null;

                // Update the floor
                this._them.next(theme);

                // Return the floor
                return theme;
            }),
            switchMap((floor) => {
                if (!floor) {
                    return throwError(
                        'Could not found theme with id of ' + id + '!'
                    );
                }

                return of(floor);
            })
        );
    }

    /**
     * Create theme
     */
    createtheme(themes: Theme): Observable<Theme> {
        return this.theme$.pipe(
            take(1),
            switchMap((abc) =>
                this._httpClient
                    .post<Theme>('api/apps/floors/Themess', { themes })
                    .pipe(
                        map((newTheme) => {
                            // Update the floors with the new floor
                            this._theme.next([newTheme, ...abc]);

                            // Return the new floor
                            return newTheme;
                        })
                    )
            )
        );
    }

    /**
     * Update Theme
     *
     * @param id
     * @param Theme
     */
    updateTheme(id: number, Theme: Theme): Observable<Theme> {
        return this.theme$.pipe(
            take(1),
            switchMap((abc) =>
                this._httpClient
                    .patch<Theme>('api/apps/floors/Themess', {
                        id,
                        Theme,
                    })
                    .pipe(
                        map((updatedTheme) => {
                            // Update the floors
                            this._theme.next(abc);

                            // Return the updated floor
                            return updatedTheme;
                        })
                    )
            )
        );
    }

    //////// Orgnization Serivice///////
    getOrganization(
        page: number = 0,
        size: number = 10,
        sort: string = 'NAME',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: SetupPagination;
        organization: OrganizationData[];
    }> {
        return this._httpClient
            .get<{
                pagination: SetupPagination;
                organization: OrganizationData[];
            }>('api/apps/organization/getorganization', {
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
}
