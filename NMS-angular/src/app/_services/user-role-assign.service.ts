import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleAssignService {

  baseUrl = environment.apiUrl + 'UserRoleConf/';

  constructor(private http: HttpClient) {

  }
  createUserRoleConf(model: any) {
    return this.http.post(this.baseUrl + 'CreateUserRoleConf', model);
  }

  getAllUserRoleConfs(fltr: any) {
    return this.http.post(this.baseUrl + 'GetAllUserRoleConfs', fltr);
  }

  getUserRoleConfById(id: number) {
    return this.http.get(this.baseUrl  + 'GetUserRoleConf/'+ id);
  }
  editUserRoleConf(model: any, id: number) {
    return this.http.put(this.baseUrl + 'EditUserRoleConf/' + id, model);
  }
  deleteUserRoleConf(id: number) {
    return this.http.delete(this.baseUrl + 'DeleteUserRoleConf/' + id);
  }
  getAllUserForLookupTable(fltr:any){
    return this.http.post(this.baseUrl + 'GetAllUserForLookupTable', fltr);
  }
  getAllRoleForLookupTable(fltr:any){
    return this.http.post(this.baseUrl + 'GetAllRoleForLookupTable', fltr);
  }
}
