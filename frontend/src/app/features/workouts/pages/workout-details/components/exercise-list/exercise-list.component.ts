import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExerciseComponent } from '../exercise/exercise.component';
import { ExerciseModel } from '@workouts/domain/interfaces';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [ExerciseComponent, RouterLink, CommonModule],
  templateUrl: './exercise-list.component.html',
})
export class ExerciseListComponent {
  @Input() exercises: ExerciseModel[] = [];
  @Output() exerciseUpdated = new EventEmitter<ExerciseModel>();
  @Output() exerciseDeleted = new EventEmitter<number>();

  onExerciseUpdated(updatedExercise: ExerciseModel) {
    this.exerciseUpdated.emit(updatedExercise);
  }

  onExerciseDeleted(exerciseId: number) {
    this.exerciseDeleted.emit(exerciseId);
  }
}
