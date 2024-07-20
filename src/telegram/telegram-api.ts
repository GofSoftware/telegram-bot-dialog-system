import { InlineKeyboardMarkup, ReplyKeyboardMarkup, Update, File, LabeledPrice, ReplyKeyboardRemove } from 'node-telegram-bot-api';
import { HttpClient } from './http-client';


export interface ITelegramResponse {
    ok: boolean;
    description?: string;
    result?: Update[];
    error_code?: number;
}

export class TelegramApiError {
    public static fromTelegramResponse(response: ITelegramResponse): TelegramApiError {
        return new TelegramApiError(response.description, response.error_code);
    }

    constructor(public description: string, public error_code: number | undefined) {
    }
}

export class NameValuePair {
    constructor(public name: string, public value: any) {
    }
}

export class TelegramApi {

    public static create(token: string, paymentProviderToken: string): TelegramApi {
        return new TelegramApi(token, paymentProviderToken);
    }

    private httpClient: HttpClient;

    protected constructor(token: string, private paymentProviderToken: string) {
        this.httpClient = new HttpClient(token);
    }

    public async sendMessage(message: string, chatId: number | string): Promise<void> {
        const url = this.httpClient.getMethodUrl('sendMessage') + `?chat_id=${chatId}&parse_mode=HTML&text=${encodeURIComponent(message)}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async deleteMessage(messageId: number, chatId: number | string): Promise<void> {
        const url = this.httpClient.getMethodUrl('deleteMessage') + `?chat_id=${chatId}&message_id=${messageId}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async sendKeyboard(message: string, chatId: number, replyKeyboardMarkup: ReplyKeyboardMarkup): Promise<void> {
        // const replyKeyboardMarkup: ReplyKeyboardMarkup = {keyboard: [[{text: 'Да'}, {text: 'Нет'}]], one_time_keyboard: true};
        const url = this.httpClient.getMethodUrl('sendMessage') + `?chat_id=${chatId}&parse_mode=HTML&text=${encodeURIComponent(message)}` +
                                 `&reply_markup=${encodeURIComponent(JSON.stringify(replyKeyboardMarkup))}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async removeKeyboard(message: string, chatId: number, replyKeyboardRemove: ReplyKeyboardRemove): Promise<void> {
        const url = this.httpClient.getMethodUrl('sendMessage') + `?chat_id=${chatId}&parse_mode=HTML&text=${encodeURIComponent(message)}` +
            `&reply_markup=${encodeURIComponent(JSON.stringify(replyKeyboardRemove))}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async sendInlineKeyboard(message: string, chatId: number, inlineKeyboardMarkup: InlineKeyboardMarkup): Promise<void> {
        // const inlineKeyboardMarkup: InlineKeyboardMarkup =
        // {inline_keyboard: [[{text: 'Да', callback_data: 'yes'}, {text: 'Нет', callback_data: 'no'}]]};
        const url = this.httpClient.getMethodUrl('sendMessage') + `?chat_id=${chatId}&parse_mode=HTML&text=${encodeURIComponent(message)}` +
            `&reply_markup=${encodeURIComponent(JSON.stringify(inlineKeyboardMarkup))}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async sendDice(chatId: number): Promise<number> {
        const url = this.httpClient.getMethodUrl('sendDice') + `?chat_id=${chatId}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
            return -1;
        }
        console.log(`Sent dice: ${ret.result.dice.value}`);
        return ret.result.dice.value;
    }

    public async sendPhoto(chatId: number, photoUrl: string, caption: string = null): Promise<void> {
        let url = this.httpClient.getMethodUrl('sendPhoto') + `?chat_id=${chatId}&photo=${encodeURIComponent(photoUrl)}`;
        url += caption == null ? '' : `&caption=${encodeURIComponent(caption)}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async getUpdates(offset: number): Promise<Update[]> {
        const url = this.httpClient.getMethodUrl('getUpdates') + ((offset != null) ? '?offset=' + offset : '');
        const updateData: ITelegramResponse = await this.httpClient.httpsGetRequest(url);
        if (updateData.ok !== true) {
            this.httpClient.handleError(updateData);
        }
        // console.log(offset, JSON.stringify(updateData, null, 4));
        return updateData.result;
    }

    public async answerCallbackQuery(callbackQueryId: string, message: string, isAlert: boolean = false): Promise<void> {
        let url = this.httpClient.getMethodUrl('answerCallbackQuery') + `?callback_query_id=${callbackQueryId}`;
        url += message == null ? `` : `&text=${encodeURIComponent(message)}`;
        url += (isAlert === true) ? `&show_alert=true` : '';
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async setWebhook(hookUrl: string): Promise<void> {
        let url = this.httpClient.getMethodUrl('setWebhook') + `?url=${hookUrl}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async getFile(fileId: string): Promise<File> {
        let url = this.httpClient.getMethodUrl('getFile') + `?file_id=${fileId}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
        return ret.result;
    }

    public async downloadFile(filePath: string): Promise<Buffer> {
        const url = this.httpClient.getFileDownloadUrl(filePath);
        return await this.httpClient.httpsGetRequest(url);
    }

    public async sendInvoice(
            chatId: number,
            title: string,
            description: string,
            payload: string,
            startParameter: string,
            currency: string,
            prices: LabeledPrice[]): Promise<void> {

        const url = this.httpClient.getMethodUrl('sendInvoice', [
            new NameValuePair('chat_id', chatId),
            new NameValuePair('title', title),
            new NameValuePair('description', description),
            new NameValuePair('payload', payload),
            new NameValuePair('provider_token', this.paymentProviderToken),
            new NameValuePair('start_parameter', startParameter),
            new NameValuePair('currency', currency),
            new NameValuePair('prices', JSON.stringify(prices))
        ]);
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async answerPrecheckoutQuery(preCheckoutQueryId: string, ok: boolean, errorMessage: string): Promise<void> {
        let url = this.httpClient.getMethodUrl('answerPrecheckoutQuery', [
            new NameValuePair('pre_checkout_query_id', preCheckoutQueryId),
            new NameValuePair('ok', ok),
            new NameValuePair('error_message', errorMessage)
        ]);
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async editMessageText(
            message: string, chatId: number, messageId: number, inlineKeyboardMarkup: InlineKeyboardMarkup): Promise<void> {
        let url = this.httpClient.getMethodUrl('editMessageText') + `?chat_id=${chatId}&message_id=${messageId}` +
            `&parse_mode=HTML&text=${encodeURIComponent(message)}`;
        url += inlineKeyboardMarkup == null ? `` : `&reply_markup=${encodeURIComponent(JSON.stringify(inlineKeyboardMarkup))}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }

    public async editMessageCaption(
        caption: string, chatId: number, messageId: number, inlineKeyboardMarkup: InlineKeyboardMarkup): Promise<void> {
        const url = this.httpClient.getMethodUrl('editMessageCaption') + `?chat_id=${chatId}&message_id=${messageId}` +
            `&parse_mode=HTML&caption=${encodeURIComponent(caption)}` +
            `&reply_markup=${encodeURIComponent(JSON.stringify(inlineKeyboardMarkup))}`;
        const ret = await this.httpClient.httpsGetRequest(url);
        if (ret.ok !== true) {
            this.httpClient.handleError(ret);
        }
    }



}
