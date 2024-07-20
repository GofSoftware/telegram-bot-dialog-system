import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { UpdateExtractor } from '../../../../telegram/update-extractor';
import { SafeInvoker } from '../../../business/safe-invoker';

export interface IDataToStepId {
    data: string | RegExp;
    stepId: string;
}

export class SwitchInlineKeyboardResultStep extends BaseStep {
    constructor(
            id: string,
            protected testData: IDataToStepId[],
            protected defaultStep: string,
            private replaceButtons: boolean = false,
            private message: string = null,
            private isAlert: boolean = false) {
        super(id);
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        let callbackQueryData = UpdateExtractor.extractCallbackQueryData(context.update);
        const queryId = UpdateExtractor.extractCallbackQueryId(context.update);
        if (queryId != null) {
            await SafeInvoker.call<void>(() =>
                context.telegramApi.answerCallbackQuery(
                    queryId,
                    (this.message == null ? null : context.localization.text(this.message)),
                    this.isAlert)
            );
        }

        const equalItem = this.testData.find((testItem) => {
            return (testItem.data instanceof RegExp) ? testItem.data.test(callbackQueryData) : testItem.data === callbackQueryData;
        });
        this.nextStep = (equalItem != null) ? equalItem.stepId : this.defaultStep;

        if (callbackQueryData != null && this.replaceButtons === true) {
            const messageId = UpdateExtractor.extractMessageId(context.update);
            try {
                if (callbackQueryData.indexOf('___') !== -1) {
                    callbackQueryData = callbackQueryData.split('___')[0];
                }
                const text = UpdateExtractor.extractMessage(context.update);
                await context.telegramApi.editMessageText(`${text}\n<b>💬 ${context.localization.text(callbackQueryData)}</b>`,
                    context.chatId, messageId, null);
            }
            catch (error: any) {
                context.logger.warn(`Wasn't able to edit message id: ${messageId} in chat id: ${context.chatId}.` +
                    ` Error: ${JSON.stringify(error)}`);
            }
        }
    }
}
