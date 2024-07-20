import { BaseStep } from './_base/base-step';
import { ExecutionContext } from '../../function/execution-context';
import { MacroProcessor } from '../../business/macro-processor';
import { ContextCall, resolveContextCallLocalized } from './_base/context-call';

export class SimpleMessageStep<C extends ExecutionContext = ExecutionContext> extends BaseStep {
    public messageKey: string | ContextCall<string, C>;

    constructor(
            id: string,
            messageKey: string | ContextCall<string, C>,
            nextStep: string,
            private containsMacro: boolean = false) {
        super(id);
        this.messageKey = messageKey;
        this.nextStep = nextStep;
    }

    public async invoke(context: C): Promise<void> {
        // (typeof this.messageKey === 'function') ? await this.messageKey(context) : Localization.text(this.messageKey);
        let text = await resolveContextCallLocalized(this.messageKey, context);
        if (this.containsMacro) {
            text = MacroProcessor.process(text, context);
        }
        await context.telegramApi.sendMessage(text, context.chatId);
    }
}
