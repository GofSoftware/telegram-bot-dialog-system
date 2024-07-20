import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { MacroProcessor } from '../../../business/macro-processor';
import { UpdateExtractor } from '../../../../telegram/update-extractor';

export class EditCaptionStep extends BaseStep {

    protected keyboard: InlineKeyboardMarkup | ((context: ExecutionContext) => InlineKeyboardMarkup);
    protected captionKey: string;

    constructor(
            id: string,
            captionKey: string,
            keyboard: InlineKeyboardMarkup | ((context: ExecutionContext) => InlineKeyboardMarkup),
            nextStep: string,
            private containsMacro: boolean = false) {
        super(id);
        this.captionKey = captionKey;
        this.nextStep = nextStep;
        this.keyboard = keyboard;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        let text = context.localization.text(this.captionKey);
        if (this.containsMacro) {
            text = MacroProcessor.process(text, context);
        }

        const messageId = UpdateExtractor.extractMessageId(context.update);

        const keyboard = (typeof this.keyboard === "function") ? this.keyboard(context) : this.keyboard;

        await context.telegramApi.editMessageCaption(
            text, context.chatId, messageId, context.localization.inlineKeyboard(keyboard));
    }
}
