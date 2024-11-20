/* bplint-disable */
import { z, InterfaceDeclaration } from '@botpress/sdk'

const baseItem = z.object({ id: z.string() })

export default new InterfaceDeclaration({
  name: 'deletable',
  version: '0.0.1',
  entities: {
    item: {
      schema: baseItem,
    },
  },
  events: {
    deleted: {
      schema: () => baseItem,
    },
  },
  actions: {
    delete: {
      input: {
        schema: () => baseItem,
      },
      output: {
        schema: () => z.object({}),
      },
    },
  },
})
