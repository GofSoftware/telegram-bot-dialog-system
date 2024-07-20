import { BaseStep } from './_base/base-step';
import { ExecutionContext } from '../../function/execution-context';
import {  ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { MacroProcessor } from '../../business/macro-processor';

export class SimpleKeyboardStep extends BaseStep {

    protected keyboard: ReplyKeyboardMarkup;
    protected messageKey: string;

    constructor(id: string, messageKey: string, keyboard: ReplyKeyboardMarkup, nextStep: string, private containsMacro: boolean = false) {
        super(id);
        this.messageKey = messageKey;
        this.nextStep = nextStep;
        this.keyboard = keyboard;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        let text = '';
        if (this.messageKey != null) {
            text = context.localization.text(this.messageKey);
            if (this.containsMacro) {
                text = MacroProcessor.process(text, context);
            }
        }
        await context.telegramApi.sendKeyboard(text, context.chatId, context.localization.keyboard(this.keyboard));
    }
}
