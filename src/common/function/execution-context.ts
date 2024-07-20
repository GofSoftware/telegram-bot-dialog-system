import { Update } from 'node-telegram-bot-api';
import { IUser } from '../business/i-user';
import { TelegramApi } from '../../telegram/telegram-api';
import { IDatabase } from '../../firestore/i-database';
import { ILogger } from '../business/i-logger';
import { IBotConfig } from '../business/i-bot-config';
import { Localization } from '../../localization/localization';

export class ExecutionContext {
    public chatId: number;
    public update: Update;
    public telegramApi: TelegramApi;
    public db: IDatabase;
    public config: IBotConfig;
    public logger: ILogger;
    public localization: Localization;
    public user: IUser;
}
