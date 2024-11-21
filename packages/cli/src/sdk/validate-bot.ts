import type * as sdk from '@botpress/sdk'
import * as errors from '../errors'
import * as utils from '../utils'

export const validateBotDefinition = (b: sdk.BotDefinition): void => {
  const { actions, events, states } = b

  const invalidActionNames = _nonCamelCaseKeys(actions ?? {})
  if (invalidActionNames.length) {
    throw new errors.BotpressCLIError(
      `The following action names are not in camelCase: ${invalidActionNames.join(', ')}`
    )
  }

  const invalidEventNames = _nonCamelCaseKeys(events ?? {})
  if (invalidEventNames.length) {
    throw new errors.BotpressCLIError(`The following event names are not in camelCase: ${invalidEventNames.join(', ')}`)
  }

  const invalidStateNames = _nonCamelCaseKeys(states ?? {})
  if (invalidStateNames.length) {
    throw new errors.BotpressCLIError(`The following state names are not in camelCase: ${invalidStateNames.join(', ')}`)
  }

  const interfaceDepsEntries = Object.entries(b.interfaces ?? {})
  const integrationEntries = Object.entries(b.integrations ?? {})
  for (const [_, interfaceDep] of interfaceDepsEntries) {
    const implementation = integrationEntries.find(([, i]) => _implementsInterface(i, interfaceDep))
    if (!implementation) {
      const interfaceRef = `${interfaceDep.definition.name}@${interfaceDep.definition.version}`
      throw new errors.BotpressCLIError(
        `The bot declares a dependency on interface ${interfaceRef} but no integration implements it. Please install an integration that implements this interface.`
      )
    }
  }
}

const _nonCamelCaseKeys = (obj: Record<string, any>): string[] =>
  Object.keys(obj).filter((k) => !utils.casing.is.camelCase(k))

const _implementsInterface = (integration: sdk.IntegrationPackage, intrface: sdk.InterfacePackage): boolean => {
  const interfaceEntries = Object.entries(integration.definition.interfaces ?? {})
  return interfaceEntries.some(
    ([_, i]) => i.name === intrface.definition.name && i.version === intrface.definition.version
  )
}
