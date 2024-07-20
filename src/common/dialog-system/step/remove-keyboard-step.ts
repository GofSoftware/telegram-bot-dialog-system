import { BaseStep } from './_base/base-step';
import { ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { ExecutionContext } from '../../function/execution-context';

export class RemoveKeyboardStep extends BaseStep {
    protected keyboard: ReplyKeyboardMarkup;

    constructor(id: string, nextStep: string, protected messageKey: string) {
        super(id);
        this.nextStep = nextStep;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        await context.telegramApi.removeKeyboard(context.localization.text(this.messageKey), context.chatId, {
            remove_keyboard: true,
            selective: false
        });
    }
}
