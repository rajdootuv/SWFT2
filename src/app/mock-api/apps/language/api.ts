import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
    languages as languagesData,
    // vendors as vendorsData,
    // visits as visitsData,
} from 'app/mock-api/apps/language/data';

@Injectable({
    providedIn: 'root',
})
export class LanguagesMockApi {
    private _Languages: any[] = languagesData;
    // private _vendors: any[] = vendorsData;
    // private _visits: any[] = visitsData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        this._fuseMockApiService
            .onGet('api/apps/language/languages')
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'NAME';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the Languages
                let language: any[] | null = cloneDeep(this._Languages);

                // Sort the Languages
                if (
                    sort === 'NAME' ||
                    sort === 'CODE' ||
                    sort === 'IS_DIALECT' ||
                    sort === 'DIALECT_OF'

                ) {
                    language.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    language.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                    console.log(language);

                }

                // If search exists...
                if (search) {
                    // Filter the language
                    language = language.filter((data) => {
                        if (
                            data.NAME.toLowerCase().includes(
                                search.toLowerCase()
                            )
                            ||
                            data.CODE.toLowerCase().includes(
                                search.toLowerCase()
                            )
                            ||
                            data.DIALECT_OF.toLowerCase().includes(
                                search.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                    });

                }

                // Paginate - Start
                const languagesLength = language.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), languagesLength);
                const lastPage = Math.max(Math.ceil(languagesLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // Languages but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    language = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    language = language.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: languagesLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }
                console.log(language);
                console.log(pagination);


                // Return the response
                return [
                    200,
                    {
                        language,
                        pagination,
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/language/language')
            .reply(({ request }) => {
                // Get the id from the params
                const id = request.params.get('ID');

                // Clone the languages
                const languages = cloneDeep(this._Languages);

                // Find the languages
                const language = languages.find((item) => item.id === id);

                // Return the response
                return [200, language];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/language/language')
            .reply(({ request }) => {
                const language = cloneDeep(request.body.language);
                // Unshift the new language
                const maxId = this._Languages.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._Languages[0].ID
                );
                language.ID = maxId + 1;
                this._Languages.unshift(language);

                // Return the response
                return [200, language];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/language/language')
            .reply(({ request }) => {
                // Get the id and language
                const id = request.body.ID;
                const language = cloneDeep(request.body.language);
                // Prepare the updated language
                let updatedProduct = language;

                // Find the language and update it
                this._Languages.forEach((item, index, languages) => {
                    if (item.ID === id) {
                        // Update the language
                        languages[index] = assign({}, languages[index], language);

                        // Store the updated language
                        updatedProduct = languages[index];
                    }

                });
                // Return the response
                return [200, updatedProduct];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/language/language')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the language and delete it
                this._Languages.forEach((item, index) => {
                    if (item.ID === id) {
                        this._Languages.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });

    }
}