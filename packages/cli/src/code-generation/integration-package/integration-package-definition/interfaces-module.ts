import { Module, ReExportVariableModule } from '../../module'
import * as strings from '../../strings'
import * as types from './typings'

export class InterfaceModule extends Module {
  public constructor(name: string, private _interface: types.ApiInterfaceDefinition) {
    const interfaceName = name
    const fileName = strings.fileName(interfaceName)
    const exportName = strings.varName(interfaceName)
    super({ path: `${fileName}.ts`, exportName })
  }

  public async getContent() {
    return `export const ${this.exportName} = ${JSON.stringify(this._interface, null, 2)}`
  }
}

export class InterfacesModule extends ReExportVariableModule {
  public constructor(interfaces: Record<string, types.ApiInterfaceDefinition>) {
    super({ exportName: strings.varName('interfaces') })
    for (const [interfaceName, intrface] of Object.entries(interfaces)) {
      const module = new InterfaceModule(interfaceName, intrface)
      this.pushDep(module)
    }
  }
}
