import { Update } from 'node-telegram-bot-api';
import { ExecutionContext } from './execution-context';
import { IBotConfig } from '../business/i-bot-config';
import { ILogger } from '../business/i-logger';
import { TelegramApi } from '../../telegram/telegram-api';
import { UpdateExtractor } from '../../telegram/update-extractor';
import { IDatabase } from '../../firestore/i-database';

export abstract class BaseFunction<T extends ExecutionContext> {

    protected context: T = null;

    public async prepareContext(
        update: Update,
        config: IBotConfig,
        context: T,
        logger: ILogger,
        dataBase: IDatabase
    ): Promise<void> {
        this.context = context;

        this.context.update = update;
        this.context.telegramApi = TelegramApi.create(config.botToken, config.paymentToken);
        this.context.db = dataBase;
        this.context.config = config;
        this.context.logger = logger;
        this.context.chatId = UpdateExtractor.extractChatId(this.context.update);
        this.context.user = null;
        this.context.logger.log(`Update: ${JSON.stringify(this.context.update, null, 4)}`,
            '----------------------', this.context.update, '+++++++++++++');
    }

    public abstract process(update: Update, config: IBotConfig, logger: ILogger): Promise<void>;

    public getContext(): T {
        return this.context;
    }

}
