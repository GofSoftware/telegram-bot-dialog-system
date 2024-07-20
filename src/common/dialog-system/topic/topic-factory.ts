import { ITopic } from './i-topic';

export class TopicFactory {
    private static registry: Map<string, any> = new Map<string, any>();

    public static add(topics: {name: string, construct: any}[]): void {
        topics.forEach((topic) => {
            TopicFactory.registry.set(topic.name, topic.construct);
        });
    }

    public static create(topicName: string): ITopic {
        if(!TopicFactory.registry.has(topicName)) {
            throw new Error(`Topic with name ${topicName} wasn't registered.`);
        }
        return new (TopicFactory.registry.get(topicName))();
    }
}
