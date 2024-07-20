import { BaseStep } from './_base/base-step';

export class GoToTopicStep extends BaseStep {
    constructor(id: string, nextTopic: string, topicStep: string = null) {
        super(id);
        this.nextStep = topicStep;
        this.nextTopic = nextTopic;
    }
}
