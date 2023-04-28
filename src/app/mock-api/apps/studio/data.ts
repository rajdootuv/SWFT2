export const studio = [
    {
        ID: 1,
        NAME: 'SK Photographers',
        WEBSITE: 'https://skuser.com',
        COUNTRY: 'India',
        CITY: 'Sangli',
        STATE: 'Maharashtra',
    },
    {
        ID: 2,
        NAME: 'PK Photographers',
        WEBSITE: 'https://pkuser.com',
        COUNTRY: 'India',
        CITY: 'Sangli',
        STATE: 'Maharashtra',
    },
    {
        ID: 3,
        NAME: 'Mr. XYZ',
        WEBSITE: 'https://xyz.com',
        CITY: 'Prayagraj',
        STATE: 'UP',
        COUNTRY: 'India',
    },

    {
        ID: 4,
        NAME: 'Mr. AAXYZ',
        WEBSITE: 'https://sadd.com',
        COUNTRY: 'India',
        CITY: 'Prayagraj',
        STATE: 'UP',
    },
    {
        ID: 5,
        NAME: 'Mr. GGGXYZ',
        WEBSITE: 'https://ahtj.com',
        CITY: 'Indore',
        STATE: 'MP',
        COUNTRY: 'India',
    },


];


export interface StudioPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
