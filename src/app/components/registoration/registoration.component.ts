import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DeviceService, Device } from '../../services/device.service'; // Adjust path as needed
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // ✅ import this

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-registoration',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    NgIf,
    NgFor,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './registoration.component.html',
  styleUrl: './registoration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistorationComponent  implements OnInit {
  private deviceService = inject(DeviceService);
  private cdr = inject(ChangeDetectorRef);

  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 20];

  selectedDevie = new FormControl('', Validators.required);

  deviceData: Device[] = [];
  responseMessage: string = '';

  displayedColumns: string[] = ['id', 'serialNumber', "status", 'timestamp'];

  ngOnInit(): void {
    this.loadDeviceData(this.currentPage, this.pageSize);
  }
  

  loadDeviceData(page: number, size: number): void {
    this.deviceService.getDevicesByPagination(page, size).subscribe({
      next: (res) => {
        this.deviceData = res.content || [];
        this.totalElements = res.totalElements || 0;
        this.responseMessage = ''; // Clear old error
        this.cdr.markForCheck(); // Mark for change detection
      },
      error: (err) => {
        if (err.status === 404) {
          this.deviceData = [];
          this.totalElements = 0;
          this.responseMessage = 'No devices found.';
        } else if (err.status === 500) {
          this.responseMessage = 'Server error while loading devices.';
        } else {
          this.responseMessage = 'Unexpected error occurred.';
        }
        this.cdr.markForCheck(); // Mark for change detection
      }
    });
  }
  
  

  createDevice(): void {
    this.deviceService.generateDevice().subscribe({
      next: (newDevice) => {
        this.deviceData.unshift(newDevice);
        this.responseMessage = `Device ${newDevice.serialNumber} created`; // Fixed template literal
        this.totalElements++;
        this.currentPage = 0;
        this.loadDeviceData(this.currentPage, this.pageSize);
        this.cdr.markForCheck();
      },
      error: () => {
        this.responseMessage = 'Failed to create device';
        this.cdr.markForCheck();
      }
    });
  }

  deleteDevice(id: number): void {
    this.deviceService.deleteDevice(id).subscribe({
      next: () => {
        this.deviceData = this.deviceData.filter(d => d.id !== id);
        this.totalElements--;
        this.responseMessage = `Device ${id} deleted`; // Fixed template literal
        this.cdr.markForCheck();
      },
      error: () => {
        this.responseMessage = 'Failed to delete device';
        this.cdr.markForCheck();
      }
    });
  }

  formatTimestamp(timestamp?: string): string {
    return timestamp ? new Date(timestamp).toLocaleString() : '';
  }

  onPageSizeChange() {
    this.currentPage = 0;
    this.loadDeviceData(this.currentPage, this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadDeviceData(this.currentPage, this.pageSize);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages() - 1) {
      this.currentPage++;
      this.loadDeviceData(this.currentPage, this.pageSize);
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}
