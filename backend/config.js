const STARTING_BALANCE = 100
const MINE_RATE = 1000
const DIFFICULTY = 3

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: 3,
    nonce: 1,
    data: []
}

module.exports = { GENESIS_DATA, MINE_RATE, STARTING_BALANCE }