import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'ri-file-dialog',
	template: `
	<h1 mat-dialog-title>{{data.title}}</h1>
	<div mat-dialog-content>
		<p [innerHTML]="data.message"></p>
	</div>
	<div mat-dialog-actions>
		<button mat-button (click)="onNoClick()">No</button>
		<button mat-button cdkFocusInitial color="warn" [mat-dialog-close]="true">Yes</button>
	</div>
`
})
export class FileConfirmDialog {

	constructor(
		public dialogRef: MatDialogRef<FileConfirmDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	onNoClick(): void {
		this.dialogRef.close();
	}
}