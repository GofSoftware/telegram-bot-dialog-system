import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { ContextCall } from '../_base/context-call';

export class SetUserPropertyStep<C extends ExecutionContext = ExecutionContext> extends BaseStep {
    constructor(
            id: string,
            nextStep: string,
            private propertyName: string,
            private propertyValue: any | ContextCall<void, C>,
            private validation: ((context: C, value: any) => Promise<boolean>) = null,
            private failStep: string) {
        super(id);
        this.nextStep = nextStep;
    }

    public async invoke(context: C): Promise<void> {

        const value = (typeof this.propertyValue === 'function') ? await this.propertyValue(context) : this.propertyValue;
        if (this.validation != null) {
            if (await this.validation(context, value) !== true) {
                this.nextStep = this.failStep;
                return;
            }
        }
        // todo vetal create type with all accessible user properties.
        (context.user as any)[this.propertyName] = value;
    }
}
