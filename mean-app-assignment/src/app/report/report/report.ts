import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth-service';
import { ApiService, ApiObject } from '../../services/api-service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-report',
  imports: [CommonModule, FormsModule], 
  templateUrl: './report.html',
  styleUrls: ['./report.css']
})
export class ReportComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  objects = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  infoMessage = signal<string>('');

  // Track which object is being edited
  editingId = signal<string | null>(null);
  
  // Store the edited values
  editedName = signal<string>('');
  editedColor = signal<string>('');
  editedCapacity = signal<string>('');
  editedPrice = signal<number | null>(null);

  ngOnInit(): void {
    this.loadObjects();
  }

  loadObjects(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.apiService.getAllObjects().subscribe({
      next: (data) => {
        console.log('Data loaded successfully:', data);
        this.objects.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading objects:', error);
        this.errorMessage.set('Failed to load data: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

  getPriceDisplay(object: any): string {
    return object?.data?.price !== undefined && object?.data?.price !== null 
      ? '$' + object.data.price 
      : 'N/A';
  }

  getProperty(object: any, property: string): string {
    return object?.data?.[property] !== undefined && object?.data?.[property] !== null 
      ? String(object.data[property]) 
      : 'N/A';
  }

  // Start inline editing for a specific object
  startEdit(object: any): void {
    this.editingId.set(object.id);
    this.editedName.set(object.name || '');
    this.editedColor.set(object.data?.color || '');
    this.editedCapacity.set(object.data?.capacity || '');
    this.editedPrice.set(object.data?.price || null);
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingId.set(null);
    this.editedName.set('');
    this.editedColor.set('');
    this.editedCapacity.set('');
    this.editedPrice.set(null);
  }

  // Save the edited values
  saveEdit(): void {
    const editingId = this.editingId();
    if (!editingId) return;

    const originalObject = this.objects().find(obj => obj.id === editingId);
    if (!originalObject) return;

    const updatedObject = {
      ...originalObject,
      name: this.editedName() || originalObject.name,
      data: {
        ...originalObject.data,
        color: this.editedColor() || originalObject.data?.color,
        capacity: this.editedCapacity() || originalObject.data?.capacity,
        price: this.editedPrice() !== null ? this.editedPrice() : originalObject.data?.price
      }
    };

    this.updateObject(editingId, updatedObject);
  }

  updateObject(id: string, updatedObject: any): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.infoMessage.set('');

    this.apiService.updateObject(id, updatedObject).subscribe({
      next: (result) => {
        console.log('Update successful (simulated):', result);
        this.objects.update(currentObjects => 
          currentObjects.map(obj => obj.id === id ? result : obj)
        );
        this.isLoading.set(false);
        this.editingId.set(null); // Exit edit mode
        this.successMessage.set('Object updated successfully!');
        this.infoMessage.set('Note: Updates are simulated locally since the API is read-only.');
        setTimeout(() => {
          this.successMessage.set('');
          this.infoMessage.set('');
        }, 5000);
      },
      error: (error) => {
        console.error('Update failed:', error);
        this.isLoading.set(false);
        this.errorMessage.set('Update failed: ' + error.message);
        setTimeout(() => this.errorMessage.set(''), 5000);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  clearMessage(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.infoMessage.set('');
  }
}