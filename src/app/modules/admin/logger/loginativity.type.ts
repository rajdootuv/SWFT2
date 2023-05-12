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


export class EventLogs {
    ID: number;
    FULLNAME: string;
    EMAILID: string;
    CONTACTNO: number;
    COMPANY: string;
    VISITEDON: any;
    CODE: string = '+91';
}

export interface SetupPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export class StudioLogs {
    ID: number;
    FULLNAME: string;
    EMAILID: string;
    CONTACTNO: number;
    MEETINGWITH: string;
    DATEOFVISIT: any = new Date();
}

export class VisitorLogs {
    ID: number;
    DATE: string;
    LOCATION: string;
    INOUTTIME: number;
    PURPOSE: string;
    MEETINGWITH: any;
    VISITOR_ID: number;
}

export class feedbacksetting {
    ID: number;
    Feedback: string;
}

export class CheckedIN {
    ID:number;
    NAME:String;
    COMPANY_NAME:String;
    EMAIL_ID: String;
    MOBILE_NO: number;
    DESIGNATION: String;
    // CODE:String='+91';

    PURPOSE_OF_VISIT: String;
    MEETING_WITH_ID: any;
    DATE_OF_VISIT: any;
}

export interface MeetingWith {
    ID: string;
    NAME: string;
    slug: string;
}
