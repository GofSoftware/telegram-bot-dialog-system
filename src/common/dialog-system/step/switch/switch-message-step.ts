import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { IRegexpToStepId } from './i-regexp-to-step-id';
import { UpdateExtractor } from '../../../../telegram/update-extractor';

export class SwitchMessageStep extends BaseStep {
    constructor(id: string, protected testData: IRegexpToStepId[], protected defaultStep: string) {
        super(id);
        this.nextStep = this.defaultStep;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        const message = UpdateExtractor.extractMessage(context.update);
        if (message == null) {
            return;
        }
        for(const item of this.testData) {
            const regexp = (item.regexp instanceof RegExp) ? item.regexp : new RegExp(item.regexp);
            if (regexp.test(message) === true) {
               this.nextStep = item.stepId;
               return;
            }
        }
    }
}
