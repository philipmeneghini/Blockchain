export interface IPubSub {
    subscribeToChannels(subscriber: any) : void
    publishToChannels(channel: string, subscriber: any) : void
    connectClient(publisher: any, subscriber: any) : void
}