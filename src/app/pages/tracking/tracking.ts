import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type OrderStatus = 'idle' | 'loading' | 'found' | 'not-found';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tracking.html',
  styleUrl: './tracking.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tracking {
  status: OrderStatus = 'idle';

  form = new FormBuilder().nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(5)]],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'loading';

    setTimeout(() => {
      const code = this.form.value.code?.toLowerCase();

      if (code === 'tochoko') {
        this.status = 'found';
      } else {
        this.status = 'not-found';
      }
    }, 800);
  }

  reset() {
    this.status = 'idle';
    this.form.reset();
  }
}
