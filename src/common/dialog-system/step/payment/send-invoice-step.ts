import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { LabeledPrice } from 'node-telegram-bot-api';

export class SendInvoiceStep extends BaseStep {
    constructor(
            id: string,
            nextStep: string,
            protected title: string,
            protected description: string,
            protected payload: string,
            protected currency: string,
            protected prices: LabeledPrice[] /*smallest units*/) {
        super(id);
        this.nextStep = nextStep;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        await context.telegramApi.sendInvoice(
            context.chatId,
            context.localization.text(this.title),
            context.localization.text(this.description),
            this.payload, 'start=' + context.user.id,
            this.currency,
            this.prices);
    }
}
