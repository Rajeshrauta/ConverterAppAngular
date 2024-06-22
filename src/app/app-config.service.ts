import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  async loadConfig() {
    try {
      const config = await firstValueFrom(this.http.get('/assets/config.json'));
      this.config = config;
    } catch (err) {
      console.error('Could not load config file', err);
    }
  }

  get apiUrl(): string {
    return this.config?.apiUrl;
  }
}
