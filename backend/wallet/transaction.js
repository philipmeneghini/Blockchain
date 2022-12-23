const { v1: uuidv1 }= require('uuid')
const Wallet = require('.')
const cryptoHash = require('../util/cryptoHash')
const { verifySignature } = require('../util/ECC')

class Transaction {

    constructor({ senderWallet, recipient, amount }) {
        this.id = uuidv1()
        this.outputMap = {}
        this.outputMap[recipient] = amount
        this.outputMap[senderWallet.publicKey] = senderWallet.balance - amount
        const data = JSON.stringify(this.outputMap)

        this.input = {}
        this.input['timestamp'] = Date.now()
        this.input['amount'] = senderWallet.balance
        this.input['address'] = senderWallet.publicKey
        this.input['signature'] = senderWallet.sign(data)
    }

    static validTransaction(transaction) {
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

        const verified = verifySignature({
            publicKey: address,
            data,
            signature
        })

        if (verified === false) {
            console.error(`Unauthorized or corrupted transaction from ${address}`)
        }
        
        return verifySignature({
            publicKey: address,
            data,
            signature
        })
    }
}

module.exports = Transaction