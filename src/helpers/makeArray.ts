import { findDependencies } from './findDeps';



//TODO OLD FN
// export const makeDependenceArr = (fatherNodes: any[], nodesArray: any[], edgesArray: any[], resultArray: any[], setFN: Function) => {
//   const strokeResult: any[] = []
//   fatherNodes.forEach((node) => {
//     const deps: number[] = []
//     node.map((number: number) => {
//       findDependencies(number, nodesArray, edgesArray).map((el) => {
//         deps.push(el)
//       })
//     })
//     // console.log(deps.length);
//     strokeResult.push(deps)
//   })
//   const tempResult = deleteDoublesStrokeFN(formatStroke(strokeResult))
//   resultArray.push(fatherNodes.map((node) => node[0]))
//   // resultArray.shift()
//   if (!tempResult.length) return resultArray
//   // resultArray.push(tempResult)
//   // setFN([resultArray, tempResult])
//   const newFatherNodes = tempResult.map((el) => [el])
//   console.log('makedep fn worked', resultArray);
//   makeDependenceArr(newFatherNodes, nodesArray, edgesArray, resultArray, setFN)
// }
//TODO OLD FN

export const formatStroke = (stroke: any[]) => {
  return stroke.map((block: number[], index: number) => {
    block.forEach((node, nodeIndex) => {
      if (index < stroke.length - 1 && node === stroke[index + 1][0]) {
        [block[block.length - 1], block[nodeIndex]] = [block[nodeIndex], block[block.length - 1]]
      } else if (index > 0 && node === stroke[index - 1][stroke[index - 1].length - 1]) {
        [block[0], block[nodeIndex]] = [block[nodeIndex], block[0]]
      } else {
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