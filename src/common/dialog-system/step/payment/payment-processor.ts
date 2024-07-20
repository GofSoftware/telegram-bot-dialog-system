import { ExecutionContext } from '../../../function/execution-context';
import { Payment } from '../../../../firestore/entity/payment';
import { UpdateExtractor } from '../../../../telegram/update-extractor';

export class PaymentProcessorResult {
    public static create(processed: boolean, result: boolean, paymentReceipt: Payment = null): PaymentProcessorResult {
        return new PaymentProcessorResult(processed, result, paymentReceipt);
    }
    private constructor(public processed: boolean, public result: boolean, public paymentReceipt: Payment) {
    }
}

export class PaymentProcessor {
    public static create(payload: string): PaymentProcessor {
        return new PaymentProcessor(payload);
    }

    private constructor(private payload: string) {
    }

    public async preCheckout(context: ExecutionContext): Promise<PaymentProcessorResult> {
        const preCheckoutQuery = UpdateExtractor.extractPreCheckoutQuery(context.update);
        if (preCheckoutQuery != null) {
            const isOk = preCheckoutQuery.invoice_payload === this.payload;
            const error = isOk ? null : 'Incorrect payload.';
            await context.telegramApi.answerPrecheckoutQuery(preCheckoutQuery.id, isOk, error);
            return PaymentProcessorResult.create(true, isOk);
        }
        return PaymentProcessorResult.create(false, false);
    }

    public async successfulPayment(context: ExecutionContext): Promise<PaymentProcessorResult> {
        const payment = UpdateExtractor.extractSuccessfulPayment(context.update);
        if(payment != null) {
            if (payment.invoice_payload !== this.payload) {
                return PaymentProcessorResult.create(true, false);
            }
            const paymentReceipt = new Payment(
                context.user.id, context.user.name, Date.now(), payment.total_amount, payment.invoice_payload, JSON.stringify(payment));
            return PaymentProcessorResult.create(true, true, paymentReceipt);
        }
        return PaymentProcessorResult.create(false, false);
    }
}
