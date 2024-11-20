import { InterfacePackage } from '../../package'
import * as utils from '../../utils'
import { z } from '../../zui'
import { SchemaStore, BrandedSchema, createStore, isBranded, getName } from './branded-schema'
import { BaseConfig, BaseEvents, BaseActions, BaseChannels, BaseStates, BaseEntities, BaseConfigs } from './generic'
import {
  ConfigurationDefinition,
  EventDefinition,
  ChannelDefinition,
  ActionDefinition,
  StateDefinition,
  UserDefinition,
  SecretDefinition,
  EntityDefinition,
  AdditionalConfigurationDefinition,
  MessageDefinition,
} from './types'

export * from './types'

export type InterfaceImplementationStatement = {
  id?: string
  name: string
  version: string
  entities: Record<string, { name: string; schema: z.Schema }>
  actions: Record<string, { name: string }>
  events: Record<string, { name: string }>
  channels: Record<string, { name: string }>
}

export type IntegrationDefinitionProps<
  TConfig extends BaseConfig = BaseConfig,
  TConfigs extends BaseConfigs = BaseConfigs,
  TEvents extends BaseEvents = BaseEvents,
  TActions extends BaseActions = BaseActions,
  TChannels extends BaseChannels = BaseChannels,
  TStates extends BaseStates = BaseStates,
  TEntities extends BaseEntities = BaseEntities
> = {
  name: string
  version: string

  title?: string
  description?: string
  icon?: string
  readme?: string

  identifier?: {
    extractScript?: string
    fallbackHandlerScript?: string
  }

  configuration?: ConfigurationDefinition<TConfig>
  configurations?: {
    [K in keyof TConfigs]: AdditionalConfigurationDefinition<TConfigs[K]>
  }

  events?: { [K in keyof TEvents]: EventDefinition<TEvents[K]> }

  actions?: {
    [K in keyof TActions]: ActionDefinition<TActions[K]>
  }

  channels?: {
    [K in keyof TChannels]: ChannelDefinition<TChannels[K]>
  }

  states?: {
    [K in keyof TStates]: StateDefinition<TStates[K]>
  }

  user?: UserDefinition

  secrets?: Record<string, SecretDefinition>

  entities?: {
    [K in keyof TEntities]: EntityDefinition<TEntities[K]>
  }

  interfaces?: Record<string, InterfaceImplementationStatement>
}

type ActionsOfPackage<TPackage extends InterfacePackage> = {
  [K in keyof TPackage['definition']['actions']]: NonNullable<TPackage['definition']['actions']>[K]
}
type EventsOfPackage<TPackage extends InterfacePackage> = {
  [K in keyof TPackage['definition']['events']]: NonNullable<TPackage['definition']['events']>[K]
}
type ChannelsOfPackage<TPackage extends InterfacePackage> = {
  [K in keyof TPackage['definition']['channels']]: NonNullable<TPackage['definition']['channels']>[K]
}
type EntitiesOfPackage<TPackage extends InterfacePackage> = {
  [K in keyof TPackage['definition']['entities']]: NonNullable<TPackage['definition']['entities']>[K]['schema']
}

type ExtensionBuilderInput<TIntegrationEntities extends BaseEntities> = {
  entities: SchemaStore<TIntegrationEntities>
}

type ExtensionBuilderOutput<
  TInterfaceEntities extends BaseEntities,
  TInterfaceActions extends Record<string, any>,
  TInterfaceEvents extends Record<string, any>,
  TInterfaceChannels extends Record<string, any>
> = {
  entities: {
    [K in keyof TInterfaceEntities]: BrandedSchema<z.ZodSchema<z.infer<TInterfaceEntities[K]>>>
  }
  actions?: {
    [K in keyof TInterfaceActions]?: { name: string }
  }
  events?: {
    [K in keyof TInterfaceEvents]?: { name: string }
  }
  channels?: {
    [K in keyof TInterfaceChannels]?: { name: string }
  }
}

