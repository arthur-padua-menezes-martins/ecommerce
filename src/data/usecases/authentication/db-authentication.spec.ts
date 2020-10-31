import { DatabaseAuthenticationController } from './db-authentication'
import {
  LoadAccountByEmailRepository, IAuthenticationModel,
  IHashComparer,
  IEncrypter,
  UpdateAccessTokenRepository,
  IAccountModel
} from './db-authentication-protocols'
import { signInHttpRequestBodyMatchComplete, accountModelMatch } from './db-authentication-utils'

const makeLoadAccountByEmailRepository = async (): Promise<LoadAccountByEmailRepository> => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<IAccountModel> {
      const account: IAccountModel = accountModelMatch
      return await Promise.resolve(account)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = async (): Promise<IHashComparer> => {
  class HashComparerStub implements IHashComparer {
    async compare (password: string, passwordHash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashComparerStub()
}

const accessToken = 'any_token'
const makeEncrypterGenerator = async (): Promise<IEncrypter> => {
  class EncrypterStub implements IEncrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve(accessToken)
    }
  }

  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = async (): Promise<UpdateAccessTokenRepository> => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, accessToken: string): Promise<void> {

    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

interface ISystemUnderTestTypes {
  systemUnderTest: DatabaseAuthenticationController
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: IHashComparer
  encrypterStub: IEncrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}
const makeSystemUnderTest = async (): Promise<ISystemUnderTestTypes> => {
  const loadAccountByEmailRepositoryStub = await makeLoadAccountByEmailRepository()
  const hashComparerStub = await makeHashComparer()
  const encrypterStub = await makeEncrypterGenerator()
  const updateAccessTokenRepositoryStub = await makeUpdateAccessTokenRepository()
  const systemUnderTest = new DatabaseAuthenticationController(
    loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub
  )

  return {
    systemUnderTest,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

const authentication: IAuthenticationModel = signInHttpRequestBodyMatchComplete

describe('DatabaseAuthenticationController Usecases', () => {
  test('should call LoadAccountByEmailRepository with correct email <version: 0.0.1>', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = await makeSystemUnderTest()
    const spyOnLoad = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await systemUnderTest.auth(authentication)
    expect(spyOnLoad).toHaveBeenCalledWith(authentication.email)
  })

  test('should throw if LoadAccountByEmailRepository throws <version: 0.0.1>', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = await makeSystemUnderTest()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const authorization = systemUnderTest.auth(authentication)
    await expect(authorization).rejects.toThrow()
  })

  test('should return an null if LoadAccountByEmailRepository returns null <version: 0.0.1>', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = await makeSystemUnderTest()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.resolve(null))

    const authorization = await systemUnderTest.auth(authentication)
    expect(authorization).toBe(null)
  })

  test('should call HashComparer with correct values <version: 0.0.1>', async () => {
    const { systemUnderTest, hashComparerStub } = await makeSystemUnderTest()
    const spyOnCompare = jest.spyOn(hashComparerStub, 'compare')

    await systemUnderTest.auth(authentication)
    expect(spyOnCompare).toHaveBeenCalledWith(authentication.password, accountModelMatch.password)
  })

  test('should throw if HashComparer throws <version: 0.0.1>', async () => {
    const { systemUnderTest, hashComparerStub } = await makeSystemUnderTest()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const authorization = systemUnderTest.auth(authentication)
    await expect(authorization).rejects.toThrow()
  })

  test('should return an null if HashComparer fails <version: 0.0.1>', async () => {
    const { systemUnderTest, hashComparerStub } = await makeSystemUnderTest()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const authorization = await systemUnderTest.auth(authentication)
    expect(authorization).toBe(null)
  })

  test('should call Encrypter with correct id <version: 0.0.1>', async () => {
    const { systemUnderTest, encrypterStub } = await makeSystemUnderTest()
    const spyOnEncrypt = jest.spyOn(encrypterStub, 'encrypt')

    await systemUnderTest.auth(authentication)
    expect(spyOnEncrypt).toHaveBeenCalledWith(accountModelMatch.id)
  })

  test('should return an null if Encrypter fails <version: 0.0.1>', async () => {
    const { systemUnderTest, encrypterStub } = await makeSystemUnderTest()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const authorization = systemUnderTest.auth(authentication)
    await expect(authorization).rejects.toThrow()
  })

  test('must return the authentication token if Encrypter succeeds <version: 0.0.1>', async () => {
    const { systemUnderTest } = await makeSystemUnderTest()

    const authorization = await systemUnderTest.auth(authentication)
    expect(authorization).toBe(accessToken)
  })

  test('should call UpdateAccessTokenRepository with correct values <version: 0.0.1>', async () => {
    const { systemUnderTest, updateAccessTokenRepositoryStub } = await makeSystemUnderTest()
    const spyOnUpdate = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    await systemUnderTest.auth(authentication)
    expect(spyOnUpdate).toHaveBeenCalledWith(accountModelMatch.id, accessToken)
  })

  test('should return an Error if UpdateAccessTokenRepository returns Error <version: 0.0.1>', async () => {
    const { systemUnderTest, updateAccessTokenRepositoryStub } = await makeSystemUnderTest()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(Promise.reject(new Error()))

    const authorization = systemUnderTest.auth(authentication)
    await expect(authorization).rejects.toThrow()
  })
})