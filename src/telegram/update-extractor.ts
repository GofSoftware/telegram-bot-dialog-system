import { Contact, PhotoSize, PreCheckoutQuery, SuccessfulPayment, Update, User } from 'node-telegram-bot-api';

export class UpdateExtractor {
    public static extractFrom(update: Update): User {
        if (update.message) {
            return update.message.from;
        }
        if (update.callback_query) {
            return update.callback_query.from;
        }
        if (update.pre_checkout_query) {
            return update.pre_checkout_query.from;
        }
        return null;
    }

    public static extractMessage(update: Update): string {
        if (update.message) {
            return update.message.text;
        }
        if (update.channel_post) {
            return update.channel_post.text;
        }
        if (update.edited_channel_post) {
            return update.edited_channel_post.text;
        }
        if (update.callback_query) {
            return update.callback_query.message.text;
        }
        return null;
    }

    public static extractContact(update: Update): Contact {
        if (update.message && update.message.contact) {
            return update.message.contact;
        }
        return null;
    }

    public static extractCaption(update: Update): string {
        if (update.message) {
            return update.message.caption;
        }
        if (update.channel_post) {
            return update.channel_post.caption;
        }
        if (update.edited_channel_post) {
            return update.edited_channel_post.caption;
        }
        return null;
    }

    public static extractMessageId(update: Update): number {
        if (update.message) {
            return update.message.message_id;
        }
        if (update.channel_post) {
            return update.channel_post.message_id;
        }
        if (update.edited_channel_post) {
            return update.edited_channel_post.message_id;
        }
        if (update.callback_query) {
            return update.callback_query.message.message_id;
        }
        return null;
    }

    public static extractCallbackQueryData(update: Update): string {
        if (update.callback_query) {
            return update.callback_query.data;
        }
        return null;
    }

    public static extractCallbackQueryId(update: Update): string {
        if (update.callback_query) {
            return update.callback_query.id;
        }
        return null;
    }

    public static extractChatId(update: Update): number {
        if (update.message) {
            return update.message.chat.id;
        }
        if (update.channel_post) {
            return update.channel_post.chat.id;
        }
        if (update.callback_query && update.callback_query.message) {
            return update.callback_query.message.chat.id;
        }
        if (update.edited_channel_post) {
            return update.edited_channel_post.chat.id;
        }
        return null;
    }

    public static extractPhotoFileIds(update: Update, getBiggest: boolean = true): string[]  {
        if (update.message && update.message.photo) {
            if (!getBiggest) {
                return update.message.photo.map((photo) => photo.file_id);
            }

            const maxSize = 5000000;
            let currentSize = 0;
            let id = null;

            update.message.photo.forEach((photo: PhotoSize) => {
                if (photo.file_size > currentSize && photo.file_size <= maxSize) {
                    currentSize = photo.file_size;
                    id = photo.file_id;
                }
            });
            return [id];
        }
        if (update.message && update.message.document) {
            return [update.message.document.file_id];
        }
        return null;
    }

    public static extractPreCheckoutQuery(update: Update): PreCheckoutQuery {
        if (update.pre_checkout_query) {
            return update.pre_checkout_query;
        }
        return null;
    }

    public static extractSuccessfulPayment(update: Update): SuccessfulPayment {
        if (update.message != null && update.message.successful_payment != null) {
            return update.message.successful_payment;
        }
        return null;
    }

    public static extractStartPayload(update: Update): number {
        if (update.message != null && update.message.text != null) {
            const matches = /\/start\s(\d+)/.exec(update.message.text);
            if (matches != null) {
                return parseInt(matches[1]);
            }
        }
        return null;
    }

    public static extractCommands(update: Update): string[] {
        if (update.message && update.message.entities) {
            return update.message.entities.filter((entity) => entity.type === 'bot_command').map((entity) => {
                return update.message.text.substring(entity.offset, entity.offset + entity.length);
            });
        }
        return [];
    }
}
