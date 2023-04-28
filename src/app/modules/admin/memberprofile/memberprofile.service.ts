import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Memberprofiledata,MemberprofilePagination } from './memberprofile.type';

@Injectable({
    providedIn: 'root'
})


export class MemberProfileService
{
   
    constructor(private _httpClient: HttpClient) {
    }

    private _organization: BehaviorSubject<Memberprofiledata[] | null> = new BehaviorSubject(null);     
    private _pagination1: BehaviorSubject<MemberprofilePagination | null> = new BehaviorSubject(null);

    get organization$(): Observable<Memberprofiledata[]>
    {
        return this._organization.asObservable();
    }

    get pagination1$(): Observable<MemberprofilePagination>
    {
        return this._pagination1.asObservable();
    }


    getOrganization(page: number = 0, size: number = 10, sort: string = 'NAME', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
    Observable<{ pagination: MemberprofilePagination; organization: Memberprofiledata[] }>
  {
    return this._httpClient.get<{ pagination: MemberprofilePagination; organization: Memberprofiledata[] }>('api/apps/memberprofile/getmyprofile', {
        params: {
            page: '' + page,
            size: '' + size,
            sort,
            order,
            search
        }
    }).pipe(
        tap((response) => {
            this._pagination1.next(response.pagination);
            this._organization.next(response.organization);
        })
    );
  }
}
