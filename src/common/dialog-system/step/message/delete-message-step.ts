import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { UpdateExtractor } from '../../../../telegram/update-extractor';

export class DeleteMessageStep extends BaseStep {

    protected keyboard: InlineKeyboardMarkup | ((context: ExecutionContext) => Promise<InlineKeyboardMarkup>);

    constructor(
            id: string,
            nextStep: string) {
        super(id);
        this.nextStep = nextStep;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        const messageId = UpdateExtractor.extractMessageId(context.update);
        try {
            // todo remove all places in code where this step is currently used and then uncomment below to make this step workable.
            // await context.telegramApi.deleteMessage(messageId, context.chatId);
        } catch (error: any) {
            context.logger.warn(`Removing of the message ${messageId} in chat ${context.chatId} has been unsuccessful.`);
        }
    }
}
