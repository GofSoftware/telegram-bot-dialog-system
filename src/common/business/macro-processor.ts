import { ExecutionContext } from '../function/execution-context';
import { IUser } from './i-user';

export class MacroProcessor {
    public static process(text: string, context: ExecutionContext): string {
        const user = context.user || ({name: ''} as IUser);
        return text.replace('[User.firstName]', (user.firstName == null ? user.name : user.firstName));
    }
}
