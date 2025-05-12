import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  public apiBaseURL = environment.apiURL;
  personForm!: FormGroup;
  public allPersons: any[] = [];
  constructor(private fb: FormBuilder,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.required, Validators.min(1)]],
      gender: ['', Validators.required],
    });

    this.fetchPersons();
  }

  public fetchPersons(): void {
    this.http.get<any[]>(`${this.apiBaseURL}/person`).subscribe({
      next: (res) => {
        this.allPersons = res;
      },
      error: (err) => console.error('Error fetching persons:', err)
    });
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      const formData = this.personForm.value;
      this.http.post(`${this.apiBaseURL}/person`, formData)
        .subscribe(response => {
          console.log('Form submitted successfully', response);
          this.fetchPersons();
        }, error => {
          console.error('Error submitting form', error);
        });
    } else {                                                  
      console.log('Form is invalid');
    }
  }
}