type ExtensionBuilder<TIntegrationEntities extends BaseEntities, TPackage extends InterfacePackage> = (
  input: ExtensionBuilderInput<TIntegrationEntities>
) => ExtensionBuilderOutput<
  EntitiesOfPackage<TPackage>,
  ActionsOfPackage<TPackage>,
  EventsOfPackage<TPackage>,
  ChannelsOfPackage<TPackage>
>

export class IntegrationDefinition<
  TConfig extends BaseConfig = BaseConfig,
  TConfigs extends BaseConfigs = BaseConfigs,
  TEvents extends BaseEvents = BaseEvents,
  TActions extends BaseActions = BaseActions,
  TChannels extends BaseChannels = BaseChannels,
  TStates extends BaseStates = BaseStates,
  TEntities extends BaseEntities = BaseEntities
> {
  public readonly name: this['props']['name']
  public readonly version: this['props']['version']
  public readonly title: this['props']['title']
  public readonly description: this['props']['description']
  public readonly icon: this['props']['icon']
  public readonly readme: this['props']['readme']
  public readonly configuration: this['props']['configuration']
  public readonly configurations: this['props']['configurations']
  public readonly events: this['props']['events']
  public readonly actions: this['props']['actions']
  public readonly channels: this['props']['channels']
  public readonly states: this['props']['states']
  public readonly user: this['props']['user']
  public readonly secrets: this['props']['secrets']
  public readonly identifier: this['props']['identifier']
  public readonly entities: this['props']['entities']
  public readonly interfaces: this['props']['interfaces']
  public constructor(
    public readonly props: IntegrationDefinitionProps<
      TConfig,
      TConfigs,
      TEvents,
      TActions,
      TChannels,
      TStates,
      TEntities
    >
  ) {
    this.name = props.name
    this.version = props.version
    this.icon = props.icon
    this.readme = props.readme
    this.title = props.title
    this.identifier = props.identifier
    this.description = props.description
    this.configuration = props.configuration
    this.configurations = props.configurations
    this.events = props.events
    this.actions = props.actions
    this.channels = props.channels
    this.states = props.states
    this.user = props.user
    this.secrets = props.secrets
    this.entities = props.entities
    this.interfaces = props.interfaces
  }

  public extend<P extends InterfacePackage>(interfacePkg: P, builder: ExtensionBuilder<TEntities, P>): this {
    const extensionBuilderOutput = builder({
      entities: createStore(this.entities),
    })

    const {
      entities: builderEntities,
      actions: builderActions,
      channels: builderChannels,
      events: builderEvents,
    } = extensionBuilderOutput

    const actionAliases = (builderActions ?? {}) as Record<string, { name?: string }>
    const eventAliases = (builderEvents ?? {}) as Record<string, { name?: string }>
    const channelAliases = (builderChannels ?? {}) as Record<string, { name?: string }>

    const unbrandedEntity = utils.records.pairs(builderEntities).find(([_k, e]) => !isBranded(e))
    if (unbrandedEntity) {
      // this means the user tried providing a plain schema without referencing an entity from the integration
      throw new Error(
        `Cannot extend interface "${interfacePkg.definition.name}" with entity "${unbrandedEntity[0]}"; the provided schema is not part of the integration's entities.`
      )
    }

    const self = this as utils.types.Writable<IntegrationDefinition>
    self.interfaces ??= {}

    const interfaceTypeArguments = utils.records.mapValues(builderEntities, (e) => ({
      name: getName(e),
      schema: e.schema,
    }))

    const entityNames = Object.values(interfaceTypeArguments).map((e) => e.name)

    const interfaceActionAliases: InterfaceImplementationStatement['actions'] = utils.records.mapValues(
      interfacePkg.definition.actions ?? {},
      (_action, key) => ({ name: actionAliases[key]?.name ?? key })
    )

    const interfaceEventsAliases: InterfaceImplementationStatement['events'] = utils.records.mapValues(
      interfacePkg.definition.events ?? {},
      (_event, key) => ({ name: eventAliases[key]?.name ?? key })
    )

    const interfaceChannelsAliases: InterfaceImplementationStatement['channels'] = utils.records.mapValues(
      interfacePkg.definition.channels ?? {},
      (_channel, key) => ({ name: channelAliases[key]?.name ?? key })
    )

    const interfaceImplStatement: InterfaceImplementationStatement = {
      id: 'id' in interfacePkg ? interfacePkg.id : undefined,
      name: interfacePkg.definition.name,
      version: interfacePkg.definition.version,
      entities: interfaceTypeArguments,
      actions: interfaceActionAliases,
      events: interfaceEventsAliases,
      channels: interfaceChannelsAliases,
    }

    const key =
      entityNames.length === 0
        ? interfacePkg.definition.name
        : `${interfacePkg.definition.name}<${entityNames.join(',')}>`

    self.interfaces[key] = interfaceImplStatement

    this._resolveInterface(interfacePkg, interfaceImplStatement)

    return this
  }

  private _resolveInterface = (intrface: InterfacePackage, statement: InterfaceImplementationStatement): void => {
    const self = this as utils.types.Writable<IntegrationDefinition>

    const actions: Record<string, ActionDefinition> = {}
    const events: Record<string, EventDefinition> = {}
    const channels: Record<string, ChannelDefinition> = {}

    const entitySchemas = utils.records.mapValues(statement.entities ?? {}, (entity) => entity.schema)

    // dereference actions
    for (const [actionName, action] of Object.entries(intrface.definition.actions ?? {})) {
      const resolvedInputSchema = action.input.schema.dereference(entitySchemas) as z.AnyZodObject
      const resolvedOutputSchema = action.output.schema.dereference(entitySchemas) as z.AnyZodObject

      const newActionName = statement.actions[actionName]?.name ?? actionName
      actions[newActionName] = {
        ...action,
        input: { schema: resolvedInputSchema },
        output: { schema: resolvedOutputSchema },
      }
      statement.actions[actionName] = { name: newActionName }
    }

    // dereference events
    for (const [eventName, event] of Object.entries(intrface.definition.events ?? {})) {
      const resolvedEventSchema = event.schema.dereference(entitySchemas) as z.AnyZodObject
      const newEventName = statement.events[eventName]?.name ?? eventName
      events[newEventName] = { ...event, schema: resolvedEventSchema }
      statement.events[eventName] = { name: newEventName }
    }

    // dereference channels
    for (const [channelName, channel] of Object.entries(intrface.definition.channels ?? {})) {
      const messages: Record<string, { schema: z.AnyZodObject }> = {}
      for (const [messageName, message] of Object.entries(channel.messages)) {
        const resolvedMessageSchema = message.schema.dereference(entitySchemas) as z.AnyZodObject
        // no renaming for messages as they are already contained within a channel that acts as a namespace
        messages[messageName] = { ...message, schema: resolvedMessageSchema }
      }
      const newChannelName = statement.channels[channelName]?.name ?? channelName
      channels[newChannelName] = { ...channel, messages }
      statement.channels[channelName] = { name: newChannelName }
    }

    self.actions = utils.records.mergeRecords(self.actions ?? {}, actions, this._mergeActions)
    self.channels = utils.records.mergeRecords(self.channels ?? {}, channels, this._mergeChannels)
    self.events = utils.records.mergeRecords(self.events ?? {}, events, this._mergeEvents)

    return
  }

  private _mergeActions = (a: ActionDefinition, b: ActionDefinition): ActionDefinition => {
    return {
      ...a,
      ...b,
      input: {
        schema: a.input.schema.merge(b.input.schema),
      },
      output: {
        schema: a.output.schema.merge(b.output.schema),
      },
    }
  }

  private _mergeEvents = (a: EventDefinition, b: EventDefinition): EventDefinition => {
    return {
      ...a,
      ...b,
      schema: a.schema.merge(b.schema),
    }
  }

  private _mergeChannels = (a: ChannelDefinition, b: ChannelDefinition): ChannelDefinition => {
    const messages = utils.records.mergeRecords(a.messages, b.messages, this._mergeMessage)
    return {
      ...a,
      ...b,
      messages,
    }
  }

  private _mergeMessage = (a: MessageDefinition, b: MessageDefinition): MessageDefinition => {
    return {
      schema: a.schema.merge(b.schema),
    }
  }
}
