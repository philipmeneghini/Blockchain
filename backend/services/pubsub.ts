import redis from 'redis'
import { IChain } from '../blockchain/iChain'
import { IPubSub } from './iPubSub'

interface IChannels {
    TEST: string
    BLOCKCHAIN: string
}

const CHANNELS: IChannels = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub implements IPubSub {

    blockchain: IChain
    publisher: any
    subscriber: any


    constructor(chain: IChain) {
        this.blockchain = chain
        this.publisher = redis.createClient()
        this.subscriber = redis.createClient()

        this.connectClient(this.publisher, this.subscriber)
        this.subscribeToChannels(this.subscriber)
    }


    subscribeToChannels = (subscriber: any) => {
        Object.entries(CHANNELS).forEach(channel => {
            subscriber.subscribe(channel, (message: any) => {
                console.log('Channel: ' + channel + '\nRecieved data: '+ message)
                const parsedMessage = JSON.parse(message)

                if(channel[0] === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(parsedMessage)
                }
            })
        })
    }

    publishToChannels = async(channel: string, message: any) => {
        await this.publisher.publish(channel, message)
    }

    connectClient = async(publisher: any, subscriber: any) => {
        await publisher.connect()
        await subscriber.connect()
    }
}

export default PubSub