const Wallet = require('../wallet')
const { verifySignature } = require('../util/ECC')
const { STARTING_BALANCE } = require('../config')
const Transaction = require('../wallet/transaction')

describe('Wallet', () => {
    let wallet
    beforeEach(() => {
        wallet = new Wallet()
    })

    it('has a balance', () => {
        expect(wallet).toHaveProperty('balance')
    })

    it('has a balance that is assigned by the config file', () => {
        expect(wallet.balance).toEqual(STARTING_BALANCE)
    })

    it('has a publicKey', () => {
        expect(wallet).toHaveProperty('publicKey')
    })

    describe('signing data', () => {
        const data = 'foo-data'
        let wallet

        beforeEach(() => {
            wallet = new Wallet()
        })

        it('verifies a signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data)
                })
            ).toBe(true)
        })

        it('does not verify a signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false)
        })
    })

    describe('createTransaction()', () => {
        describe('and the amount exceeds the balance', () => {
            it('throws an error', () => {
                expect(() => wallet.createTransaction({amount: 999999, recipient: 'foo-recipient'}))
                .toThrow('Amount exceeds balance')
            })
        })

        describe('and the amount is valid', () => {
            let transaction, amount, recipient

            beforeEach(() => {
                amount = 5
                recipient = 'foo-recipient'
            })

            
            it('creates an instance of `Transaction`', () => {
                wallet = new Wallet()
                transaction = wallet.createTransaction({ amount, recipient })
                expect(transaction instanceof Transaction).toBe(true)
            })

            it('matches the transaction input with the wallet', () => {
                wallet = new Wallet()
                transaction = wallet.createTransaction({ amount, recipient })
                expect(transaction.input.address).toEqual(wallet.publicKey)
            })

            it('output the amount to the recipient', () => {
                wallet = new Wallet()
                transaction = wallet.createTransaction({ amount, recipient })
                expect(transaction.outputMap[recipient]).toEqual(amount)
            })
        })
    })
})