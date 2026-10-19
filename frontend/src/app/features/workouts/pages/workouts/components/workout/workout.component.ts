import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TrainingPlanModel } from '@workouts/domain/interfaces';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './workout.component.html',
})
export class WorkoutComponent {
  @Input() workout!: TrainingPlanModel;
}
