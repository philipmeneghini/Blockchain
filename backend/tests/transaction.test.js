const Transaction = require('../wallet/transaction')
const Wallet = require('../wallet')
const cryptoHash = require('../util/cryptoHash')
const { ec, verifySignature } = require('../util/ECC')

describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount

    beforeEach(() => {
        senderWallet = new Wallet()
        recipient = 'recipient-public-key'
        amount = 5

        transaction = new Transaction({ senderWallet, recipient, amount })
    })

    it('has an `id`', () => {
        expect(transaction).toHaveProperty('id')
    })

    describe('outputMap', () => {
        let transaction, senderWallet, recipient, amount

        beforeEach(() => {
            senderWallet = new Wallet()
            recipient = 'recipient-public-key'
            amount = 5

            transaction = new Transaction({ senderWallet, recipient, amount })
        })

        it('has an output map', () => {
            expect(transaction).toHaveProperty('outputMap')
        })

        it('outputs the amount to the recipient', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount)
        })

        it('outputs the remaining balance for the `sender wallet`', () => {
            expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(senderWallet.balance - amount)
        })
        
    })

    describe('input', () => {
        let transaction, senderWallet, recipient, amount

        beforeEach(() => {
            senderWallet = new Wallet()
            recipient = 'recipient-public-key'
            amount = 5

            transaction = new Transaction({ senderWallet, recipient, amount })
        })

        it('has an input', () => {
            expect(transaction).toHaveProperty('input')
        })

        it('has a `timestamp` in the input', () => {
            expect(transaction.input).toHaveProperty('timestamp')
        })

        it('sets the `amount` to the `senderWallet` balance', () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance)
        })

        it('sets the `address` to the `senderWallet` public key', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey)
        })

        it('signs the input', () => {
            expect(verifySignature({
                publicKey: transaction.input.address,
                data: JSON.stringify(transaction.outputMap),
                signature: transaction.input.signature
            })).toBe(true)
        })
    })

    describe('validTransaction()', () => {
        beforeEach(() => {
            senderWallet = new Wallet()
            recipient = 'recipient-public-key'
            amount = 5
    
            transaction = new Transaction({ senderWallet, recipient, amount })
        })
        describe('when the transaction is valid', () => {
            senderWallet = new Wallet()
            recipient = 'recipient-public-key'
            amount = 5
    
            transaction = new Transaction({ senderWallet, recipient, amount })
            it('returns true', () => {
                expect(Transaction.validTransaction(transaction)).toBe(true)
            })
        })

        describe('when the transaction is invalid', () => {
            describe('and a transaction outputMap value is invalid', () => {
                senderWallet = new Wallet()
                recipient = 'recipient-public-key'
                amount = 5
    
                transaction = new Transaction({ senderWallet, recipient, amount })
                it('returns false', () => {
                    transaction.outputMap['recipient-public-key'] = 95
                    transaction.outputMap[senderWallet.publicKey] = 99999
                    expect(Transaction.validTransaction(transaction)).toBe(false)
                })

                it('returns false', () => {
                    transaction.outputMap['recipient-public-key'] = 10000
                    expect(Transaction.validTransaction(transaction)).toBe(false)
                })
            })

            describe('and the transaction input signature is invalid', () => {
                senderWallet = new Wallet()
                recipient = 'recipient-public-key'
                amount = 5
    
                transaction = new Transaction({ senderWallet, recipient, amount })
                it('returns false', () => {
                    transaction.input.signature = new Wallet().sign('data')
                    expect(Transaction.validTransaction(transaction)).toBe(false)
                })
            })

        })
    })
})