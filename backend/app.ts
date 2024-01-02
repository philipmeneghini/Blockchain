import express from 'express'
import BlockchainController from './controllers/BlockchainController'
import { IChain } from './blockchain/iChain'
import Blockchain from './blockchain/chain'
import { IPubSub } from './services/iPubSub'
import PubSub from './services/pubsub'

export const _blockChain: IChain = new Blockchain()
export const _pubSub: IPubSub = new PubSub(_blockChain)

const app = express()
const PORT: number = 3000 + Math.round(Math.random() *1000)

app.use(express.json())

const blockchainController = new BlockchainController()

app.use('/blockchain', blockchainController.router)

app.listen(PORT, '0.0.0.0', () => {
    console.log(`blockchain server up and running on PORT: ${PORT}!`)
})