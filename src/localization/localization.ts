import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from 'node-telegram-bot-api';

export enum Locale {
    Locale_UK = 'uk',
    Locale_EN = 'en'
}

export class Localization {

    private static localizationPool = new Map<Locale, Localization>();

    private current: any;

    public static create(): Localization {
        return new Localization();
    }

    public static pool(locale: Locale): Localization {
        if (!Localization.localizationPool.has(locale)) {
            Localization.localizationPool.set(locale, Localization.create().init(locale));
        }
        return Localization.localizationPool.get(locale);
    }

    public init(locale: Locale, path: string = './'): Localization {
        try{
            this.current = require(path + 'resource.'+ locale +'.json');
        } catch (error: any) {
            try {
                this.current = require(path + 'resource.ua.json');
            } catch (nestedError) {
                this.current = require('./resource.ua.json');
            }
        }
        return this;
    }

    public text(id: string): string {
        return this.current[id] == null ? `P.L.E.A.S.E.${id}.L.O.C.A.L.I.Z.E` : this.current[id];
    }

    public inlineKeyboard(inlineKeyboard: InlineKeyboardMarkup): InlineKeyboardMarkup {
        if(inlineKeyboard == null) {
            return null;
        }
        const keyboard = this.cloneDeep(inlineKeyboard);
        for(const row of keyboard.inline_keyboard) {
            for(const button of row) {
                button.text = this.text(button.text);
            }
        }
        return keyboard;
    }

    public keyboard(keyboard: ReplyKeyboardMarkup): ReplyKeyboardMarkup {
        if(keyboard == null) {
            return null;
        }
        const clonedKeyboard = this.cloneDeep(keyboard);
        for(const row of clonedKeyboard.keyboard) {
            for(const button of row) {
                button.text = this.text(button.text);
            }
        }
        return clonedKeyboard;
    }

    private cloneDeep(original: any): any {
        if (original instanceof RegExp) {
            return new RegExp(original);
        } else if (original instanceof Date) {
            return new Date(original.getTime());
        } else if (Array.isArray(original)) {
            return original.map((o) => this.cloneDeep(o));
        } else if (typeof original === 'object' && original !== null) {
            const clone: any = {};
            Object.keys(original).forEach(k => {
                clone[k] = this.cloneDeep(original[k]);
            });
            return clone;
        }
        return original;
    }
}
