import { findDependencies } from './findDeps';


export const makeDependenceArr = (fatherNodes: any[], nodesArray: any[], edgesArray: any[], resultArray: any[]) => {
  const strokeResult: any[] = []
  fatherNodes.forEach((node) => {
    const deps: number[] = []
    node.map((number: number) => {
      findDependencies(number, nodesArray, edgesArray).map((el) => {
        deps.push(el)
      })
    })
    // console.log(deps.length);
    strokeResult.push(deps)
  })
  const tempResult = deleteDoublesStrokeFN(formatStroke(strokeResult))
  if (!tempResult.length) return resultArray
  resultArray.push(tempResult)
  const newFatherNodes = tempResult.map((el) => [el])
  // console.log(newFatherNodes);
  makeDependenceArr(newFatherNodes, nodesArray, edgesArray, resultArray)
}

export const formatStroke = (stroke: any[]) => {
  return stroke.map((block: number[], index: number) => {
    block.forEach((node, nodeIndex) => {
      if (index < stroke.length - 1 && node === stroke[index + 1][0]) {
        // console.log(`condition 1 works with ${node}`);
        [block[block.length - 1], block[nodeIndex]] = [block[nodeIndex], block[block.length - 1]]
      } else if (index > 0 && node === stroke[index - 1][stroke[index - 1].length - 1]) {
        // console.log(`condition 2 works with ${node}`);
        [block[0], block[nodeIndex]] = [block[nodeIndex], block[0]]
      } else {
        // console.log(`${node} >> next`)
        return block[nodeIndex]
      }
    })
    return block
  })
}

export const deleteDoublesStrokeFN = (stroke: any[]) => {
  const strokeResult: any[] = []
  const obj: any = {}
  stroke.forEach((block: number[]) => {
    block.forEach((node) => {
      if (!obj.hasOwnProperty(node)) {
        obj[node] += 1
        strokeResult.push(node)
      }
    })
  })
  return strokeResult
}