import { test } from 'vitest'
import { FooBarBazPlugin } from '../../../fixtures'
import { EventProxy } from './types'
import { Event } from '@botpress/client'
import * as utils from '../../../utils/type-utils'

test('EventProxy of FooBarBazPlugin should reflect events of integration and interface deps', async () => {
  type Actual = EventProxy<FooBarBazPlugin>
  type Expected = {
    fooBarBaz: {
      onFoo: utils.Merge<
        Event,
        { type: 'onFoo'; payload: FooBarBazPlugin['integrations']['fooBarBaz']['events']['onFoo'] }
      >
      onBar: utils.Merge<
        Event,
        { type: 'onBar'; payload: FooBarBazPlugin['integrations']['fooBarBaz']['events']['onBar'] }
      >
      onBaz: utils.Merge<
        Event,
        { type: 'onBaz'; payload: FooBarBazPlugin['integrations']['fooBarBaz']['events']['onBaz'] }
      >
    }
    totoTutuTata: {
      onToto: utils.Merge<
        Event,
        { type: 'onToto'; payload: FooBarBazPlugin['interfaces']['totoTutuTata']['events']['onToto'] }
      >
      onTutu: utils.Merge<
        Event,
        { type: 'onTutu'; payload: FooBarBazPlugin['interfaces']['totoTutuTata']['events']['onTutu'] }
      >
      onTata: utils.Merge<
        Event,
        { type: 'onTata'; payload: FooBarBazPlugin['interfaces']['totoTutuTata']['events']['onTata'] }
      >
    }
  }

  type _assertion = utils.AssertAll<
    [
      //
      utils.IsExtend<Actual, Expected>,
      utils.IsExtend<Expected, Actual>,
      utils.IsEquivalent<Actual, Expected>
    ]
  >
})
