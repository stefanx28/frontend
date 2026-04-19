import { Language } from "./enums/language.enum";
import { SubmissionResult } from "./enums/submission-result.enum";
export interface Submission {
  id: string;
  code: string;
  language: Language;       
  result: SubmissionResult;  
  problemId: string;
}


export type CreateSubmissionDTO = Omit<Submission, 'id'>;
export type UpdateSubmissionDTO = Omit<Submission, 'id'>;