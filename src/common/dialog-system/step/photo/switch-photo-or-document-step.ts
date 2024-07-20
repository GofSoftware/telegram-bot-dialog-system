import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';

export class SwitchPhotoOrDocumentStep extends BaseStep {
    constructor(id: string, photoStep: string, private defaultStep: string) {
        super(id);
        this.nextStep = photoStep;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        const isPhotoOrDocument = context.update.message != null &&
            (context.update.message.photo != null || context.update.message.document != null);
        if (!isPhotoOrDocument) {
            this.nextStep = this.defaultStep;
        }
    }
}
