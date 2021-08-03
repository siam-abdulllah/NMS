import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    baseUrl = environment.apiUrl + 'Auth/';
    constructor( private http: HttpClient) {}
    register(model) {
        return this.http.post(this.baseUrl + 'RegisterImporter', model, {
            headers: new HttpHeaders({
                Accept : '*/*'
              })
        });
    }
    UploadImporterFile(formData: FormData, id: number) {
        console.log(formData);
        return this.http.post(this.baseUrl + 'UploadImporterFile/' + id, formData);
    }
    isUsernameAvailable(model: any) {
        return this.http.post(this.baseUrl + 'IsUsernameAvailable', model);
    }
    updateInfo(model: any) {
        return this.http.post(this.baseUrl + 'UpdateImporterInfo', model);
    }
    updateNidFile(formData: FormData, id: number) {
        return this.http.post(this.baseUrl + 'UpdateNidFile/' + id, formData);
    }
    verifyCurrentPassword(model: any) {
        return this.http.post(this.baseUrl + 'VerifyCurrentPassword', model);
    }
    verifyCurrentPasswordEmployee(model: any) {
        return this.http.post(this.baseUrl + 'VerifyCurrentPasswordEmployee', model);
    }
    changePassword(model: any) {
        return this.http.post(this.baseUrl + 'ChangePassword', model);
    }
    changePasswordEmployee(model: any) {
        return this.http.post(this.baseUrl + 'ChangePasswordEmployee', model);
    }
    changePasswordAdminSide(model: any) {
        
        return this.http.post(this.baseUrl + 'ChangePasswordAdminSide', model);
    }
    changePasswordAdminSideEmployee(model: any) {
        
        return this.http.post(this.baseUrl + 'ChangePasswordAdminSideEmployee', model);
    }
}
