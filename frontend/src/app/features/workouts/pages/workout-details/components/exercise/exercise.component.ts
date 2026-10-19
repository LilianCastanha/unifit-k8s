import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ExerciseModel } from '@workouts/domain/interfaces';
import { ExerciseService } from '@workouts/services/exercise.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    InputNumberModule,
    DialogModule,
    FormsModule,
    InputTextModule,
  ],
  templateUrl: './exercise.component.html',
})
export class ExerciseComponent {
  @Input() exercise!: ExerciseModel;
  @Output() exerciseUpdated = new EventEmitter<ExerciseModel>();
  @Output() exerciseSaved = new EventEmitter<ExerciseModel>();
  @Output() exerciseDeleted = new EventEmitter<number>();

  editExerciseDialogVisible = false;
  deleteExerciseDialogVisible = false;
  selectedExercise: ExerciseModel = this.initializeSelectedExercise();

  constructor(
    private exerciseService: ExerciseService,
    private toastService: ToastrService
  ) {}

  private initializeSelectedExercise() {
    return {
      id: 0,
      exerciseName: '',
      exerciseDescription: '',
      seriesQuantity: 0,
      repetitionsQuantity: 0,
      trainingPlanId: 0,
    };
  }

  private isValidExercise(exercise: ExerciseModel): boolean {
    return !!(
      exercise.exerciseName &&
      exercise.exerciseDescription &&
      exercise.seriesQuantity > 0 &&
      exercise.repetitionsQuantity > 0
    );
  }

  showEditExerciseDialog() {
    this.selectedExercise = { ...this.exercise };
    this.editExerciseDialogVisible = true;
  }

  hideEditExerciseDialog() {
    this.editExerciseDialogVisible = false;
  }

  saveExercise() {
    const isValidExercise = this.isValidExercise(this.selectedExercise);

    if (!isValidExercise) {
      this.toastService.error('Preencha os campos obrigatórios');
      return;
    }

    this.exerciseService.updateExercise(this.selectedExercise).subscribe({
      next: updatedExercise => {
        this.exerciseUpdated.emit(updatedExercise);
        this.hideEditExerciseDialog();
        this.toastService.success('Exercício atualizado com sucesso');
      },
      error: () => {
        this.toastService.error('Ocorreu um erro ao atualizar o exercício');
      },
    });
  }

  showDeleteExerciseDialog() {
    this.deleteExerciseDialogVisible = true;
  }

  hideDeleteExerciseDialog() {
    this.deleteExerciseDialogVisible = false;
  }

  deleteExercise() {
    this.exerciseService.deleteExercise(this.exercise.id).subscribe({
      next: () => {
        this.exerciseDeleted.emit(this.exercise.id);
        this.hideDeleteExerciseDialog();
        this.toastService.success('Exercício deletado com sucesso');
      },
      error: () => {
        this.toastService.error('Ocorreu um erro ao deletar o exercício');
      },
    });
  }
}
