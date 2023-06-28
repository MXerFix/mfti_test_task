interface nodeIndexesI {
  strokeIndex: number,
  nodeIndex: number
}
interface nodesItemI {
  id: number,
  name: string
}

interface edgesItemI {
  fromId: number,
  toId: number
}

interface dropdownPropI {
  activeGraph: number,
  click: Function,
  graphsArray: number[]
}

export type {
  nodesItemI, dropdownPropI, nodeIndexesI, edgesItemI
}
