import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService, ApiObject } from '../../services/api-service';

@Component({
  selector: 'app-edit-dialog',
  imports: [CommonModule, FormsModule], // Add required modules
  templateUrl: './edit-dialog.html',
  styleUrls: ['./edit-dialog.css']
})
export class EditDialogComponent {
  editedObject: ApiObject;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { object: ApiObject },
    private apiService: ApiService
  ) {
    // Create a deep copy of the object for editing
    this.editedObject = {
      ...data.object,
      data: data.object.data ? { ...data.object.data } : { color: '', capacity: '', price: undefined }
    };
  }

  onSave(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.updateObject(this.editedObject.id, this.editedObject).subscribe({
      next: (updatedObject) => {
        this.isLoading = false;
        this.dialogRef.close(updatedObject);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to update object. Please try again.';
        console.error('Error updating object:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}