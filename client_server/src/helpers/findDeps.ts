import { nodesItemI } from "../utils/interface"


export const findDependencies = (id: number, nodesArr: any[], edgesArr: any[]) => {
  const sortedEdges = edgesArr.filter(({ fromId }) => fromId === id)
  const result = sortedEdges.map((item) => item.toId)
  // console.log(`For node ${id} was founded ${result.length} dependencies: ${result}`)
  return result
}

export const findNONEDependencies = (id: number, nodesArr: any[], edgesArr: any[]) => {
  const sortedEdges = edgesArr.filter(({ toId }) => toId === id)
  if (!sortedEdges.length) { return [] }
  const result = sortedEdges.map((item) => item.fromId)
  // console.log(`For node ${id} has dependence from ${result.length} nodes: ${result}`);
  return result
}

export const findAllDependencies = (nodesArr: any[], edgesArr: any[]) => {
  const dependencies: any = {}
  const noneDependencies: any = {}
  const fatherNodes: any[] = []
  nodesArr.forEach((node: nodesItemI) => {
    dependencies[node.id] = findDependencies(node.id, nodesArr, edgesArr)
  })
  nodesArr.forEach((node) => {
    const depsResult = findNONEDependencies(node.id, nodesArr, edgesArr)
    noneDependencies[node.id] = depsResult
    if (!depsResult.length) fatherNodes.push(node.id)
  })
  return fatherNodes
}
