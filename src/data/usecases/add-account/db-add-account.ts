import { IAddAccount, IAddAccountModel } from '../../../domain/usecases/add-account'
import { IAccountModel } from '../../../domain/models/account'
import { Encrypter } from '../../protocols/encrypter'

export class DatabaseAddAccount implements IAddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: IAddAccountModel): Promise<IAccountModel> {
    await this.encrypter.encrypt(account.password)
    return await Promise.resolve(null)
  }
}
