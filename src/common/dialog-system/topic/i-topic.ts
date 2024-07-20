import { IStep } from '../step/_base/i-step';

export interface ITopic {
    getStep(id: string): IStep;
}