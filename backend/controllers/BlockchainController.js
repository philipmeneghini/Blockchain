const express = require('express')
const Blockchain = require('../blockchain')

class BlockchainController {

    constructor() {
        this.blockchain = new Blockchain()
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

            return res.status(200).json(this.blockchain.chain)
        })
    }
}

module.exports = BlockchainController
