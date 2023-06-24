
interface nodesItemI {
  id: number,
  name: string
}

interface dropdownPropI {
  activeGraph: number,
  click: Function,
  graphsArray: number[]
}

export type {
  nodesItemI, dropdownPropI
}
