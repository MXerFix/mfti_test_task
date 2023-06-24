import { memo, useEffect, useState } from "react";
import { fetchGraphs } from "./http/graphsAPI";
import { URL_, URL_1, URL_ALL } from "./utils/API_URLS";
import "./App.css";
import { dropdownPropI, nodesItemI } from "./utils/interface";
import Xarrow, { Xwrapper } from 'react-xarrows'
import Preloader from "./components/Preloader/Preloader";
import { CSSTransition } from 'react-transition-group'
import { findAllDependencies, findNONEDependencies } from "./helpers/findDeps";
import { makeDependenceArr } from "./helpers/makeArray";

// SEARCHING FOR DEPENDENCIES FUNCTIONS (helpers/findDeps.ts)
// CREATE OUTPUT (CASCADE) ARRAY (helpers/makeArray.ts)
// OUTPUT JXS NODES ARRAY
const renderGraphs = (ruleArray: any[], nodesArray: any[], edgesArray: any[]) => {

  return ruleArray.map((stroke: number[]) =>
    <div className="node_inbox">
      {stroke.map((node, index) => {
        // console.log(node)
        const deps = findNONEDependencies(node, nodesArray, edgesArray)
        // console.log(deps);
        return (
          <>
            <div id={`${node}`} className="node_block" >
              {nodesArray.filter(({ id }) => node === id)[0].name}
            </div>
            <Xwrapper>
              {deps.map((dep: number) => {
                return (
                  <Xarrow
                    start={`${dep}`}
                    startAnchor={'bottom'}
                    end={`${node}`}
                    endAnchor={'middle'}
                    strokeWidth={2}
                    zIndex={1}
                    color={'#555'}
                    showHead={false}
                    animateDrawing={false}
                    curveness={0}
                  />
                )
              })}
            </Xwrapper>
          </>
        )
      })}
    </div >
  )
}

// DROPDOWN COMPONENT

const DROPDOWN = ({ activeGraph, click, graphsArray }: dropdownPropI) => {

  const [dropdown, setDropdown] = useState(false)

  return (
    <div className="dropdown" role={'combobox'} id="dropdown">
      <button className="dropdown_button" onClick={() => setDropdown(!dropdown)}> {dropdown ? 'Close' : 'Open'} </button>
      <div className={dropdown ? "dropdown_hidden dropdown_active" : "dropdown_hidden"}>
        {graphsArray.map((graph: number) => {
          return (
            <button
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
  const [page, setPage] = useState(0)
  const [graphs, setGraphs] = useState([])
  const [url, setUrl] = useState(URL_1)
  const [EDGES, setEdges] = useState([{ name: 'loading', id: 0 }])
  const [NODES, setNodes] = useState([{ name: 'loading', id: 0 }])

  // ASYNC FETCH DATA FUNC
  const fetchData = async () => {
    setIsLoading(true)
    const graphs = await fetchGraphs(URL_ALL)
    const { edges, nodes } = await fetchGraphs(url)
    setGraphs(graphs)
    setEdges(edges)
    setNodes(nodes)
    setIsLoading(false)
  }

  // SET CURRENT GRAPH FUNC
  const clickUrl = (page: number) => {
    setPage(page)
    setUrl(URL_ + `${page}`)
  }

  // FETCHING DATA ON FIRST RENDER
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      fetchData()
    }, 750);
  }, [])

  // FETCHING DATA WHEN URL CHANGES BY DROPDOWN
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      fetchData()
    }, 500); //TIMEOUT FOR NICELY RE-RENDER
  }, [url])

  const fatherNodes = findAllDependencies(NODES, EDGES) // FINDING DEPS FOR PARENT NODES
  const RESULT_ARRAY: [number[]] = [fatherNodes] // PUSHING PARENT NODES IN RESULT_ARRAY
  const arrFatherNodes: any[] = fatherNodes.map((el) => [el]) // MUTATING PARENT NODES TYPE [1, 2 ,3] TO [[1], [2], [3]] FOR HELPER FUNCTION WORK

  makeDependenceArr(arrFatherNodes, NODES, EDGES, RESULT_ARRAY)


  if (!isLoading) {
    return (
      <div className="loading_wrapper">
        <DROPDOWN activeGraph={page} click={clickUrl} graphsArray={graphs} />
        <Xwrapper>
          <div className="node_box">
            {renderGraphs(RESULT_ARRAY, NODES, EDGES)}
          </div>
        </Xwrapper>
      </div>
    )
  } else {
    return (
      <div className="loading_wrapper" >
        <DROPDOWN activeGraph={page} click={clickUrl} graphsArray={graphs} />
        <CSSTransition in={isLoading} timeout={1000} classNames="preloader">
          <Preloader />
        </CSSTransition>
      </div>
    )
  }
}

export default memo(App);
