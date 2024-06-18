import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ConvertComponent } from './convert/convert.component';
import { HttpClientModule } from '@angular/common/http';
import { FileManagerService } from './file-manager.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,ConvertComponent,HttpClientModule],
  providers:[FileManagerService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ConverterApp';
}
