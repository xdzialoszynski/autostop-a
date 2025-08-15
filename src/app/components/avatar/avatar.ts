import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppStateService } from '../../services/app-state-service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-avatar',
  imports: [CommonModule, MatIconModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss'
})
export class Avatar {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  isEditing: any;
  avatar$!: Observable<Base64URLString | null>;

  constructor(private service: AppStateService) {
    this.avatar$ = this.service.avatar$;
  }

  onClick() {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event) {
    if (!event.target || !(event.target instanceof HTMLInputElement) || !event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      this.service.avatar = reader.result as Base64URLString;
    };
    reader.readAsDataURL(file);
    console.log(file);
  }
}
