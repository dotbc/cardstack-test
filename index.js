const axios = require('axios')
const needle = require('needle')
const got = require('got')
const superagent = require('superagent')

const JIRA_URL = 'https://dotbc.atlassian.net/rest/api/3/issue'
const JIRA_USER = 'ryan@verifi.media'
const JIRA_PASSWORD = 'zHYdaW6xVcVLjtGWeGX757F7'

const params = {
  fields: {
    summary: '[ERROR] test',
    project: {
      key: 'VBT'
    },
    description: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '{"foo": "bar"}',
              marks: [
                {
                  type: 'code'
                }
              ]
            }
          ]
        }
      ]
    },
    issuetype: {
      name: 'Bug'
    }
  }
}

const run = async () => {
  const headers = {
    Authorization:
      'Basic ' + Buffer.from(`${JIRA_USER}:${JIRA_PASSWORD}`).toString('base64')
  }
  let res = await got.post(JIRA_URL, {
    headers,
    json: params,
    throwHttpErrors: false
  })
  console.log('[GOT] ', res.statusCode, res.body)

  res = await superagent
    .post(JIRA_URL)
    .auth(JIRA_USER, JIRA_PASSWORD)
    .send(params)
  console.log('[SUPERAGENT] ', res.statusCode, res.body)

  try {
    res = await axios.post(JIRA_URL, params, {
      headers
    })
    console.log('[AXIOS] ', res.status, res.data)
  } catch (err) {
    console.log('[AXIOS] ', err.response.status, err.response.data)
  }
  res = await needle('post', JIRA_URL, params, {
    json: true,
    username: JIRA_USER,
    password: JIRA_PASSWORD
  })
  console.log('[NEEDLE] ', res.statusCode, res.body)
}

run()
