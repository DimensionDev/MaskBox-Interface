/*! For license information please see main-266f9154e77717ab5975.js.LICENSE.txt */
  query MaskBox($id: ID!) {
    maskbox(id: $id) {
      id
      box_id
      chain_id
      name
      creator
      nft_address
      start_time
      end_time
      sell_all
      nft_contract {
        address
        name
      }
    }
  }
`,am=Gg`
  query MaskBoxes($first: Int! = 10, $skip: Int! = 0) {
    maskboxes(
      orderBy: create_time
      orderDirection: desc
      first: $first
      skip: $skip
      where: { canceled: false }
    ) {
      id
      box_id
      chain_id
      name
      creator
      nft_address
      start_time
      end_time
      sell_all
      nft_contract {
        address
        name
      }
    }
  }
`,sm=Gg`
  query MaskBoxesOf($first: Int! = 10, $skip: Int! = 0, $account: Bytes!) {
    maskboxes(
      orderBy: create_time
      orderDirection: desc
      first: $first
      skip: $skip
      where: { creator: $account }
    ) {
      id
      box_id
      chain_id
      name
      creator
      nft_address
      start_time
      end_time
      sell_all
      canceled
      claimed
      nft_contract {
        address
        name
      }
      sold_nft_list
    }
  }
`,um=Gg`
  query CheckMaskBoxesOf($account: Bytes!) {
    maskboxes(first: 1) {
      id
    }
  }
`,cm=Gg`
  query SoldNFTList($id: ID!) {
    maskbox(id: $id) {
      id
      sold_nft_list
    }
  }
//# sourceMappingURL=main-266f9154e77717ab5975.js.map