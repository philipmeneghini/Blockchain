const Block = require('../block')
const Blockchain = require('../blockchain')
const { GENESIS_DATA, MINE_RATE } = require('../config')
const cryptoHash = require('../cryptoHash')

describe('Block', () =>{
    const timestamp = 2000
    const lastHash = 'foo-hash'
    const hash = 'bar-hash'
    const data = ['blockchain', 'data']
    const nonce = 1
    const difficulty = 3
    const block = new Block({timestamp, lastHash, hash, difficulty, nonce, data})

    it('has a timestamp, lastHash, hash, and data property', () =>{
        expect(block.timestamp).toEqual(timestamp)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.hash).toEqual(hash)
        expect(block.data).toEqual(data)
        expect(block.nonce).toEqual(nonce)
        expect(block.difficulty).toEqual(difficulty)
    })

    describe('genesis()', () => {
        const genesisBlock = Block.genesis()

        it ('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true)
        })

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA)
        })
    })

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis()
        const data = 'mined data'
        const minedBlock = Block.mineBlock({ lastBlock, data })

        it('returns  Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true)
        })

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash)
        })

        it('sets the `data`', ()=> {
            expect(minedBlock.data).toEqual(data)
        })

        it('sets a `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined)
        })

        it('creates a SHA-256 `hash` based on the proper inputs', () => {
            expect(minedBlock.hash)
                .toEqual(
                    cryptoHash(
                        minedBlock.timestamp, 
                        lastBlock.hash,
                        minedBlock.nonce,
                        minedBlock.difficulty, 
                        data))
        })

        it('sets a `hash` that meets the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty))
        })
    })

    describe('adjustDifficulty()', () => {

        beforeEach(() => {
            
        })
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: (block.timestamp + MINE_RATE - 100)
            })).toEqual(block.difficulty+1)
        })

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: (block.timestamp + MINE_RATE + 100)
            })).toEqual(block.difficulty-1)
        })

        it('keeps the difficulty the same for a block that is mined at the MINE_RATE', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + (MINE_RATE)
            })).toEqual(block.difficulty)
        })

        it('has a lower limit of one', () => {
            block.difficulty = 1
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + (MINE_RATE+100)
            })).toEqual(block.difficulty)
        })

        it('decreases difficulty when mineBLock function executes slower than MINE_RATE', () => {
            block.difficulty = 6
            const minedBlock = Block.mineBlock({ lastBlock: block, data: "foo"})
            expect(minedBlock.difficulty).toEqual(5)
        })

    })
})