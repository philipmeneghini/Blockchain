import express, { Router } from 'express'
import { IPubSub } from '../services/iPubSub'
import { IChain } from '../blockchain/iChain'
import { _blockChain, _pubSub } from '../app'

class BlockchainController {

    blockchain: IChain
    pubsub: IPubSub
    router: Router

    constructor() {
        this.blockchain = _blockChain
        this.pubsub = _pubSub
        this.pubsub.publishToChannels('BLOCKCHAIN', JSON.stringify(this.blockchain))
        this.router = express.Router()
        this.defineRoutes()
    }

    defineRoutes = () => {
        this.router.get('/', (req, res) => {
            return res.status(200).json(this.blockchain.chain)
        })

        this.router.post('/', (req, res) => {
            const { data } = req.body
            this.blockchain.addBlock(data)
            this.pubsub.publishToChannels('BLOCKCHAIN', JSON.stringify(this.blockchain))

            return res.status(200).json(this.blockchain.chain)
        })
    }
}

export default BlockchainController
