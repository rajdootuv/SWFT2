export interface EmailSettingPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}



export class EmailSettingData {
    ID: number;
    NAME:any;
    EMAIL_PROVIDER:any;
    EMAIL:any
    PASSWORD:any
    OWNER:any
   
 
}

//Whatsapp

export class whatsappsetting {
    ID:number;
    NAME:String;
    BaseUrl:String;
    AuthenticationHeader:String;
    Method = 'C';
    Body:String;
    primary:boolean=true;
    Headers:String;

}

export interface whatsappPagination{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}



// SMS

export class smssetting {
    ID:number;
    NAME:String;
    BaseUrl:String;
    AuthenticationHeader:String;
    Method:String;
    Body:String;
    primary:boolean=true;
    Headers:String;

}


export interface smsPagination{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}



//SMTP

export class smtpsetting {
    ID:number;
    SSEnabled:boolean = true;
    SERVICENAME:String;
    HOSTNAME:String;
    PORTNUMBER:number;
    AUTHENTICATIONTYPE:String;
    LOGINURL:String;
}


export interface SettingsPaginationsmtp {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

// Properties
export class Properties {
    ID: number;
    PROPERTY: string;
    VALUE: string;
  
}



export interface SettingsPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}





