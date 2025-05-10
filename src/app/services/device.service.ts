import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Device {
  id?: number;
  serialNumber: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})

export class DeviceService {

  private baseUrl = environment.api.devices;

  constructor(private http: HttpClient) { }

  generateDevice(): Observable<Device> {
    return this.http.post<Device>(`${this.baseUrl}/generate`, {});
  }

  getDeviceById(id: number): Observable<Device> {
    return this.http.get<Device>(`${this.baseUrl}/${id}`);
  }

  updateDeviceStatus(id: number, active: boolean): Observable<Device> {
    const params = new HttpParams().set('active', active);
    return this.http.put<Device>(`${this.baseUrl}/${id}/status`, null, { params });
  }

  deleteDevice(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getAllDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.baseUrl}`);
  }

  getDevicesByPagination(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseUrl}/getDevicesByPagination`, { params });
  }
}
