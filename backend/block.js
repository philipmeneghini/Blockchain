const { GENESIS_DATA, MINE_RATE } = require('./config')
const cryptoHash = require('./cryptoHash')


class Block {

    constructor({ timestamp, lastHash, hash, data, difficulty, nonce }) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.difficulty = difficulty
        this.nonce = nonce      
    }

    static genesis() {
        const genesisBlock = new Block(GENESIS_DATA)
        return genesisBlock
    }

    static mineBlock({lastBlock, data}) {
        let timestamp = Date.now()
        const lastHash = lastBlock.hash
        let difficulty = lastBlock.difficulty
        let nonce = 0
        let hash = cryptoHash(timestamp, lastHash, data, nonce)
        while(hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            nonce ++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp })
            hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce)
        }
        const minedBlock = new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        })
        return minedBlock
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock
        const difference = timestamp - originalBlock.timestamp
        if (difference > MINE_RATE) {
            if (difficulty <= 1) {
                return 1
            }
            return difficulty - 1
        }
        else if (difference < MINE_RATE) {
            return difficulty + 1
        }
        return difficulty
    }

}

module.exports = Block