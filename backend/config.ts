const STARTING_BALANCE = 100
const MINE_RATE = 1000
const DIFFICULTY = 3

interface BlockData {
    timestamp: number
    lastHash: string
    hash: string
    difficulty: number
    nonce: number
    data: string[] | string
}

const GENESIS_DATA: BlockData = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: 3,
    nonce: 1,
    data: []
}

export { BlockData, GENESIS_DATA, MINE_RATE, STARTING_BALANCE }