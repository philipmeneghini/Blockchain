import Blockchain from '../blockchain/chain'
import Block from '../blockchain/block'
import cryptoHash from '../util/cryptoHash'
import { IChain } from '../blockchain/iChain'

describe('Blockchain', () => {
    let blockchain: IChain, newChain: IChain, originalChain: Block[]


    beforeEach(() => {
        blockchain = new Blockchain()
        newChain = new Blockchain()
        originalChain = blockchain.chain
    })
    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true)
    })

    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    })

    it('adds a new block to the chain', () => {
        const newData = 'foo bar'
        blockchain.addBlock(newData)

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData)
    })

    describe('isValidChain()', () => {
        beforeEach(() => {
            blockchain.addBlock('Bears')
            blockchain.addBlock('racoon')
            blockchain.addBlock('rabbits')
        })
        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { timestamp: 0, lastHash: '', hash: '', data : 'fake-genesis', difficulty: 0, nonce: 0}

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
            })
        })
        describe('when the chain starts with the genesis block and has multiple blocks', () => {
            describe('and a lastHash reference has changed', () => {
                it('returns false', () => {
                    blockchain.chain[2].lastHash = 'manipulated-hash'

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            describe('and the chain contains a block with an invalid field', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'manipulated-data'

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            describe('and the chain contains a block with jumped difficulty', () => {
                it('returns false', () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length-1]
                    const lastHash = lastBlock.hash
                    const timestamp = Date.now()
                    const nonce = 0
                    const data = ['']
                    const difficulty = lastBlock.difficulty -3
                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data)
                    const badBlock = new Block({
                        timestamp, lastHash, hash, nonce, difficulty, data
                    })

                    blockchain.chain.push(badBlock)

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            describe('and the chain contains no invalid blocks', () => {
                it('returns true', () => {
                   expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
                })
            })

        })
    })

    describe('replaceChain()', () => {
        describe('When the chain is not longer', () => {
            it('does not replace the chain', () => {
                newChain.chain[0] = { timestamp: 0, lastHash: '', hash: '', data : 'fake-genesis', difficulty: 0, nonce: 0}

                blockchain.replaceChain(newChain.chain)

                expect(blockchain.chain).toEqual(originalChain)
            })
        describe('When the chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock('Bears')
                newChain.addBlock('racoons')
                newChain.addBlock('chipmunks')
            })
            describe('When the chain is invalid', () => {
                it('does not replace the chain', () => {
                    newChain.chain[2].hash = 'somefakehash'

                    blockchain.replaceChain(newChain.chain)

                    expect(blockchain.chain).toEqual(originalChain)
                })
            })
            describe('When the chain is valid', () => {
                it('repaces the chain', () => {
                    blockchain.replaceChain(newChain.chain)

                    expect(blockchain.chain).toEqual(newChain.chain)
                })
            })
        })
        })
    })
})