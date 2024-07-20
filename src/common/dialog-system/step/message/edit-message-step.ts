import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { MacroProcessor } from '../../../business/macro-processor';
import { UpdateExtractor } from '../../../../telegram/update-extractor';

export class EditMessageStep extends BaseStep {

    protected keyboard: InlineKeyboardMarkup | ((context: ExecutionContext) => Promise<InlineKeyboardMarkup>);
    protected messageKey: string | ((context: ExecutionContext) => Promise<string>);

    constructor(
            id: string,
            messageKey: string | ((context: ExecutionContext) => Promise<string>),
            keyboard: InlineKeyboardMarkup | ((context: ExecutionContext) => Promise<InlineKeyboardMarkup>),
            nextStep: string,
            private containsMacro: boolean = false) {
        super(id);
        this.messageKey = messageKey;
        this.nextStep = nextStep;
        this.keyboard = keyboard;
    }

    public async invoke(context: ExecutionContext): Promise<void> {

        let text = (typeof this.messageKey === 'function') ? await this.messageKey(context) : context.localization.text(this.messageKey);
        if (this.containsMacro) {
            text = MacroProcessor.process(text, context);
        }

        const messageId = UpdateExtractor.extractMessageId(context.update);

        const keyboard = (typeof this.keyboard === 'function') ? await this.keyboard(context) : this.keyboard;

        try {
            await context.telegramApi.editMessageText(
                text, context.chatId, messageId, context.localization.inlineKeyboard(keyboard));
        } catch (error: any) {
            context.logger.warn(`Error while editing the message id: ${messageId} chat Id: ${context.chatId}`);
        }
    }
}
