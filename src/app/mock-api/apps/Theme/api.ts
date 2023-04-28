import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { 
    Theme as ThemeData
} from 'app/mock-api/apps/Theme/data';

@Injectable({
    providedIn: 'root',
})
export class ThemeMockApi {
  
    private _theme: any[] = ThemeData;


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
       .onGet('api/apps/theme/Theme', 300)
       .reply(({ request }) => {
           // Get available queries
           const search = request.params.get('search');
           const sort = request.params.get('sort') || 'NAME';
           const order = request.params.get('order') || 'asc';
           const page = parseInt(request.params.get('page') ?? '1', 10);
           const size = parseInt(request.params.get('size') ?? '10', 10);

           // Clone the floors
           let floors: any[] | null = cloneDeep(this._theme);

        
           // Sort the floors
           if (
               sort === 'NAME' ||
               sort === 'FONTFAMILY' ||
               sort === 'FONTSIZE' ||
               sort === 'WIDTH' ||
               sort === 'PRIMARYCOLOR' ||
               sort === 'SECONDARYCOLOR' 
           ) {
               floors.sort((a, b) => {
                   const fieldA = a[sort].toString().toUpperCase();
                   const fieldB = b[sort].toString().toUpperCase();
                   return order === 'asc'
                       ? fieldA.localeCompare(fieldB)
                       : fieldB.localeCompare(fieldA);
               });
           } else {
               floors.sort((a, b) =>
                   order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
               );
           }

           // If search exists...
           if (search) {
               // Filter the floors
               floors = floors.filter((data) => {
                   if (
                       data.NAME.toLowerCase().includes(
                           search.toLowerCase()
                       ) ||
                       data.FONTFAMILY.toLowerCase().includes(
                           search.toLowerCase()
                       ) ||
                       data.FONTSIZE.toString()
                           .toLowerCase()
                           .includes(search.toLowerCase()) ||
                       data.PRIMARYCOLOR.toLowerCase().includes(
                           search.toLowerCase()
                       ) ||
                       data.SECONDARYCOLOR.toLowerCase().includes(
                           search.toLowerCase()
                       )
                   ) {
                       return true;
                   }
               });
           }

           // Paginate - Start
           const floorsLength = floors.length;

           // Calculate pagination details
           const begin = page * size;
           const end = Math.min(size * (page + 1), floorsLength);
           const lastPage = Math.max(Math.ceil(floorsLength / size), 1);

           // Prepare the pagination object
           let pagination = {};

           // If the requested page number is bigger than
           // the last possible page number, return null for
           // floors but also send the last possible page so
           // the app can navigate to there
           if (page > lastPage) {
               floors = null;
               pagination = {
                   lastPage,
               };
           } else {
               // Paginate the results by size
               floors = floors.slice(begin, end);

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
                   floors,
                   pagination,
               },
           ];
       });

       
        // -----------------------------------------------------------------------------------------------------
        // @ Product - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/theme/Themess')
            .reply(({ request }) => {
                // Get the id from the params
                const id = request.params.get('ID');

                // Clone the floors
                const floors = cloneDeep(this._theme);

                // Find the floor
                const theme = floors.find((item) => item.id === id);

                // Return the response
                return [200, theme];
            });

           // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/theme/Themess')
            .reply(({ request }) => {
                const theme = cloneDeep(request.body.Theme);
                // Unshift the new floor
                const maxId = this._theme.reduce(
                    (max, character) =>
                        character.ID > max ? character.ID : max,
                    this._theme[0].ID
                );
                theme.ID = maxId + 1;
                console.log(theme.ID,'theme.IDtheme.IDtheme.ID')
                this._theme.unshift(theme);

                // Return the response
                return [200, theme];
            });

             // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
        .onPatch('api/apps/theme/Themess')
        .reply(({ request }) => {
            // Get the id and floor
            const id = request.body.ID;
            const floor = cloneDeep(request.body.floor); 
            // Prepare the updated floor
            let updatedTheme = floor;

            // Find the floor and update it
            this._theme.forEach((item, index, floors) => {
                if (item.ID === id) {
                    // Update the floor
                    floors[index] = assign({}, floors[index], floor);

                    // Store the updated floor
                    updatedTheme = floors[index];
                }
                 
            });
            // Return the response
            return [200, updatedTheme];
        });



       
       
       
         }
}
