import {FeedbackModel} from './feedback.model';

export class ClaimModel {
  id?: number;
  claimNumber?: string;
  object?: string;
  status?: string;
  avatar?: string;
  description?: string;
  feedbacks: Array<FeedbackModel>;
}
