import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { createENV } from '@shared/utils/helpers';
import { catchError, Observable } from 'rxjs';
import { AddExerciseModel, ExerciseModel } from '../domain/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private API_URL: string = createENV('/exercicios');

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  createExercise(exercise: AddExerciseModel): Observable<ExerciseModel> {
    return this.http
      .post<ExerciseModel>(`${this.API_URL}/save`, exercise)
      .pipe(catchError(this.errorHandler.handle));
  }

  getExercises(): Observable<ExerciseModel[]> {
    return this.http
      .get<ExerciseModel[]>(this.API_URL)
      .pipe(catchError(this.errorHandler.handle));
  }

  getExerciseById(id: number): Observable<ExerciseModel> {
    return this.http
      .get<ExerciseModel>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.errorHandler.handle));
  }

  updateExercise(exercise: ExerciseModel): Observable<ExerciseModel> {
    return this.http
      .put<ExerciseModel>(`${this.API_URL}/${exercise.id}`, exercise)
      .pipe(catchError(this.errorHandler.handle));
  }

  deleteExercise(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.errorHandler.handle));
  }
}
