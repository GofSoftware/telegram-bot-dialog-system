import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { PaymentProcessor } from './payment-processor';
import { Payment } from '../../../../firestore/entity/payment';

export class CheckPreCheckoutOrPaymentStep extends BaseStep {
    constructor(
            id: string,
            protected payload: string,
            protected nextPreCheckoutStep: string,
            protected nextPaymentStep: string,
            protected failedStep: string,
            private saveReceiptCallback: (context: ExecutionContext, receipt: Payment) => Promise<void>) {
        super(id);
        this.nextStep = this.failedStep;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        try {
            const paymentProcessor = PaymentProcessor.create(this.payload);
            let result = await paymentProcessor.preCheckout(context);
            if (result.processed === true && result.result === true) {
                this.nextStep = this.nextPreCheckoutStep;
            }

            result = await paymentProcessor.successfulPayment(context);
            if (result.processed === true && result.result === true) {
                if(this.saveReceiptCallback != null) {
                    await this.saveReceiptCallback(context, result.paymentReceipt);
                }
                this.nextStep = this.nextPaymentStep;
            }
        } catch (error: any) {
            console.error(error);
        }
    }
}
