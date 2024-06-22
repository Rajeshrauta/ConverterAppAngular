import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagerService } from '../file-manager.service';
import { saveAs } from 'file-saver-es';

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
export class ConvertComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  acceptedFileTypes: string = '';
  selectedFileType: string = '';
  selectedFile: File | null = null;
  showSplitOptions: boolean = false;
  splits: SplitInput[] = [{ pageRange: '', newFileName: '' }];

  constructor(private fileManagerService: FileManagerService) { }

  ngAfterViewInit(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.style.display = 'none';
    }
  }

  onFileTypeChange(event: any): void {
    this.selectedFileType = event.target.value;
    this.acceptedFileTypes = this.selectedFileType === 'pdf' ? '.pdf' : '.docx';
    this.clearFileInput();
  }

  clearFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.style.display = 'block';
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
          console.log("split called")
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
    const ranges = range.split(',');
    const singlePageRegex = /^\d+$/;
    const pageRangeRegex = /^\d+-\d+$/;

    for (let part of ranges) {
      part = part.trim();
      if (!singlePageRegex.test(part) && !pageRangeRegex.test(part)) {
        return false;
      }
      if (pageRangeRegex.test(part)) {
        const [start, end] = part.split('-').map(Number);
        if (start > end) {
          return false;
        }
      }
    }
    return true;
  }
}