import { IStep } from '../step/_base/i-step';
import { ITopic } from './i-topic';

export class BaseTopic implements ITopic {
    protected steps: Map<string, IStep> = new Map<string, IStep>();
    protected stepIdAutoIncrement = 0;

    public registerStep(step: IStep): string {
        step.id = step.id == null ? (++this.stepIdAutoIncrement).toString() : step.id;
        this.steps.set(step.id, step);
        return step.id;
    }

    public getStep(id: string): IStep {
        if (!this.steps.has(id)) {
            throw new Error(`Step with id ${id} doesn't exist.`);
        }
        return this.steps.get(id);
    }
}