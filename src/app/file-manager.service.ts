import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  private apiUrl = 'https://localhost:7081/api/Convert';

  constructor(private http: HttpClient) { }

  rotatePdf(file: File, direction: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log(formData + "rotatePdf");
    return this.http.post(`${this.apiUrl}/Rotate-Pdf?rotationDirection=${direction}`, formData, { responseType: 'blob' });
  }

  splitPdf(file: File, pageRange: string, newFileName: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('sourceFile', file, file.name);
    console.log(formData +"splitPdf");
    return this.http.post(`${this.apiUrl}/Split?pageRange=${pageRange}&newFileName=${newFileName}`, formData, { responseType: 'blob' });
  }

  convertPdfToDocx(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('pdfFile', file, file.name);
    console.log(formData + "convertPdfToDocx");
    return this.http.post(`${this.apiUrl}/pdf-to-word`, formData, { responseType: 'blob' });
  }

  convertDocxToPdf(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log(formData + "convertDocxToPdf");
    return this.http.post(`${this.apiUrl}/word-to-pdf`, formData, { responseType: 'blob' });
  }
}