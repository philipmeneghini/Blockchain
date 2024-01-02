import { ec, KeyPair } from '../util/ECC'
import cryptoHash from '../util/cryptoHash'
import { STARTING_BALANCE } from '../config'
import Transaction from './transaction'

class Wallet {

    balance: number
    keyPair: KeyPair
    publicKey: string

    constructor() {
        this.balance = STARTING_BALANCE
        this.keyPair = ec.genKeyPair()

        this.publicKey = this.keyPair.getPublic().encode('hex', true)
    }

    sign(data: string) {
        return this.keyPair.sign(cryptoHash(data))
    }

    createTransaction(amount: number, recipient: string) {
        if( amount > this.balance ) {
            throw new Error("Amount exceeds balance")
        }
        
        return new Transaction( this, recipient, amount )
    }
}

export default Wallet