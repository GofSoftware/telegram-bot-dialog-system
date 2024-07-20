import { Conversation } from '../business/conversation';
import { ExecutionContext } from '../function/execution-context';
import { ITopic } from './topic/i-topic';
import { TopicFactory } from './topic/topic-factory';
import { IStep } from './step/_base/i-step';
import { BaseStep } from './step/_base/base-step';

export class DialogSystem {

    private dialogHistory: Conversation[] = [];
    public startTopicName: string = null;
    public startStepName: string = null;
    public endTopicName: string = null;
    public endStepName: string = null;
    public hasError: boolean = false;
    public error: string = null;

    constructor(private conversation: Conversation) {
    }

    public async goOn(context: ExecutionContext): Promise<void> {
        let loopCounter = 1000;

        context.logger.log('--------- Enter goOn -------');

        this.startTopicName = this.conversation.currentTopicName;
        this.startStepName = this.conversation.step;

        try {
            let topic: ITopic = TopicFactory.create(this.conversation.currentTopicName);

            let step: IStep = null;
            do {
                step = topic.getStep(this.conversation.step);
                context.logger.log(`--------- Invoke: ${this.conversation.currentTopicName}:${this.conversation.step} -------`);
                this.dialogHistory.push(this.conversation.clone());

                await step.invoke(context);

                if (this.conversation.step === step.nextStep) {
                    context.logger.log(`Next step [${step.nextStep}] cannot be the current step.`);
                    break;
                }

                if (step.nextTopic != null) {
                    this.conversation.currentTopicName = step.nextTopic;
                    this.conversation.step = step.nextStep == null ? BaseStep.FIRST_STEP_ID : step. nextStep;
                    topic = TopicFactory.create(this.conversation.currentTopicName);
                } else {
                    this.conversation.step = step.nextStep;
                }
            }
            while(step.waitForUpdate !== true && loopCounter-- > 0);

            if(loopCounter === 0) {
                context.logger.log(`Maximum amount of steps was reached.`);
            }

            context.logger.log('--------- Exit goOn -------');
        } catch (error: any) {
            context.logger.error(error);
            context.logger.log(this.historyDump());
            this.hasError = true;
            this.error = error.toString();
        }

        this.endTopicName = this.conversation.currentTopicName;
        this.endStepName = this.conversation.step;
    }

    public historyDump(): string {
        return this.dialogHistory.map((c) => `${c.currentTopicName}:${c.step}`).join('=>');
    }

    public historyLength(): number {
        return this.dialogHistory.length;
    }

    public historyItem(index: number): Conversation {
        return this.dialogHistory[index];
    }

    public historyItemLast(): Conversation {
        return this.dialogHistory[this.dialogHistory.length - 1];
    }
}
