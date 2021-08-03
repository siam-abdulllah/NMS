import { Injectable } from '@angular/core';
//import { environment } from 'src/environments/environment';
import { IFileDto } from '../common/FileDto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  baseUrl = environment.apiUrl + 'File/';
  constructor(private http: HttpClient) { }

  downloadTempFile(file: any) {
    // const url = this.baseUrl + 'DownloadTempFile?fileType=' + file.fileType + '&fileToken=' + file.fileToken + '&fileName=' + file.fileName;
    // location.href = url; //TODO: This causes reloading of same page in Firefox
    return this.http.post(this.baseUrl + 'DownloadTempFile',file);
  }
}
