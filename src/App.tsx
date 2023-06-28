import { memo, useEffect, useState } from "react";
import { fetchGraphs } from "./http/graphsAPI";
import { URL_, URL_1, URL_ALL } from "./utils/API_URLS";
import "./App.css";
import { dropdownPropI, edgesItemI, nodeIndexesI, nodesItemI } from "./utils/interface";
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows'
import Preloader from "./components/Preloader/Preloader";
import { CSSTransition } from 'react-transition-group'
import { findAllDependencies, findDependencies, findNONEDependencies } from "./helpers/findDeps";
import { deleteDoublesStrokeFN, formatStroke } from "./helpers/makeArray";
import Draggable from "react-draggable";



// DROPDOWN COMPONENT

const DROPDOWN = ({ activeGraph, click, graphsArray }: dropdownPropI) => {

  const [dropdown, setDropdown] = useState(false)

  return (
    <div className="dropdown" role={'combobox'} id="dropdown">
      <button className={dropdown ? "dropdown_button dropdown_button_active" : "dropdown_button"} onClick={() => setDropdown(!dropdown)}> {dropdown ? 'Close' : 'Open'} </button>
      <div className={dropdown ? "dropdown_hidden dropdown_active" : "dropdown_hidden"}>
        {graphsArray.map((graph: number) => {
          return (
            <button key={graph}
              role={'option'}
              className={activeGraph == graph ? "dropdown_button dropdown_button_active" : "dropdown_button"}
              onClick={() => click(graph)}
            >
              Graph {graph + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function App() {

  // STATES
  const [isLoading, setIsLoading] = useState(true)
  const [RESULT_ARRAY, SET_RESULT_ARRAY]: any = useState([])
  const [page, setPage] = useState(0)
  const [GRAPHS, setGraphs] = useState([])
  const [EDGES, setEdges] = useState([[]])
  const [NODES, setNodes] = useState([[]])
  // const [currentNode, setCurrentNode] = useState({ strokeIndex: 0, nodeIndex: 0 }) // FOR OLD DRUG&DROP WI

  const makeDependenceArr = (fatherNodes: any[], nodesArray: any[], edgesArray: any[]) => {
    const strokeResult: any[] = []
    fatherNodes.forEach((node) => {
      const deps: number[] = []
      node.map((number: number) => {
        findDependencies(number, nodesArray, edgesArray).map((el) => {
          deps.push(el)
        })
      })
      strokeResult.push(deps)
    })
    const tempResult = deleteDoublesStrokeFN(formatStroke(strokeResult))
    if (!tempResult.length) return RESULT_ARRAY
    SET_RESULT_ARRAY((current: any[]) => [...current, tempResult])
    const newFatherNodes = tempResult.map((el) => [el])
    makeDependenceArr(newFatherNodes, nodesArray, edgesArray)
  }

  // SET CURRENT GRAPH FUNC
  const clickUrl = (page: number) => {
    setPage(page)
  }

  useEffect(() => {

    // ASYNC FETCH DATA FUNC

    const fetchData = async () => {
      setIsLoading(true)
      const graphs = await fetchGraphs(URL_ALL)
      setGraphs(graphs)
      const resNodes: any[] = []
      const resEdges: any[] = []
      for (let graph of graphs) {
        const { nodes, edges } = await fetchGraphs(URL_ + graph)
        nodes.map((node: nodesItemI) => {
          node.id = Number(`${node.id}${graph}`) // MUTATING IDs FOR NO CONFLICT
        })
        edges.map((edge: edgesItemI) => {
          edge.fromId = Number(`${edge.fromId}${graph}`)  // MUTATING IDs FOR NO CONFLICT
          edge.toId = Number(`${edge.toId}${graph}`)  // MUTATING IDs FOR NO CONFLICT
        })
        resNodes.push(nodes)
        resEdges.push(edges)
      }
      setNodes(resNodes)
      setEdges(resEdges)
      setIsLoading(false)
    }

    setIsLoading(true)

    setTimeout(() => {
      fetchData()
    }, 1000);
  }, []) // FETCHING ALL DATA ON INITIAL RENDER

  useEffect(() => {
    if (!isLoading) {
      SET_RESULT_ARRAY([]) // CLEAN RESULT_ARRAY
      const fatherNodes = findAllDependencies(NODES[page], EDGES[page]) // FINDING DEPS FOR PARENT NODES
      SET_RESULT_ARRAY([fatherNodes])  // PUSHING PARENT NODES IN RESULT_ARRAY
      const arrFatherNodes: any[] = fatherNodes.map((el) => [el]) // MUTATING PARENT NODES TYPE [1, 2 ,3] TO [[1], [2], [3]] FOR HELPER FUNCTION WORK
      makeDependenceArr(arrFatherNodes, NODES[page], EDGES[page]) // MAKE NEW RESULT_ARRAY
    }
  }, [isLoading]) // WHEN PAGE IS LOADED

  useEffect(() => {
    if (!isLoading) {
      SET_RESULT_ARRAY([]) // CLEAN RESULT_ARRAY
      const fatherNodes = findAllDependencies(NODES[page], EDGES[page]) // FINDING DEPS FOR PARENT NODES
      SET_RESULT_ARRAY([fatherNodes])  // PUSHING PARENT NODES IN RESULT_ARRAY
      const arrFatherNodes: any[] = fatherNodes.map((el) => [el]) // MUTATING PARENT NODES TYPE [1, 2 ,3] TO [[1], [2], [3]] FOR HELPER FUNCTION WORK
      makeDependenceArr(arrFatherNodes, NODES[page], EDGES[page])  // MAKE NEW RESULT_ARRAY
      console.log(fatherNodes);
    }
  }, [page]) // WHEN PAGE SWITCHED



  //TODO DRUG&DROP WITH REPLACE
  // const onDragStartHandler = (e: React.DragEvent, nodeIndexes: any) => {
  //   setCurrentNode(nodeIndexes)
  //   // console.log(RESULT_ARRAY)
  //   console.log(RESULT_ARRAY[nodeIndexes.strokeIndex][nodeIndexes.nodeIndex])
  //   return false
  // }
  // const onDragEnterHandler = (e: React.DragEvent, nodeIndexes: any) => {
  // }
  // const onDragLeaveHandler = (e: any, nodeIndexes: nodeIndexesI) => {
  //   e.preventDefault()
  //   e.target.style.background = 'wheat'
  // }
  // const onDragEndHandler = (e: any, nodeIndexes: nodeIndexesI) => {
  //   e.preventDefault()
  //   e.target.style.background = 'wheat'
  // }
  // const onDragOverHandler = (e: any, nodeIndexes: nodeIndexesI) => {
  //   e.preventDefault()
  //   e.target.style.background = 'white'
  // }
  // const onDropHandler = (e: any, nodeIndexes: nodeIndexesI) => {
  //   // e.preventDefault()
  //   e.target.style.background = 'wheat'
  //   // console.log(nodeIndexes);
  //   const overNode = RESULT_ARRAY[nodeIndexes.strokeIndex][nodeIndexes.nodeIndex]
  //   // console.log(overNode)
  //   RESULT_ARRAY[nodeIndexes.strokeIndex][nodeIndexes.nodeIndex] = RESULT_ARRAY[currentNode.strokeIndex][currentNode.nodeIndex]
  //   RESULT_ARRAY[currentNode.strokeIndex][currentNode.nodeIndex] = overNode
  //   console.log(RESULT_ARRAY, 'drop')
  //   SET_RESULT_ARRAY([...RESULT_ARRAY])
  // }
  //TODO DRUG&DROP WITH REPLACE



  const renderGraphs = (ruleArray: any[], nodesArray: any[], edgesArray: any[]) => {
    return ruleArray.map((stroke: number[], strokeIndex) =>
      <div key={`${strokeIndex}page${page}`} className="node_inbox">
        {stroke.map((node, nodeIndex) => {

          const Box = ({ id }: any) => {
            const updateArrow = useXarrow()
            return (
              <Draggable onDrag={updateArrow} onStop={updateArrow} onStart={updateArrow} >
                <div
                  id={`${id}page${page}`}
                  className="node_block">
                  {nodesArray.filter((node) => node.id === id)[0] ? nodesArray.filter((node) => node.id === id)[0].name : ''}
                </div>
              </Draggable>
            )
          }
          const deps = findNONEDependencies(node, nodesArray, edgesArray)
          const depsJSX = deps.map((dep) => {
            return (
              <Xarrow
                key={`${dep}page${page}`}
                start={`${dep}page${page}`}
                startAnchor={'bottom'}
                end={`${node}page${page}`}
                endAnchor={'middle'}
                strokeWidth={2}
                zIndex={1}
                color={'#EEE'}
                showHead={false}
                animateDrawing={false}
                curveness={0}
              />
            )
          })
          return (
            <>
              {depsJSX}
              <Box key={`${nodeIndex}page${page}`} id={node} />
            </>

            // TODO DRUG&DROP WITH REPLACE
            // <>
            //   <div
            //     draggable={true}
            //     onDragStart={(e) => { onDragStartHandler(e, { strokeIndex: strokeIndex, nodeIndex: nodeIndex }); uppdateArrow() }}
            //     onDragLeave={(e) => { onDragLeaveHandler(e, { strokeIndex: strokeIndex, nodeIndex: nodeIndex }) }}
            //     onDragEnter={(e) => { onDragEnterHandler(e, { strokeIndex: strokeIndex, nodeIndex: nodeIndex }) }}
            //     onDragEnd={(e) => { onDragEndHandler(e, { strokeIndex: strokeIndex, nodeIndex: nodeIndex }) }}
            //     onDragOver={(e) => { onDragOverHandler(e, { strokeIndex: strokeIndex, nodeIndex: nodeIndex }); uppdateArrow() }}
            //     onDrop={(e) => { onDropHandler(e, { strokeIndex: strokeIndex, nodeIndex: nodeIndex }); uppdateArrow() }}
            //     onDropCapture={(e) => { onDropHandler(e, { strokeIndex: strokeIndex, nodeIndex: nodeIndex }); uppdateArrow() }}
            //     id={`${node}`}
            //     className="node_block"
            //     key={node}
            //   >
            //     {nodesArray.filter(({ id }) => node === id)[0] ? nodesArray.filter(({ id }) => node === id)[0].name : ''}
            //   </div>
            //   {deps.map((dep: number) => {
            //     return (
            //       <Xarrow key={`${dep}, ${node}`}
            //         start={`${dep}`}
            //         startAnchor={'bottom'}
            //         end={`${node}`}
            //         endAnchor={'middle'}
            //         strokeWidth={2}
            //         zIndex={1}
            //         color={'#555'}
            //         showHead={false}
            //         animateDrawing={false}
            //         curveness={0}
            //       />
            //     )
            //   })}
            // </>
            //TODO DRUG&DROP WITH REPLACE
          )
        })}
      </div >
    )
  }

  if (!isLoading) {


    return (
      <div className="loading_wrapper">
        <DROPDOWN activeGraph={page} click={clickUrl} graphsArray={GRAPHS} />
        <Xwrapper>
          <div className="node_box">
            {renderGraphs(RESULT_ARRAY, NODES[page], EDGES[page])}
          </div>
        </Xwrapper>
      </div>
    )
  } else {
    return (
      <div className="loading_wrapper" >
        <DROPDOWN activeGraph={page} click={clickUrl} graphsArray={GRAPHS} />
        <CSSTransition in={isLoading} timeout={1000} classNames="preloader">
          <Preloader />
        </CSSTransition>
      </div>
    )
  }
}

export default App;
