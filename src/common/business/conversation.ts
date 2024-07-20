export interface IConversation {
    currentTopicName: string;
    step: string;
}

export class Conversation implements IConversation {

    public static fromJson(jsonObject: IConversation): Conversation {
        return new Conversation(jsonObject.currentTopicName, jsonObject.step);
    }

    constructor(
            public currentTopicName: string,
            public step: string) {
    }

    public toJson(): IConversation {
        return {
            currentTopicName: this.currentTopicName,
            step: this.step
        };
    }

    public clone(): Conversation {
        return Conversation.fromJson(this.toJson());
    }
}
