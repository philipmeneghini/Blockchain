import { v1 } from 'uuid'
import Wallet from '.'
import { Signature, verifySignature } from '../util/ECC'

interface Input {
    timestamp: number,
    amount: number,
    address: string,
    signature: Signature
}

class Transaction {

    id: string
    outputMap: Record<string, number>
    input: Input

    constructor( senderWallet: Wallet, recipient: string, amount: number ) {
        this.id = v1()
        this.outputMap = {}
        this.outputMap[recipient] = amount
        this.outputMap[senderWallet.publicKey] = senderWallet.balance - amount
        const data = JSON.stringify(this.outputMap)

        this.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(data)

        }
    }

    static validTransaction(transaction: Transaction): boolean {
        const outputMap = transaction.outputMap
        const input = transaction.input

        const { amount, address, signature } = input

        if (Object.values(outputMap)[0] > amount) {
            console.error(`Transaction amount exceeds how much ${address} has`)
            return false
        }

        else if (outputMap[address] !== (amount - Object.values(outputMap)[0])) {
            console.error(`Invalid transaction from ${address}`)
            return false
        }

        const data = JSON.stringify(outputMap)

        const verified = verifySignature(
            address,
            data,
            signature
        )

        if (verified === false) {
            console.error(`Unauthorized or corrupted transaction from ${address}`)
        }
        
        return verifySignature(
            address,
            data,
            signature
        )
    }
}

export default Transaction