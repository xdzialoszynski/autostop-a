import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-pseudo',
  standalone: true,
  templateUrl: './pseudo.html',
  styleUrl: './pseudo.scss',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, ReactiveFormsModule]
})
export class Pseudo implements OnInit {


  disabled$: Observable<boolean> = new Observable<boolean>();
  pseudoCtrl!: FormControl<string | null>;

  constructor(private formBuilder: FormBuilder) { }

  savePseudo() {
    throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.pseudoCtrl = this.formBuilder.control('Pseudo');
    this.disabled$ = this.pseudoCtrl.valueChanges.pipe(
      map(value => !value || value.trim().length === 0),
      tap(value => console.log(value))
    )
  }
}
