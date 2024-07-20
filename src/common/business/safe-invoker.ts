import { ILogger } from './i-logger';

export class SafeInvoker {
    public static async call<T = void>(fn: () => Promise<T>, logger: ILogger = null): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            if(logger != null) {
                logger.error(error);
            }
        }
        return null;
    }
}
