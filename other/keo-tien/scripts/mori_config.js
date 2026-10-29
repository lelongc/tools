// Moribundus site config: chain, contract and launch switch.
(function (window) {
  'use strict';

  window.MORIBUNDUS_CONFIG = {

    live: false,

    chainId: 56,
    chainName: 'BNB Smart Chain',
    explorer: 'https://bscscan.com',
    rpcUrl: 'https://bsc-dataseed.binance.org',

    addresses: {
      moribundus: '',
      whitelist:  '0xC633c2Cf66eAf36A8B1f8d970c17104423D9EAd6',
    },

    whitelist: {
      open: true,
      tweetId: '2115776430235656293',
      postAuthor: 'moribundusBNB',
      replyText: 'Bound to die. Paid at death. ☠',
      gtdSpots: 2222,
      fcfsSpots: 4444,
    },

    mintOpensAt:    '2026-10-30T12:00:00Z',
    soulPriceBnb:   '',
    soulSupply:     4444,
    soulsPerWallet: 1,
    soulLifeHours:  16,
    epochHours:     4,
  };
})(window);
