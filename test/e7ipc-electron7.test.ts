import { createClient, createServer, Handler } from '@/e7ipc-electron7'
import { Mock } from './mock'

/* eslint @typescript-eslint/no-explicit-any: 0 */

type MapType<T, U = keyof T> = U extends keyof T ? T[U] : never

interface Requests {
  hello: {
    type: 'hello'
  }
  bye: {
    type: 'bye'
  }
}

type Request = MapType<Requests>

interface Responses {
  ok: {
    type: 'ok'
  }
}

type Response = MapType<Responses>

const handler: Handler<Request, Response> = async (_, req) => {
  if (req.type === 'hello') {
    return { type: 'ok' }
  } else if (req.type === 'bye') {
    throw new Error(`Don't say good bye`)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unreachable: never = req
    throw new Error('unreachable')
  }
}

describe('Client, Server', () => {
  test('normal request', async () => {
    const mock = new Mock()
    const client = createClient<Request, Response>(mock as any, 'test')
    const server = createServer<Request, Response>(mock as any, 'test')

    server.handle(handler)

    const r1 = await client.invoke({ type: 'hello' })
    expect(r1).toEqual({ type: 'ok' })

    const r2 = await client.invoke({ type: 'bye' }).catch((err) => {
      expect(err).toBeInstanceOf(Error)
      return null
    })
    expect(r2).toBeNull()
  })

  test('handle, removeHandler, handleOnce', async () => {
    const mock = new Mock()
    const client = createClient<Request, Response>(mock as any, 'test')
    const server = createServer<Request, Response>(mock as any, 'test')

    const r1 = await client.invoke({ type: 'hello' }).catch((err) => {
      expect(err).toBeInstanceOf(Error)
      return null
    })
    expect(r1).toBeNull()

    server.handleOnce(handler)
    expect(() => {
      server.handle(handler)
    }).toThrowError()

    const r2 = await client.invoke({ type: 'hello' })
    expect(r2).toEqual({ type: 'ok' })

    const r3 = await client.invoke({ type: 'hello' }).catch((err) => {
      expect(err).toBeInstanceOf(Error)
      return null
    })
    expect(r3).toBeNull()
  })
})
