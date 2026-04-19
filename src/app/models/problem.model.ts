import { Difficulty } from "./enums/difficulty.enum";

export interface Problem{
    id: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    solverCount?: number;
}

export type CreateProblemDTO = Omit<Problem, 'id'>;
export type UpdateProblemDTO = Omit<Problem, 'id'>;