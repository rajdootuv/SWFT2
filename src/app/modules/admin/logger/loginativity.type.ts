export interface loginActivityPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export class loginactivitydata {

    ID: number;
    NAME:any;
    AVATAR:any;
    DATE:any;
    IPADDRESS:any;
    LOCATION:any    
    DEVICEID:any    
    
}

export class ActiveUsers {
    ID: number;
    FULL_NAME: string;
    ACTIVE_SINCE: string;
    LOCATION: string;
    IP_ADDRESS: number;
    DEVICE: string;
}