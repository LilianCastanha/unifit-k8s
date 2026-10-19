import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkoutListComponent } from '../workouts/components/workout-list/workout-list.component';
import { ButtonModule } from 'primeng/button';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ExerciseListComponent } from './components/exercise-list/exercise-list.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TitleComponent } from '@shared/components/title/title.component';
import { TooltipModule } from 'primeng/tooltip';
import {
  AddExerciseModel,
  ExerciseModel,
  TrainingPlanModel,
} from '../../domain/interfaces';
import { TrainingPlansService } from '../../services/training-plans.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-workout-details',
  standalone: true,
  imports: [
    WorkoutListComponent,
    ButtonModule,
    RouterLink,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    ExerciseListComponent,
    ConfirmDialogModule,
    TitleComponent,
    TooltipModule,
  ],
  templateUrl: './workout-details.component.html',
})
export class WorkoutDetailsComponent implements OnInit, OnDestroy {
  workout: TrainingPlanModel = this.initializeWorkout();
  newExercise: AddExerciseModel = this.initializeNewExercise();
  exercises: ExerciseModel[] = [];
  editWorkout: TrainingPlanModel = this.initializeWorkout();

  isExerciseDialogVisible = false;
  isEditWorkoutDialogVisible = false;
  isDeleteWorkoutVisible = false;
  isWorkoutTimerVisible = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutsService: TrainingPlansService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.loadWorkoutDetails();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initializeWorkout(): TrainingPlanModel {
    return {
      id: 0,
      planName: '',
      planDescription: '',
      duration: 0,
      newExercises: [],
    };
  }

  private initializeNewExercise(): AddExerciseModel {
    return {
      exerciseName: '',
      exerciseDescription: '',
      seriesQuantity: 1,
      repetitionsQuantity: 1,
      trainingPlanId: this.workout.id,
    };
  }

  private resetEditWorkout() {
    this.editWorkout = {
      ...this.workout,
    };
  }

  private loadWorkoutDetails() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.toastService.error('Plano de treino não encontrado');
      this.router.navigate(['/app/workouts']);
      return;
    }

    const workoutSubscription = this.workoutsService
      .getTrainingPlanById(Number(id))
      .subscribe({
        next: workout => {
          this.workout = workout;
          this.exercises = workout.newExercises || [];
          this.resetEditWorkout();
        },
        error: () => {
          this.toastService.error('Erro ao carregar o plano de treino');
          this.router.navigate(['/app/workouts']);
        },
      });

    this.subscription.add(workoutSubscription);
  }

  private isValidExercise(exercise: AddExerciseModel): boolean {
    return !!(
      exercise.exerciseName &&
      exercise.exerciseDescription &&
      exercise.seriesQuantity > 0 &&
      exercise.repetitionsQuantity > 0
    );
  }

  private isValidWorkout(workout: TrainingPlanModel): boolean {
    return !!(
      workout.planName &&
      workout.planDescription &&
      workout.duration > 0
    );
  }

  showExerciseDialog() {
    this.isExerciseDialogVisible = true;
  }

  hideExerciseDialog() {
    this.isExerciseDialogVisible = false;
    this.newExercise = this.initializeNewExercise();
  }

  showEditWorkoutDialog(): void {
    this.isEditWorkoutDialogVisible = true;
  }

  hideEditWorkoutDialog(): void {
    this.isEditWorkoutDialogVisible = false;
    this.resetEditWorkout();
  }

  hideDeleteWorkoutDialog(): void {
    this.isDeleteWorkoutVisible = false;
  }

  showDeleteWorkoutDialog(): void {
    this.isDeleteWorkoutVisible = true;
  }

  handleSaveExercise() {
    const isValidExercise = this.isValidExercise(this.newExercise);

    if (!isValidExercise) {
      this.toastService.error('Preencha os campos obrigatórios');
      return;
    }

    const saveExerciseSubscription = this.workoutsService
      .createExercise(this.workout.id, this.newExercise)
      .subscribe({
        next: newExercise => {
          this.exercises.push(newExercise);
          this.hideExerciseDialog();
          this.newExercise = this.initializeNewExercise();
          this.toastService.success('Exercício adicionado com sucesso');
        },
        error: () => {
          this.toastService.error('Erro ao adicionar exercício');
        },
      });

    this.subscription.add(saveExerciseSubscription);
  }

  handleSaveWorkout() {
    const isValidWorkout = this.isValidWorkout(this.editWorkout);

    if (!isValidWorkout) {
      this.toastService.error('Plano de treino inválido');
      return;
    }

    const saveWorkoutSubscription = this.workoutsService
      .updateTrainingPlan(this.editWorkout)
      .subscribe({
        next: updatedWorkout => {
          this.workout = updatedWorkout;
          this.hideEditWorkoutDialog();
        },
        error: () => {
          this.toastService.error('Erro ao salvar plano de treino');
        },
      });

    this.subscription.add(saveWorkoutSubscription);
  }

  handleDeleteWorkout() {
    this.hideDeleteWorkoutDialog();
    const deleteWorkoutSubscription = this.workoutsService
      .deleteTrainingPlan(this.workout.id)
      .subscribe({
        next: () => {
          this.router.navigate(['/app/workouts']);
          this.toastService.success('Plano de treino deletado com sucesso');
        },
        error: () => {
          this.toastService.error('Erro ao deletar plano de treino');
        },
      });

    this.subscription.add(deleteWorkoutSubscription);
  }

  onExerciseUpdated(updatedExercise: ExerciseModel) {
    const updatedExercises = this.exercises.map(exercise =>
      exercise.id === updatedExercise.id ? updatedExercise : exercise
    );

    this.exercises = updatedExercises;
  }

  onExerciseDeleted(exerciseId: number) {
    const updatedExercises = this.exercises.filter(
      exercise => exercise.id !== exerciseId
    );

    this.exercises = updatedExercises;
  }
}
