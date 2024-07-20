import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { ContextCall, resolveContextCall } from '../_base/context-call';

export class SimpleUrlPhotoStep extends BaseStep {
    public photoUrl: string | ContextCall<string>;
    public caption: string;

    constructor(id: string, photoUrl: string | ContextCall<string>, caption: string, nextStep: string) {
        super(id);
        this.photoUrl = photoUrl;
        this.caption = caption;
        this.nextStep = nextStep;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        const caption = this.caption == null ? null : context.localization.text(this.caption);
        try {
            const url = await resolveContextCall<string>(this.photoUrl, context);
            await context.telegramApi.sendPhoto(context.chatId, url, caption);
        } catch(error) {
            context.logger.warn(`Unable to send photo ${this.photoUrl}`, error);
        }
    }
}
