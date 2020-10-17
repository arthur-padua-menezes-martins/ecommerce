import { IHttpRequest, IHttpResponse, IAddAccount } from './sign-up-protocols'
import { MissingParamError, InvalidParamError } from '../../errors/export-all'
import { FieldValidationWithRegex } from '../../regExp/field-validation'
import {
  httpRequestBodyFields, httpRequestBodyAddressFields,
  ok, badRequest, serverError
} from '../../helpers/export-all'

export class SignUpController {
  private readonly addAccount

  constructor (addAccount: IAddAccount) {
    this.addAccount = addAccount
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse | any> {
    try {
      var MissingFields: string = ''
      for (const field of httpRequestBodyFields) {
        MissingFields += !(field in httpRequest.body) ? `${field} ` : ''
      }
      if ('address' in httpRequest.body && httpRequest.body.address !== undefined) {
        for (const addressField of httpRequestBodyAddressFields) {
          MissingFields += !(addressField in httpRequest.body.address) ? `${addressField} ` : ''
        }
      }

      const { password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest({}, '', new InvalidParamError('passwordConfirmation'))
      }

      if (MissingFields !== '') {
        return badRequest({}, '', new MissingParamError(MissingFields))
      }

      const fieldValidationWithRegex = new FieldValidationWithRegex({
        name: async (value: string): Promise<boolean> => await Promise.resolve(
          Boolean(value.match(/^[a-zA-Z\u00C0-\u017F´]+\s+[a-zA-Z\u00C0-\u017F´]{0,}$/))
        ),
        email: async (value: string): Promise<boolean> => await Promise.resolve(
          Boolean(value.match(/^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/))
        ),
        password: async (value: string): Promise<boolean> => await Promise.resolve(
          Boolean(value.match(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*[\W_\x7B-\xFF]).{8,16}$/))
        )
      })
      let invalidFields: string[] = []
      for (const field of httpRequestBodyFields) {
        invalidFields.push(await fieldValidationWithRegex.options(field, httpRequest.body[field]))
      }
      for (const field of httpRequestBodyAddressFields) {
        invalidFields.push(await fieldValidationWithRegex.options(field, httpRequest.body[field]))
      }
      invalidFields = (invalidFields.filter(field => field !== ''))
      if (invalidFields.length > 0) {
        return badRequest({}, '', null, invalidFields)
      }

      const { name, email, address } = httpRequest.body
      const httpRequestBody = {
        name,
        email,
        password,
        passwordConfirmation,
        address
      }
      const newAccount = await this.addAccount.add(httpRequestBody)

      return ok(newAccount)
    } catch (error) {
      return serverError()
    }
  }
}
