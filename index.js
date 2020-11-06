const got = require('got')
const asyncPool = require('tiny-async-pool')

const CS_URL = 'http://localhost:3000/api/realms/default/cards'

const NUMBER_OF_ITERATIONS = 1000

const CONCURRENCY = 5

const run = async () => {
  const params = {
    data: {
      type: 'cards',
      attributes: {
        csTitle: 'test1234',
        csFields: {},
        csCreated: '2020-11-05T16:54:52.782Z',
        csUpdated: '2020-11-05T16:54:52.782Z',
        csRealm: 'http://localhost:3000/api/realms/default'
      },
      relationships: {
        csAdoptsFrom: {
          data: {
            type: 'cards',
            id: 'https://base.cardstack.com/public/cards/base'
          }
        }
      }
    }
  }
  const headers = {
    'Content-type': 'application/vnd.api+json'
  }
  const insertCard = async () => {
    await got.post(CS_URL, {
      headers,
      json: params,
      throwHttpErrors: true
    })
  }

  /*console.time(`[${NUMBER_OF_ITERATIONS} items] Bench CSv2 simple card insert`)

  for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
    await insertCard()
  }

  console.timeEnd(
    `[${NUMBER_OF_ITERATIONS} items] Bench CSv2 simple card insert`
  )*/

  console.time(
    `[${NUMBER_OF_ITERATIONS} items] Bench CSv2 simple parallel card insert`
  )

  const action = insertCard
  await asyncPool(CONCURRENCY, Array(NUMBER_OF_ITERATIONS).fill(), action)

  console.timeEnd(
    `[${NUMBER_OF_ITERATIONS} items] Bench CSv2 simple parallel card insert`
  )
  console.log('finish')
}

run()
