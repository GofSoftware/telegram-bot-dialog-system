import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { File } from 'node-telegram-bot-api';
import { UpdateExtractor } from '../../../../telegram/update-extractor';

export class GetPhotoStep<C extends ExecutionContext = ExecutionContext> extends BaseStep {

    constructor(
            id: string,
            nextStep: string,
            private failedStep: string,
            private gotPhotoCallback: (context: C, documentInfo: File, document: Buffer) => Promise<void>) {
        super(id);
        this.nextStep = nextStep;
    }

    public async invoke(context: C): Promise<void> {
        try {

            const fileIds = UpdateExtractor.extractPhotoFileIds(context.update);
            if (fileIds == null || fileIds.length === 0) {
                this.nextStep = this.failedStep;
                return;
            }

            for (const fileId of fileIds) {

                const fileInfo = await context.telegramApi.getFile(fileId);

                const file = await context.telegramApi.downloadFile(fileInfo.file_path);

                await this.gotPhotoCallback(context, fileInfo, file);
            }
        } catch(error) {
            this.nextStep = this.failedStep;
        }
    }
}
