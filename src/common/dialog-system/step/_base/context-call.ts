import { ExecutionContext } from '../../../function/execution-context';

export type ContextCall<T, C extends ExecutionContext = ExecutionContext> = ((context: C) => Promise<T>);

async function ResolveContextCallFn<T, C extends ExecutionContext = ExecutionContext>
        (parameter: T | ContextCall<T, C>, context: ExecutionContext): Promise<T> {
    return (typeof parameter === 'function')
        ? await (parameter as ContextCall<T>)(context)
        : parameter;
}

async function ResolveContextCallLocalizedFn<C extends ExecutionContext = ExecutionContext>(
        parameter: string | ContextCall<string, C>,
        context: ExecutionContext): Promise<string> {
    return (typeof parameter === 'function')
        ? await (parameter as ContextCall<string>)(context)
        : context.localization.text(parameter);
}

export const resolveContextCall = ResolveContextCallFn;
export const resolveContextCallLocalized = ResolveContextCallLocalizedFn;

