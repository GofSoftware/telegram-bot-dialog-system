import { ExecutionContext } from './execution-context';

export interface IGlobalActionProcessorResult {
    skipDialog: boolean;
    processedCommands: string[];
    errors: string[];
}

export interface IGlobalActionResult {
    skipDialog: boolean;
    error: string;
}

export interface IGlobalAction {
    commandName: string;

    accept(context: ExecutionContext): boolean;
    invoke(context: ExecutionContext): Promise<IGlobalActionResult>;
}

/**
 * List of commands for the BotFather
 * menu - Main menu
 *
 */
export class GlobalActionProcessor {

    private actionRegistry: Map<string, IGlobalAction>;

    public static create(commands: IGlobalAction[]): GlobalActionProcessor {
        const processor =  new GlobalActionProcessor();
        processor.actionRegistry = new Map<string, IGlobalAction>(commands.map((c) => [c.commandName, c]));
        return processor;
    }

    public async process(context: ExecutionContext): Promise<IGlobalActionProcessorResult> {

        const processorResult: IGlobalActionProcessorResult = {skipDialog: false, processedCommands: [], errors: []};

        // const commands = UpdateExtractor.extractCommands(context.update).filter((c) => this.commandRegistry.has(c));
        const acceptedActions = Array.from(this.actionRegistry.values()).reduce((result: IGlobalAction[], command: IGlobalAction) => {
            if (command.accept(context)) {
                result.push(command);
            }
            return result;
        }, []);

        const actionResults: IGlobalActionResult[] = [];

        for(const acceptedAction of acceptedActions) {
            try {
                // const result = await this.commandRegistry.get(command).invoke(context);
                const result = await acceptedAction.invoke(context);
                actionResults.push(result);
                processorResult.processedCommands.push(acceptedAction.commandName);
                if (result.error != null) {
                    processorResult.errors.push(result.error);
                }
            }
            catch (error: any) {
                context.logger.error(`Command processing error.`, error);
            }
        }

        // to skip final dialog system we need all commands report to skip it, if at least one command tells that we need to
        // process dialog then we must process it.
        processorResult.skipDialog = actionResults.length > 0 && actionResults.every((r) => r.skipDialog === true);

        return processorResult;
    }

}
