import { BlockData, GENESIS_DATA, MINE_RATE } from '../config'
import cryptoHash from '../util/cryptoHash'


class Block {

    timestamp: number
    lastHash: string
    hash: string
    data: []
    difficulty: number
    nonce: number

    constructor(blockData: BlockData) {
        this.timestamp = blockData.timestamp
        this.lastHash = blockData.lastHash
        this.hash = blockData.hash
        this.data = blockData.data
        this.difficulty = blockData.difficulty
        this.nonce = blockData.nonce      
    }

    static genesis = (): Block => {
        const genesisBlock = new Block(GENESIS_DATA)
        return genesisBlock
    }

    static mineBlock = (lastBlock: Block, data: []): Block => {
        let timestamp = Date.now()
        const lastHash = lastBlock.hash
        let difficulty = lastBlock.difficulty
        let nonce = 0
        let hash = cryptoHash(timestamp, lastHash, data, nonce)
        while(hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            nonce ++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
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

    static adjustDifficulty( originalBlock: Block, timestamp: number ): number {
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

export default Block