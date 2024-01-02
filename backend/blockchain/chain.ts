import Block from'./block'
import { BlockData, GENESIS_DATA, MINE_RATE } from '../config'
import cryptoHash from '../util/cryptoHash'
import { IChain } from './iChain'

class Blockchain implements IChain {

    public chain: Block[]

    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock = ( data: string[] | string) => {
        const newBlock = Block.mineBlock(
            this.chain[this.chain.length-1],
            data
        )

        this.chain.push(newBlock)
    }

    static isValidChain = (chainOfBlockchain: Block[]): boolean => {
        if (JSON.stringify(chainOfBlockchain[0]) !== JSON.stringify(Block.genesis())) {
            return false
        }
        for(let index=1; index < chainOfBlockchain.length; index++) {
            if (chainOfBlockchain[index].lastHash !== chainOfBlockchain[index-1].hash) {
                return false
            }

            const { timestamp, lastHash, hash, nonce, difficulty, data }: BlockData = chainOfBlockchain[index]
            
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

    replaceChain = (newChain: Block[]) => {
        if (this.chain.length < newChain.length){
            if (Blockchain.isValidChain(newChain)) {
                this.chain = newChain
            }
        }
    }
}

export default Blockchain