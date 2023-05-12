export class useractivityMaster{
    ID:any;
    NAME:string='';
    CONTENT:string='';
}

export interface AuthenticationPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}