import * as utils from '../../utils/type-utils'
import { BaseBot } from '../types'

type IntegrationActionProxy<TBot extends BaseBot> = {
  [TIntegrationName in keyof TBot['integrations']]: {
    [TActionName in keyof TBot['integrations'][TIntegrationName]['actions']]: (
      input: TBot['integrations'][TIntegrationName]['actions'][TActionName]['input']
    ) => Promise<TBot['integrations'][TIntegrationName]['actions'][TActionName]['output']>
  }
}

type InterfacesActionProxy<TBot extends BaseBot> = {
  [TInterfaceName in keyof TBot['interfaces']]: {
    [TActionName in keyof TBot['interfaces'][TInterfaceName]['actions']]: (
      input: TBot['interfaces'][TInterfaceName]['actions'][TActionName]['input']
    ) => Promise<TBot['interfaces'][TInterfaceName]['actions'][TActionName]['output']>
  }
}

// TODO: add self bot actions in proxy

export type ActionProxy<TBot extends BaseBot> = utils.Normalize<
  IntegrationActionProxy<TBot> & InterfacesActionProxy<TBot>
>
