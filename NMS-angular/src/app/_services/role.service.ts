import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  baseUrl = environment.apiUrl + 'RoleInfo/';

  constructor(private http: HttpClient) {

  }
  createRoleInfo(model: any) {
    return this.http.post(this.baseUrl + 'CreateRoleInfo', model);
  }

  getAllRoleInfos(fltr: any) {
    return this.http.post(this.baseUrl + 'GetAllRoleInfos', fltr);
  }

  getRoleInfoById(id: number) {
    return this.http.get(this.baseUrl  + 'GetRoleInfo/'+ id);
  }
  editRoleInfo(model: any, id: number) {
    return this.http.put(this.baseUrl + 'EditRoleInfo/' + id, model);
  }
  deleteRoleInfo(id: number) {
    return this.http.delete(this.baseUrl + 'DeleteRoleInfo/' + id);
  }
}
