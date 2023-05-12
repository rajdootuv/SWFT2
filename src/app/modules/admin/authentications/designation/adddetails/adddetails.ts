export class designationMaster{
    ID:any;
    NAME:string='';
    IS_ACTIVE:Boolean = true;
}

export interface AuthenticationPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}