import { ExecutionContext } from '../../../function/execution-context';

export interface IStep<T extends ExecutionContext = ExecutionContext> {
    id: string;
    nextStep: string;
    nextTopic: string;
    waitForUpdate: boolean;
    invoke(context: T): Promise<void>;
}
