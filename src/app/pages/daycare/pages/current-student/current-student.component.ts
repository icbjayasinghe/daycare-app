import { Component, OnInit } from '@angular/core';
import {
  DayCareEnrollmentDto,
  EnrollmentStatus,
} from 'src/app/models/enrollment.model';
import { EnrollmentService } from 'src/app/services/enrollment.service';

@Component({
  selector: 'app-current-student',
  templateUrl: './current-student.component.html',
  styleUrls: ['./current-student.component.css'],
})
export class CurrentStudentComponent implements OnInit {
  readonly daycareEmail = localStorage.getItem('userEmail') || '';
  enrollments: DayCareEnrollmentDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private readonly enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.loadCompletedEnrollments();
  }

  loadCompletedEnrollments(): void {
    if (!this.daycareEmail) {
      this.errorMessage = 'Unable to identify the signed-in daycare.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.enrollmentService
      .getMyEnrollmentsByStatus(
        '',
        this.daycareEmail,
        EnrollmentStatus.COMPLETED,
      )
      .subscribe({
        next: (enrollments) => {
          this.enrollments = enrollments.filter(
            (enrollment) => enrollment.status === EnrollmentStatus.COMPLETED,
          );
          this.loading = false;
        },
        error: () => {
          this.errorMessage =
            'Unable to load completed enrollments. Please try again.';
          this.loading = false;
        },
      });
  }
}
