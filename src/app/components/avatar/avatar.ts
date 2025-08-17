import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppStateService } from '../../services/app-state-service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

type Base64URLString = string;

@Component({
  selector: 'app-avatar',
  imports: [CommonModule, MatIconModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss'
})
export class Avatar {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  avatar$!: Observable<Base64URLString | null>;

  constructor(private service: AppStateService) {
    this.avatar$ = this.service.avatar$;
  }

  onClick() {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.onloadend = () => {
      this.service.avatar = reader.result as Base64URLString;
    };
    reader.readAsDataURL(file);
  }
}
