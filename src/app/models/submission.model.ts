
import { Language } from './enums/language.enum';
import { SubmissionResult } from './enums/submission-result.enum';

export interface Submission {
  id: string;
  code: string;
  language: Language;
  result: SubmissionResult;
  submittedAt: string;
  personId: string;
  personName: string;
  problemId: string;
  problemTitle: string;
}

export interface CreateSubmissionDto {
  personId: string;
  problemId: string;
  code: string;
  language: Language;
}