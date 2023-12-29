import * as elliptic from 'elliptic'
import cryptoHash from './cryptoHash'

var EC = elliptic.ec
const ec = new EC('secp256k1')

const verifySignature = (publicKey: string, data: [], signature: elliptic.SignatureInput) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')

    return keyFromPublic.verify(cryptoHash(data), signature)
}

export { ec, verifySignature }