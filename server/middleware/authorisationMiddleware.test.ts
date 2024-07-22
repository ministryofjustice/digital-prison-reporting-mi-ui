import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'

import authorisationMiddleware from './authorisationMiddleware'

function createToken(authorities: string[]) {
  const payload = {
    user_name: 'USER1',
    scope: ['read', 'write'],
    auth_source: 'nomis',
    authorities,
    jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

describe('authorisationMiddleware', () => {
  const next = jest.fn()

  function createReqWithOriginalURl(originalUrl: string): Request {
    return {
      originalUrl,
    } as unknown as Request
  }

  function createResWithToken({ authorities }: { authorities: string[] }): Response {
    return {
      locals: {
        user: {
          token: createToken(authorities),
        },
      },
      redirect: jest.fn(),
    } as unknown as Response
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return next when no required roles', async () => {
    const req = createReqWithOriginalURl('/reports')
    const res = createResWithToken({ authorities: [] })

    await authorisationMiddleware()(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should redirect when user has no authorised roles', async () => {
    const req = createReqWithOriginalURl('/reports')
    const res = createResWithToken({ authorities: [] })

    await authorisationMiddleware(['SOME_REQUIRED_ROLE'])(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith('/roleError')
  })

  it('should return next when user has authorised role', async () => {
    const req = createReqWithOriginalURl('/reports')
    const res = createResWithToken({ authorities: ['SOME_REQUIRED_ROLE'] })

    await authorisationMiddleware(['SOME_REQUIRED_ROLE'])(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should return next when user has no authorised roles on home page', async () => {
    const req = createReqWithOriginalURl('/')
    const res = createResWithToken({ authorities: [] })

    await authorisationMiddleware(['SOME_REQUIRED_ROLE'])(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })
})
