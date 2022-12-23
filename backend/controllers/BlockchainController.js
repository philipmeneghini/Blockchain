const express = require('express')
const Blockchain = require('../blockchain/chain')
const PubSub = require('../services/pubsub')

class BlockchainController {

    constructor() {
        this.blockchain = new Blockchain()
        this.pubsub = new PubSub(this.blockchain)
        this.pubsub.publishToChannels({ channel: 'BLOCKCHAIN', message: JSON.stringify(this.blockchain) })
        this.router = express.Router()
        this.defineRoutes()
    }

    defineRoutes = () => {
        this.router.get('/', (req, res) => {
            return res.status(200).json(this.blockchain.chain)
        })

        this.router.post('/', (req, res) => {
            const { data } = req.body
            this.blockchain.addBlock({ data })
            this.pubsub.publishToChannels({ channel: 'BLOCKCHAIN', message: JSON.stringify(this.blockchain) })

            return res.status(200).json(this.blockchain.chain)
        })
    }
}

module.exports = BlockchainController
