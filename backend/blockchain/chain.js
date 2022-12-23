const Block = require('./block')
const { GENESIS_DATA, MINE_RATE } = require('../config')
const cryptoHash = require('../util/cryptoHash')

class Blockchain {

    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        })

        this.chain.push(newBlock)
    }

    static isValidChain(chainOfBlockchain) {
        if (JSON.stringify(chainOfBlockchain[0]) !== JSON.stringify(Block.genesis())) {
            return false
        }
        for(let index=1; index < chainOfBlockchain.length; index++) {
            if (chainOfBlockchain[index].lastHash !== chainOfBlockchain[index-1].hash) {
                return false
            }

            const { timestamp, lastHash, hash, nonce, difficulty, data } = chainOfBlockchain[index]
            
            if (Math.abs(difficulty - chainOfBlockchain[index-1].difficulty) >= 2) {
                return false
            }

            const calculatedHash = cryptoHash(timestamp, lastHash, nonce, difficulty, data)
            if(calculatedHash != hash) {
                return false
            }
        }
        return true
    }

    replaceChain(newChain) {
        if (this.chain.length < newChain.length){
            if (Blockchain.isValidChain(newChain)) {
                this.chain = newChain
            }
        }
    }
}

module.exports = Blockchain