import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(true)
        expect(res.text).toContain('Home')
      })
  })
})

describe('GET /info', () => {
  it('should return app info', () => {
    return request(app)
      .get('/info')
      .expect('Content-Type', 'application/json')
      .expect(res => {
        expect(res.text).toBe('{"app":"Digital Prison Reporting","activeAgencies":["***"]}')
      })
  })
})
