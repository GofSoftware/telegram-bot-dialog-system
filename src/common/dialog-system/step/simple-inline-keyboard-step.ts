import { BaseStep } from './_base/base-step';
import { ExecutionContext } from '../../function/execution-context';
import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { MacroProcessor } from '../../business/macro-processor';
import { ContextCall, resolveContextCall } from './_base/context-call';

export class SimpleInlineKeyboardStep<C extends ExecutionContext = ExecutionContext> extends BaseStep {

    protected keyboard: InlineKeyboardMarkup | ContextCall<InlineKeyboardMarkup, C>;
    protected messageKey: string;

    constructor(
            id: string,
            messageKey: string,
            keyboard: InlineKeyboardMarkup | ContextCall<InlineKeyboardMarkup, C>,
            nextStep: string,
            private containsMacro: boolean = false) {
        super(id);
        this.messageKey = messageKey;
        this.nextStep = nextStep;
        this.keyboard = keyboard;
    }

    public async invoke(context: C): Promise<void> {
        let text = '';
        if (this.messageKey != null) {
            text = context.localization.text(this.messageKey);
            if (this.containsMacro) {
                text = MacroProcessor.process(text, context);
            }
        }
        const keyboard = await resolveContextCall<InlineKeyboardMarkup, C>(this.keyboard, context);
        await context.telegramApi.sendInlineKeyboard(text, context.chatId, context.localization.inlineKeyboard(keyboard));
    }
}
