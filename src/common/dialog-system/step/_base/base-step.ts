import { IStep } from './i-step';
import { ExecutionContext } from '../../../function/execution-context';

export class BaseStep<T extends ExecutionContext = ExecutionContext> implements IStep<T> {
    public static readonly FIRST_STEP_ID = '__first step__';
    public static readonly EMPTY_STEP_ID = '';

    public waitForUpdate: boolean = false;

    public id: string;
    public nextStep: string = BaseStep.FIRST_STEP_ID;
    public nextTopic: string;

    constructor(id: string) {
        this.id = id;
    }

    public async invoke(context: T): Promise<void> {
        return;
    }
}
