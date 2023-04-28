import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, } from '@fuse/lib/mock-api';
import {
    languageTranslationData as languagesData,
} from 'app/mock-api/apps/language-translation/data';

@Injectable({
    providedIn: 'root',
})
export class LanguageTranslationMockApi {
    private _LanguageTranslations: any[] = languagesData;

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
            .onGet('api/apps/language-translation/languageTranslationData')
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'ENGLISH';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the Languages
                let language: any[] | null = cloneDeep(this._LanguageTranslations);

                // Sort the Languages
                if (
                    sort === 'ENGLISH' ||
                    sort === 'LANG1' ||
                    sort === 'LANG2' ||
                    sort === 'LANG3' ||
                    sort === 'LANG4'

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
                            data.ENGLISH.toLowerCase().includes(
                                search.toLowerCase()
                            )
                            ||
                            data.LANG1.toLowerCase().includes(
                                search.toLowerCase()
                            )
                            ||
                            data.LANG2.toLowerCase().includes(
                                search.toLowerCase()
                            )
                            ||
                            data.LANG3.toLowerCase().includes(
                                search.toLowerCase()
                            )
                            ||
                            data.LANG4.toLowerCase().includes(
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
    }
}