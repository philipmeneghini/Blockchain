import * as elliptic from 'elliptic'
import cryptoHash from './cryptoHash'

var EC = elliptic.ec
type KeyPair = elliptic.ec.KeyPair
type Signature = elliptic.ec.Signature
const ec: elliptic.ec = new EC('secp256k1')

const verifySignature = (publicKey: string, data: string, signature: elliptic.SignatureInput) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')

    return keyFromPublic.verify(cryptoHash(data), signature)
}

export { ec, verifySignature, KeyPair, Signature }