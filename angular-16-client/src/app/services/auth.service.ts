import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthPayload {
  username: string;
  password: string;
}

interface StoredCredentials {
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';
  private readonly storageKey = 'editor-auth';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, { username, password }, { responseType: 'text' });
  }

  login(username: string, password: string): Observable<string> {
    const payload: AuthPayload = { username, password };
    return this.http
      .post(`${this.baseUrl}/login`, payload, { responseType: 'text' })
      .pipe(tap(() => this.storeCredentials(username, password)));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  isAuthenticated(): boolean {
    return this.getCredentials() !== null;
  }

  getUsername(): string | null {
    const credentials = this.getCredentials();
    return credentials?.username ?? null;
  }

  getAuthHeader(): string | null {
    const credentials = this.getCredentials();
    if (!credentials) {
      return null;
    }
    return `Basic ${credentials.token}`;
  }

  private storeCredentials(username: string, password: string): void {
    const token = btoa(`${username}:${password}`);
    const credentials: StoredCredentials = { username, token };
    localStorage.setItem(this.storageKey, JSON.stringify(credentials));
  }

  private getCredentials(): StoredCredentials | null {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as StoredCredentials;
    } catch (error) {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
