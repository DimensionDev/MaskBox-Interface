# MaskBox Interface

## Setup

```bash
yarn
yarn dev
# then open http://localhost:5000
```

## Subgraph

We use thegraph to index data, the subgraph is [DimensionDev/MaskBox-Subgraph](https://github.com/DimensionDev/MaskBox-Subgraph)

After updating and deeplying the subgraph, you should update graphql schema we
use in this repo with:

```sh
yarn fetch-schema
```

then regenerate relevant typescript code:

```sh
yarn gen:graphql
```

## Assets and icons

```
yarn gen:assets
yarn gen:icons
```

Check out `./scripts/generate-assets.js` and `./scripts/generate-icons.js` for details.
