import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
   
    smtps as smtpsData,
  
    
} from 'app/mock-api/apps/smtp/data';

@Injectable({
    providedIn: 'root',
})
export class SMTPMockApi {
  
    private _smtp: any[] = smtpsData;

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
        .onGet('api/apps/smtp/smtp',300)
        .reply(({ request }) => {
            // Get available queries

            const search = request.params.get('search');
            const sort = request.params.get('sort') || 'SERVICENAME';
            const order = request.params.get('order') || 'asc';
            const page = parseInt(request.params.get('page') ?? '1', 10);
            const size = parseInt(request.params.get('size') ?? '10', 10);

            // Clone the smtps
            let smtp: any[] | null = cloneDeep(this._smtp);

            // Sort the smtps
            if (
                sort === 'SERVICENAME' ||
                sort === 'HOSTNAME' ||
                sort === 'PORTNUMBER' ||
                sort === 'AUTHENTICATIONTYPE' ||
                sort === 'LOGINURL' ||
                sort === 'Body' 
            
            ) {
                smtp.sort((a, b) => {
                    const fieldA = a[sort].toString().toUpperCase();
                    const fieldB = b[sort].toString().toUpperCase();
                    return order === 'asc'
                        ? fieldA.localeCompare(fieldB)
                        : fieldB.localeCompare(fieldA);
                });
            }
             else {
                smtp.sort((a, b) =>
                    order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                );
            }

            // If search exists...
            if (search) {
                // Filter the smtps
                smtp = smtp.filter((data) => {
                    if (
                        data.SERVICENAME.toLowerCase().includes(
                            search.toLowerCase()
                        ) ||
                        data.HOSTNAME.toLowerCase().includes(
                            search.toLowerCase()
                        ) ||
                        data.PORTNUMBER.toLowerCase().includes(
                            search.toLowerCase()
                        ) ||
                        data.AUTHENTICATIONTYPE.toLowerCase().includes(
                            search.toLowerCase()
                        ) ||
                        data.LOGINURL.toLowerCase().includes(
                            search.toLowerCase()
                        ) 
                  
                  
                  
                        ) 
                    
                    {
                        return true;
                    }
                });
            }

            // Paginate - Start
            const propertiesLength = smtp.length;

            // Calculate pagination details
            const begin = page * size;
            const end = Math.min(size * (page + 1), propertiesLength);
            const lastPage = Math.max(Math.ceil(propertiesLength / size), 1);

            // Prepare the pagination object
            let pagination = {};

            // If the requested page number is bigger than
            // the last possible page number, return null for
            // smtps but also send the last possible page so
            // the app can navigate to there
            if (page > lastPage) {
                smtp = null;
                pagination = {
                    lastPage,
                };
            } else {
                // Paginate the results by size
                smtp = smtp.slice(begin, end);

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
                    smtp,
                    pagination,
                },
            ];
        });


         // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/smtp/message')
            .reply(({ request }) => {
                const smtp = cloneDeep(request.body.smtp);
                // Unshift the new smtps
                const maxId = this._smtp.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._smtp[0].ID
                );
                smtp.ID = maxId + 1;
                this._smtp.unshift(smtp);

                // Return the response
                return [200, smtp];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/smtp/message')
            .reply(({ request }) => {
                // Get the id and smtps
                const id = request.body.ID;
                const smtp = cloneDeep(request.body.smtp);
                // Prepare the updated smtp
                let updatedProduct = smtp;

                // Find the smtp and update it
                this._smtp.forEach((item, index, messages) => {
                    if (item.ID === id) {
                        // Update the smtp
                        messages[index] = assign({}, messages[index], smtp);

                        // Store the updated smtp
                        updatedProduct = messages[index];
                    }
                });
                // Return the response
                return [200, updatedProduct];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/smtp/message')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the sms and delete it
                this._smtp.forEach((item, index) => {
                    if (item.ID === id) {
                        this._smtp.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });


       }
}
