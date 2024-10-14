import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  onSubmit() {
    if (this.contactForm.valid) {
      const name = this.contactForm.get('name')?.value;
      const email = this.contactForm.get('email')?.value;
      const message = this.contactForm.get('message')?.value;

      const whatsappMessage = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

      // Replace the '+' with '%2B' to properly encode it for a URL if the phone number starts with a '+'.
      const phoneNumber = encodeURIComponent(environment.phoneNumber);

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
        whatsappMessage
      )}`;

      // Open the WhatsApp URL in a new tab
      window.open(whatsappUrl, '_blank');
    } else {
      // If the form is invalid, mark all controls as touched to trigger validation messages
      this.contactForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }
}
