import { UserModel } from '@auth/domain/interfaces';

export type ExerciseModel = {
  id: number;
  exerciseName: string;
  exerciseDescription?: string;
  seriesQuantity: number;
  repetitionsQuantity: number;
  trainingPlanId: number;
};

export type AddExerciseModel = Omit<ExerciseModel, 'id'>;

export type ExerciseLogModel = {
  id: number;
  user: UserModel;
  exercise: ExerciseModel;
  performedAt: number;
  series: number;
  repetitions: number;
  weight: number;
  duration: number;
  status: string;
};

export type TrainingPlanModel = {
  id: number;
  planName: string;
  planDescription?: string;
  duration: number;
  exerciseIds?: number[];
  userId?: number;
  newExercises?: ExerciseModel[];
};

export type AddTrainingPlanModel = Omit<TrainingPlanModel, 'id'>;

export type WeightModel = {
  value: number;
  recordAt: string;
};

export type WeightLogModel = {
  peso: number;
  dataRegistro: string;
};
