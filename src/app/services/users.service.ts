import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInternalCreateModel } from '../models/users/user-internal-create.model';
import { Observable, catchError } from 'rxjs';
import { UsersInternalResponseModel } from '../models/users/users-internal-response.model';
import { UserExternalCreateModel } from '../models/users/user-external-create.model';
import { UserFilertResponse } from '../models/users/user-filert.response';
import { UserFilertModel } from '../models/users/user-filert.model';
import { UsersDashboardDataModel } from '../models/users/users-dashboard-data.model';
import { InvitationModel } from '../models/users/invitation.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private api: string;
    private token: string;

    constructor(public httpClient: HttpClient) {
        this.api = environment.api + 'users';
        this.token = sessionStorage.getItem("AUTH_TOKE");
    }

    public createInternalUser(request: UserInternalCreateModel): Observable<UsersInternalResponseModel> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.post<UsersInternalResponseModel>(this.api + "/invite", request, { headers });
    }

    public createExternalUser(request: UserExternalCreateModel): Observable<any> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.post<any>(this.api, request, { headers }).pipe(
            catchError((err) => {
                return err;
            }
        ));
    }
    
    public getUsers(request: UserFilertModel): Observable<UserFilertResponse> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.post<UserFilertResponse>(this.api + "/paginate", request, { headers });
    }
    
    public getDataForDashboard(): Observable<UsersDashboardDataModel> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.get<UsersDashboardDataModel>(this.api + '/dashboard', { headers });
    }

    public createUserAfterInvitation(request: InvitationModel): Observable<InvitationModel> {
        return this.httpClient.post<any>(this.api + '/user/invited', request);
    }

    public getFrequenterUser(): Observable<any[]> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.get<any>(this.api + '/frequenter', { headers });
    }
}
