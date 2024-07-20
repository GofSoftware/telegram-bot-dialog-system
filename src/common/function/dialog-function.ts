import { BaseFunction } from './base-function';
import { DialogSystem } from '../dialog-system/dialog-system';
import { ExecutionContext } from './execution-context';

export abstract class DialogFunction<T extends ExecutionContext> extends BaseFunction<T> {
    public abstract get dialogSystem(): DialogSystem;
}
