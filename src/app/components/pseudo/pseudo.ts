import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AppStateService } from '../../services/app-state-service';

@Component({
  selector: 'app-pseudo',
  standalone: true,
  templateUrl: './pseudo.html',
  styleUrl: './pseudo.scss',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, ReactiveFormsModule, MatIconModule]
})
export class Pseudo implements OnInit, OnDestroy {
  pseudoCtrl = new FormControl('Pseudo', [Validators.required, Validators.minLength(3)]);
  isEditing = false;
  pseudo$: Observable<string | null>;

  private destroy$ = new Subject<void>();

  constructor(private stateService: AppStateService) {
    this.pseudo$ = this.stateService.pseudo$;
  }

  ngOnInit(): void {
    this.pseudo$.pipe(takeUntil(this.destroy$)).subscribe(pseudo => {
      this.pseudoCtrl.setValue(pseudo || '');
    });
  }

  switchToEditMode(): void {
    this.isEditing = true;
  }

  savePseudo(): void {
    if (this.pseudoCtrl.invalid) {
      return;
    }
    const pseudo = this.pseudoCtrl.value;
    if (pseudo) {
      this.stateService.pseudo = pseudo;
      console.log(`Pseudo '${pseudo}' enregistré dans le state.`);
      this.isEditing = false;
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    // Réinitialiser la valeur du contrôle à celle du state
    this.pseudo$.pipe(take(1)).subscribe(pseudo => this.pseudoCtrl.setValue(pseudo));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
