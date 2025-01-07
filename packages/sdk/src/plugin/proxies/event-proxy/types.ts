import * as client from '@botpress/client'
import * as utils from '../../../utils/type-utils'
import * as types from '../../types'

type IntegrationEventProxy<TPlugin extends types.BasePlugin> = {
  [TIntegrationName in keyof TPlugin['integrations']]: {
    [TEventName in keyof TPlugin['integrations'][TIntegrationName]['events']]: utils.Merge<
      client.Event,
      { type: TEventName; payload: TPlugin['integrations'][TIntegrationName]['events'][TEventName] }
    >
  }
}

type InterfacesEventProxy<TPlugin extends types.BasePlugin> = {
  [TInterfaceName in keyof TPlugin['interfaces']]: {
    [TEventName in keyof TPlugin['interfaces'][TInterfaceName]['events']]: utils.Merge<
      client.Event,
      { type: TEventName; payload: TPlugin['interfaces'][TInterfaceName]['events'][TEventName] }
    >
  }
}

export type EventProxy<TPlugin extends types.BasePlugin> = utils.Normalize<
  IntegrationEventProxy<TPlugin> & InterfacesEventProxy<TPlugin>
>
