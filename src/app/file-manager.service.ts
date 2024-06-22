import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  private apiUrl: string | undefined;
  //private apiUrl = 'http://localhost:8001/api/Convert';
  private appConfigService = inject(AppConfigService);

  constructor(private http: HttpClient) {
    this.apiUrl = this.appConfigService.apiUrl;
  }

  rotatePdf(file: File, direction: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log("called rotatePdf");
    return this.http.post(`${this.apiUrl}/rotate-pdf?rotationDirection=${direction}`, formData, { responseType: 'blob' });
  }

  splitPdf(file: File, pageRange: string, newFileName: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('sourceFile', file, file.name);
    console.log("called splitPdf");
    return this.http.post(`${this.apiUrl}/split?pageRange=${pageRange}&newFileName=${newFileName}`, formData, { responseType: 'blob' });
  }

  convertPdfToDocx(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('pdfFile', file, file.name);
    console.log("called convertPdfToDocx");
    return this.http.post(`${this.apiUrl}/pdf-to-word`, formData, { responseType: 'blob' });
  }

  convertDocxToPdf(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log("called convertDocxToPdf");
    return this.http.post(`${this.apiUrl}/word-to-pdf`, formData, { responseType: 'blob' });
  }
}