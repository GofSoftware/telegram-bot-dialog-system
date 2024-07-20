import { BaseStep } from './_base/base-step';

export class WaitForUpdateStep extends BaseStep {
    constructor(id: string, nextStep: string) {
        super(id);
        this.waitForUpdate = true;
        this.nextStep = nextStep;
    }
}