import Block from './block'

export interface IChain {
    chain: Block[]

    addBlock(data: string[] | string): void
    replaceChain(newChain: Block[]): void
}