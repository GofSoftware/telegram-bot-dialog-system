import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { PaymentProcessor } from './payment-processor';

export class CheckPreCheckoutStep extends BaseStep {
    constructor(id: string, protected payload: string, protected nextPreCheckoutStep: string, protected failedStep: string) {
        super(id);
        this.nextStep = failedStep;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        try {
            const paymentProcessor = PaymentProcessor.create(this.payload);
            const result = await paymentProcessor.preCheckout(context);
            if (result.processed === true && result.result === true) {
                this.nextStep = this.nextPreCheckoutStep;
            }
        } catch (error: any) {
            console.error(error);
        }
    }
}
