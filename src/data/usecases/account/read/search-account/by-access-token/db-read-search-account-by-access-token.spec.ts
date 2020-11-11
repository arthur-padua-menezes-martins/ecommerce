import {
  DatabaseSearchAccountByAccessToken
} from './db-read-search-account-by-access-token'
import {
  IDecrypter,
  ISearchAccountByAccessTokenRepository
} from './db-read-search-account-by-access-token-protocols'
import {
  makeDecrypterCryptography,
  makeReadAccount
} from './db-read-search-account-by-access-token-make'
import {
  informationsOfAccessTokenHttpRequestHeaders
} from './db-read-search-account-by-access-token-utils'

interface ISystemUnderTestTypes {
  systemUnderTest: DatabaseSearchAccountByAccessToken
  decrypterStub: IDecrypter
  readAccountStub: ISearchAccountByAccessTokenRepository
}
const makeSystemUnderTest = async (): Promise<ISystemUnderTestTypes> => {
  const decrypterStub = await makeDecrypterCryptography()
  const readAccountStub = await makeReadAccount()
  const systemUnderTest = new DatabaseSearchAccountByAccessToken(decrypterStub, readAccountStub)

  return {
    systemUnderTest,
    decrypterStub,
    readAccountStub
  }
}

const accessToken = informationsOfAccessTokenHttpRequestHeaders['x-access-token']
const role = 'any_role'

describe('DatabaseSearchAccountByAccessToken', () => {
  test('should call decrypter with correct values <version: 0.0.1>', async () => {
    const { systemUnderTest, decrypterStub } = await makeSystemUnderTest()

    const spyOnDecrypt = jest.spyOn(decrypterStub, 'decrypt')
    await systemUnderTest.searchByAccessToken(accessToken, role)

    expect(spyOnDecrypt).toHaveBeenCalledWith(accessToken, role)
  })

  test('should return null if decrypter return null <version: 0.0.1>', async () => {
    const { systemUnderTest, decrypterStub } = await makeSystemUnderTest()

    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const account = await systemUnderTest.searchByAccessToken(accessToken, role)

    expect(account).toBeNull()
  })

  test('should call searchByAccessToken with correct values <version: 0.0.1>', async () => {
    const { systemUnderTest, readAccountStub } = await makeSystemUnderTest()

    const spyOnSearchByAccessToken = jest.spyOn(readAccountStub, 'searchByAccessToken')
    await systemUnderTest.searchByAccessToken(accessToken, role)

    expect(spyOnSearchByAccessToken).toHaveBeenCalledWith(accessToken, role)
  })
})
