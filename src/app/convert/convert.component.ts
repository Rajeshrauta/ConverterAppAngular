import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagerService } from '../file-manager.service';
import { saveAs } from 'file-saver';

interface SplitInput {
  pageRange: string;
  newFileName: string;
}
@Component({
  selector: 'app-convert',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './convert.component.html',
  styleUrl: './convert.component.scss'
})
export class ConvertComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  acceptedFileTypes: string = '';
  selectedFileType: string = '';
  selectedFile: File | null = null;
  showSplitOptions: boolean = false;
  splits: SplitInput[] = [{ pageRange: '', newFileName: '' }];

  constructor(private fileManagerService: FileManagerService) { }

  onFileTypeChange(event: any): void {
    this.selectedFileType = event.target.value;
    this.acceptedFileTypes = this.selectedFileType === 'pdf' ? '.pdf' : '.docx';
    this.clearFileInput();
  }

  clearFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.selectedFile = null;
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.selectedFile = target.files[0];
    }
  }

  rotatePdf(direction: string): void {
    if (this.selectedFile) {
      this.fileManagerService.rotatePdf(this.selectedFile, direction).subscribe(response => {
        saveAs(response, `rotated_${direction}_${this.selectedFile!.name}`);
      }, error => {
        console.error('Error rotating PDF:', error);
      });
    }
  }

  toggleSplitOptions(): void {
    this.showSplitOptions = !this.showSplitOptions;
    if (this.showSplitOptions) {
      this.splits = [{ pageRange: '', newFileName: '' }];
    } else {
      this.splits = [];
    }
  }

  addSplitRow(): void {
    const lastSplit = this.splits[this.splits.length - 1];
    if (lastSplit && lastSplit.pageRange.trim() !== '' && this.isValidPageRange(lastSplit.pageRange.trim())) {
      this.splits.push({ pageRange: '', newFileName: '' });
    }
  }

  removeSplit(index: number): void {
    this.splits.splice(index, 1);
    if (this.splits.length === 0) {
      this.toggleSplitOptions();
    }
  }

  splitPdf(): void {
    if (this.selectedFile) {
      this.splits.forEach(split => {
        if (split.pageRange.trim() !== '' && this.isValidPageRange(split.pageRange.trim())) {
          this.fileManagerService.splitPdf(this.selectedFile!, split.pageRange, split.newFileName).subscribe({
            next: (response) => {
              const name = split.newFileName ? `${split.newFileName}.pdf` : `split_${this.selectedFile!.name}`;
              saveAs(response, name);
            },
            error: (err) => {
              console.error('Error splitting PDF:', err);
            }
          });
        }
      });
    }
  }

  convertPdfToDocx(): void {
    if (this.selectedFile) {
      this.fileManagerService.convertPdfToDocx(this.selectedFile).subscribe(response => {
        saveAs(response, `${this.selectedFile!.name.replace('.pdf', '.docx')}`);
      }, error => {
        console.error('Error converting PDF to DOCX:', error);
      });
    }
  }

  convertDocxToPdf(): void {
    if (this.selectedFile) {
      this.fileManagerService.convertDocxToPdf(this.selectedFile).subscribe(response => {
        saveAs(response, `${this.selectedFile!.name.replace('.docx', '.pdf')}`);
      }, error => {
        console.error('Error converting DOCX to PDF:', error);
      });
    }
  }

  isValidPageRange(range: string): boolean {
    // Check if range is a valid integer
    const isValidInteger = /^\d+$/.test(range);
    return isValidInteger;
  }
}