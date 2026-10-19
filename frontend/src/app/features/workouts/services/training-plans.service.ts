import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { createENV } from '@shared/utils/helpers';
import {
  AddExerciseModel,
  AddTrainingPlanModel,
  ExerciseModel,
  TrainingPlanModel,
} from '../domain/interfaces';
import { ErrorHandlerService } from '@core/services/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class TrainingPlansService {
  private readonly API_URL: string = createENV('/planos-treino');
  private readonly http = inject(HttpClient);

  constructor(private errorHandler: ErrorHandlerService) {}

  createTrainingPlan(
    trainingPlan: AddTrainingPlanModel
  ): Observable<TrainingPlanModel> {
    return this.http
      .post<TrainingPlanModel>(`${this.API_URL}/save`, trainingPlan)
      .pipe(catchError(this.errorHandler.handle));
  }

  getUserTrainingPlans(): Observable<TrainingPlanModel[]> {
    return this.http
      .get<TrainingPlanModel[]>(`${this.API_URL}`)
      .pipe(catchError(this.errorHandler.handle));
  }

  getTrainingPlanById(id: number): Observable<TrainingPlanModel> {
    return this.http
      .get<TrainingPlanModel>(`${this.API_URL}/${id}/exercise`)
      .pipe(catchError(this.errorHandler.handle));
  }

  updateTrainingPlan(
    trainingPlan: TrainingPlanModel
  ): Observable<TrainingPlanModel> {
    return this.http
      .put<TrainingPlanModel>(
        `${this.API_URL}/${trainingPlan.id}`,
        trainingPlan
      )
      .pipe(catchError(this.errorHandler.handle));
  }

  deleteTrainingPlan(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.errorHandler.handle));
  }

  createExercise(
    trainingPlanId: number,
    exercise: AddExerciseModel
  ): Observable<ExerciseModel> {
    return this.http
      .post<ExerciseModel>(
        `${this.API_URL}/${trainingPlanId}/exercise`,
        exercise
      )
      .pipe(catchError(this.errorHandler.handle));
  }
}
