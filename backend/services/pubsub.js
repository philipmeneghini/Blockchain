const redis = require('redis')
const Blockchain = require('../blockchain/chain')

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {

    constructor({ blockchain }) {
        this.blockchain = blockchain
        this.publisher = redis.createClient()
        this.subscriber = redis.createClient()

        this.connectClient(this.publisher, this.subscriber)
        this.subscribeToChannels(this.subscriber)
    }


    subscribeToChannels = (subscriber) => {
        Object.entries(CHANNELS).forEach(channel => {
            subscriber.subscribe(channel, (message) => {
                console.log('Channel: ' + channel + '\nRecieved data: '+ message)
                const parsedMessage = JSON.parse(message)

                if(channel === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(parsedMessage)
                }
            })
        })
    }

    publishToChannels = async({ channel, message }) => {
        await this.publisher.publish(channel, message)
    }

    connectClient = async(publisher, subscriber) => {
        await publisher.connect()
        await subscriber.connect()
    }
}

module.exports = PubSub