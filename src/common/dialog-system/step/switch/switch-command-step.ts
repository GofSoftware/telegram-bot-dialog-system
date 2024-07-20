import { BaseStep } from '../_base/base-step';
import { ExecutionContext } from '../../../function/execution-context';
import { UpdateExtractor } from '../../../../telegram/update-extractor';

export interface ICommandToStepId {
    command: string;
    stepId: string;
}

export class SwitchCommandStep extends BaseStep {
    constructor(id: string, defaultStep: string, protected testData: ICommandToStepId[]) {
        super(id);
        this.nextStep = defaultStep;
    }

    public async invoke(context: ExecutionContext): Promise<void> {
        const commands = UpdateExtractor.extractCommands(context.update);
        if (commands.length === 0) {
            return;
        }
        const testDataMap = new Map(this.testData.map((item) => [item.command, item.stepId]));
        for(const command of commands) {
            if (testDataMap.has(command)) {
                this.nextStep = testDataMap.get(command);
                return;
            }
        }
    }
}
