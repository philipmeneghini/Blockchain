import Block from './block'

export interface IChain {
    chain: Block[]
    
    addBlock(data: []): void
    replaceChain(newChain: Block[]): void
}