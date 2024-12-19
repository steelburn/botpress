import { BotSpecificClient } from '../../bot'
import { PluginInterfaceExtension, PluginRuntimeProps } from '../../plugin'
import { BasePlugin } from '../types'
import { ActionProxy } from './types'

export const proxy = <TPlugin extends BasePlugin>(
  client: BotSpecificClient<TPlugin>,
  runtime: PluginRuntimeProps<TPlugin>
): ActionProxy<TPlugin> =>
  new Proxy<Partial<ActionProxy<TPlugin>>>(
    {},
    {
      get: (_target, prop1) => {
        return new Proxy(
          {},
          {
            get: (_target, prop2) => {
              return (input: unknown) =>
                _callAction({
                  client,
                  runtime,
                  integrationOrInterfaceName: prop1 as string,
                  methodName: prop2 as string,
                  input,
                })
            },
          }
        )
      },
    }
  ) as ActionProxy<TPlugin>

type CallActionsProps = {
  client: BotSpecificClient<any>
  runtime: PluginRuntimeProps<any>
  integrationOrInterfaceName: string
  methodName: string
  input: unknown
}
const _callAction = async ({ client, runtime, integrationOrInterfaceName, methodName, input }: CallActionsProps) => {
  const interfaceExtension: PluginInterfaceExtension<any> = runtime.interfaces[integrationOrInterfaceName] ?? {
    name: integrationOrInterfaceName,
    version: '0.0.0',
    entities: {},
    actions: {},
    events: {},
    channels: {},
  }

  const prefix = interfaceExtension.name
  const suffix = interfaceExtension.actions[methodName]?.name ?? methodName
  const fullActionName = `${prefix}:${suffix}`
  const response = await client.callAction({
    type: fullActionName,
    input,
  })
  return response.output
}
