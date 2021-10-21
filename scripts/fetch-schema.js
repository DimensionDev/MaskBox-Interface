const fs = require('fs');
const prettier = require('prettier');
const fetch = require('node-fetch');

const { getIntrospectionQuery } = require('graphql/utilities/getIntrospectionQuery');
const { buildClientSchema } = require('graphql/utilities/buildClientSchema');
const { printSchema } = require('graphql/utilities/printSchema');

/**
 * @param {Object} opts
 * @param {String} opts.endpoint - graphql endpoint
 * @param {String} opts.schemaFile
 * @param {Object} [opts.headers={}]
 */
async function fetchSchema({ endpoint, headers }) {
  try {
    const { data } = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        operationName: 'IntrospectionQuery',
        query: getIntrospectionQuery(),
        variables: {},
      }),
    }).then((res) => res.json());
    const schema = buildClientSchema(data);
    const content = printSchema(schema);
    return content;
  } catch (err) {
    console.warn('fails to fetch schema', err);
    throw err;
  }
}

const endpoint = 'https://api.thegraph.com/subgraphs/name/dimensiondev/mask-box-rinkeby';
const schemaPath = './schema.graphql';

fetchSchema({
  endpoint,
}).then(async (schema) => {
  const prettierOptions = await prettier.resolveConfig(__filename);
  fs.writeFileSync(schemaPath, prettier.format(schema, { ...prettierOptions, parser: 'graphql' }));
});
