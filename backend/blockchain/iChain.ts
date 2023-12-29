import Block from './block'

export interface IChain {
    addBlock(data: []): void
    replaceChain(newChain: Block[]): void
}