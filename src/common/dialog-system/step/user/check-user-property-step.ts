import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';

export class CheckUserPropertyStep extends BaseStep {
    constructor(id: string, private propertyName: string, private successStep: string, private failStep: string) {
        super(id);
        this.nextStep = successStep;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        if((context.user as any)[this.propertyName] == null) {
            this.nextStep = this.failStep;
        }
    }
}
