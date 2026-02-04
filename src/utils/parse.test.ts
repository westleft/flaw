import { describe, expect, it } from '@jest/globals'
import { parseTokensFromUrl } from './parse'

describe('parseTokensFromUrl', () => {
  it('should parse tokens from url', () => {
    const accessToken = '1234567890'
    const refreshToken = '1234567890'
    const url = `https://flaw.com?access_token=${accessToken}&refresh_token=${refreshToken}`

    const tokens = parseTokensFromUrl(url)

    expect(tokens).toEqual({ accessToken, refreshToken })
  })
})
