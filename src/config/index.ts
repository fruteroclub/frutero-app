import { Address } from 'viem'
import { arbitrum, base, monadTestnet, optimism, polygon } from 'viem/chains'

const appConfig = {
  tokens: {
    mon: {
      address: '0x0000000000000000000000000000000000000000' as Address,
      decimals: 18,
      symbol: 'MON',
      chains: {
        monadTestnet,
      },
    },
    pulpa: {
      address: '0x029263aA1BE88127f1794780D9eEF453221C2f30' as Address,
      decimals: 18,
      symbol: 'PULPA',
      chains: {
        monadTestnet,
        optimism,
      },
    },
    xoc: {
      address: '0xa411c9Aa00E020e4f88Bc19996d29c5B7ADB4ACf' as Address,
      decimals: 18,
      symbol: 'XOC',
      chains: {
        arbitrum,
        base,
        polygon,
      },
    },
  },
}

export default appConfig
