import { IntegrationPackage, InterfacePackage } from '../package'
import { SchemaDefinition } from '../schema'
import { ValueOf, Writable } from '../utils/type-utils'
import z, { AnyZodObject } from '../zui'

type BaseStates = Record<string, AnyZodObject>
type BaseEvents = Record<string, AnyZodObject>
type BaseActions = Record<string, AnyZodObject>

export type TagDefinition = {
  title?: string
  description?: string
}

export type StateType = 'conversation' | 'user' | 'bot'

export type StateDefinition<TState extends BaseStates[string] = BaseStates[string]> = SchemaDefinition<TState> & {
  type: StateType
  expiry?: number
}

export type RecurringEventDefinition<TEvents extends BaseEvents = BaseEvents> = {
  [K in keyof TEvents]: {
    type: K
    payload: z.infer<TEvents[K]>
    schedule: { cron: string }
  }
}[keyof TEvents]

export type EventDefinition<TEvent extends BaseEvents[string] = BaseEvents[string]> = SchemaDefinition<TEvent>

export type ConfigurationDefinition = SchemaDefinition

export type UserDefinition = {
  tags?: Record<string, TagDefinition>
}

export type ConversationDefinition = {
  tags?: Record<string, TagDefinition>
}

export type MessageDefinition = {
  tags?: Record<string, TagDefinition>
}

export type ActionDefinition<TAction extends BaseActions[string] = BaseActions[string]> = {
  title?: string
  description?: string
  input: SchemaDefinition<TAction>
  output: SchemaDefinition<AnyZodObject> // cannot infer both input and output types (typescript limitation)
}

export type IntegrationConfigInstance<I extends IntegrationPackage = IntegrationPackage> = {
  enabled: boolean
} & (
  | {
      configurationType?: null
      configuration: z.infer<NonNullable<I['definition']['configuration']>['schema']>
    }
  | ValueOf<{
      [K in keyof NonNullable<I['definition']['configurations']>]: {
        configurationType: K
        configuration: z.infer<NonNullable<I['definition']['configurations']>[K]['schema']>
      }
    }>
)

export type IntegrationInstance = IntegrationPackage & IntegrationConfigInstance
export type InterfaceInstance = InterfacePackage

export type BotDefinitionProps<
  TStates extends BaseStates = BaseStates,
  TEvents extends BaseEvents = BaseEvents,
  TActions extends BaseActions = BaseActions
> = {
  integrations?: {
    [K: string]: IntegrationInstance
  }
  interfaces?: {
    [K: string]: InterfaceInstance
  }
  user?: UserDefinition
  conversation?: ConversationDefinition
  message?: MessageDefinition
  states?: {
    [K in keyof TStates]: StateDefinition<TStates[K]>
  }
  configuration?: ConfigurationDefinition
  events?: {
    [K in keyof TEvents]: EventDefinition<TEvents[K]>
  }
  recurringEvents?: Record<string, RecurringEventDefinition<TEvents>>
  actions?: {
    [K in keyof TActions]: ActionDefinition<TActions[K]>
  }
}

export class BotDefinition<
  TStates extends BaseStates = BaseStates,
  TEvents extends BaseEvents = BaseEvents,
  TActions extends BaseActions = BaseActions
> {
  public readonly integrations: this['props']['integrations']
  public readonly interfaces: this['props']['interfaces']
  public readonly user: this['props']['user']
  public readonly conversation: this['props']['conversation']
  public readonly message: this['props']['message']
  public readonly states: this['props']['states']
  public readonly configuration: this['props']['configuration']
  public readonly events: this['props']['events']
  public readonly recurringEvents: this['props']['recurringEvents']
  public readonly actions: this['props']['actions']
  public constructor(public readonly props: BotDefinitionProps<TStates, TEvents, TActions>) {
    this.integrations = props.integrations
    this.interfaces = props.interfaces
    this.user = props.user
    this.conversation = props.conversation
    this.message = props.message
    this.states = props.states
    this.configuration = props.configuration
    this.events = props.events
    this.recurringEvents = props.recurringEvents
    this.actions = props.actions
  }

  public add<I extends IntegrationPackage>(integrationPkg: I, config: IntegrationConfigInstance<I>): this
  public add<I extends InterfacePackage>(interfacePackage: I, config?: object): this
  public add(pkg: IntegrationPackage | InterfacePackage, config?: object): this {
    if (pkg.type === 'integration') {
      return this._addIntegration(pkg as IntegrationPackage, config as IntegrationConfigInstance)
    }
    if (pkg.type === 'interface') {
      return this._addInterface(pkg as InterfacePackage)
    }
    return this
  }

  private _addIntegration<I extends IntegrationPackage>(integrationPkg: I, config: IntegrationConfigInstance<I>): this {
    const self = this as Writable<BotDefinition>
    if (!self.integrations) {
      self.integrations = {}
    }

    self.integrations[integrationPkg.definition.name] = {
      enabled: config.enabled,
      ...integrationPkg,
      configurationType: config.configurationType as string,
      configuration: config.configuration,
    }
    return this
  }

  private _addInterface<I extends InterfacePackage>(interfacePackage: I): this {
    const self = this as Writable<BotDefinition>
    if (!self.interfaces) {
      self.interfaces = {}
    }
    self.interfaces[interfacePackage.definition.name] = interfacePackage
    return this
  }
}
