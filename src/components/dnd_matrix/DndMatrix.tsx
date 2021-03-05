import React, { ReactElement, useEffect, useRef, useState } from 'react'
import 'react-grid-layout/css/styles.css'
import { Col, Container, Row } from 'react-grid-system'
import styled from 'styled-components'
import GridLayout from 'react-grid-layout'
import ReactTooltip from 'react-tooltip'

interface InputData {
  nodeName: string
  description: string
}

interface Item {
  nodeName: string
  description: string
  itemType: 'node' | 'xAxis' | 'yAxis'
  data: GridLayout.Layout
}

const TextArea = styled.div`
  height: 150px;
  width: 100%;
`

const ContainerWrapper = styled.div`
  padding: 0.5em;
`

const MatrixArea = styled.div`
  height: 500px;
`

const SideArea = styled.div``

const Node = styled.div`
  border-radius: 100%;
  border: 1px solid black;
`

const XAxisNode = styled.div`
  border: 1px solid black;
`

const YAxisNode = styled.div`
  border: 1px solid black;
`

const DndMatrix: React.FC = (): ReactElement => {
  const elm = useRef<HTMLDivElement>(null)
  const [matrixAreaWidth, setMatrixAreaWidth] = useState(0)
  const [nodeData, setNodeData] = useState<Item[]>([
    {
      nodeName: 'X axis',
      description: '',
      itemType: 'xAxis',
      data: { i: '1', x: 1, y: 5, w: 22, h: 2, static: true },
    },
    {
      nodeName: 'Y axis A',
      description: '',
      itemType: 'yAxis',
      data: { i: '2', x: 0, y: 0, w: 1, h: 5, static: true },
    },
    {
      nodeName: 'Y axis B',
      description: '',
      itemType: 'yAxis',
      data: { i: '3', x: 0, y: 7, w: 1, h: 5, static: true },
    },
  ])
  const [inputData, setInputData] = useState<InputData>({ nodeName: '', description: '' })
  const [updateData, setUpdateData] = useState<InputData>({ nodeName: '', description: '' })

  useEffect(() => {
    if (elm.current) {
      setMatrixAreaWidth(elm.current.getBoundingClientRect().width)
    }
  }, [matrixAreaWidth, nodeData])

  const onLayoutChange = (layout: GridLayout.Layout[]) => {
    var newNodeData: Item[] = []
    layout.forEach((item) => {
      var result = nodeData.find((i) => i.data.i === item.i)
      if (result) {
        result.data = item
        newNodeData.push(result)
      }
    })
    setNodeData(newNodeData)
  }

  const onNodeNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ nodeName: event.target.value, description: inputData.description })
  }

  const onDescriptionChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ nodeName: inputData.nodeName, description: event.target.value })
  }

  const onAddNode = () => {
    const maxIdx = Math.max.apply(
      null,
      nodeData.map((item) => parseInt(item.data.i))
    )
    var newNodeData = nodeData
    newNodeData.push({
      nodeName: inputData.nodeName,
      description: inputData.description,
      itemType: 'node',
      data: {
        i: `${maxIdx + 1}`,
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        maxH: 1,
      },
    })
    setNodeData(newNodeData)
    setInputData({ nodeName: '', description: '' })
  }

  const onNodeSelected = (idx: string) => {
    const item = nodeData.find((i) => i.data.i === idx)
    if (item) {
      setUpdateData({...item})
    }
  }

  return (
    <>
      <h2>DndMatrix</h2>
      <ContainerWrapper>
        <Container fluid>
          <Row>
            <Col md={8} debug>
              <MatrixArea ref={elm}>
                <GridLayout
                  cols={24}
                  rowHeight={30}
                  maxRows={12}
                  layout={nodeData.map((item) => item.data)}
                  width={matrixAreaWidth}
                  compactType={null}
                  onLayoutChange={onLayoutChange}
                  preventCollision={true}
                >
                  {nodeData.map((item) => {
                    if (item.itemType === 'node') {
                      return (
                        <Node
                          data-tip={item.description}
                          data-event="click focus"
                          data-for={`node-${item.data.i}`}
                          key={item.data.i}
                        >
                          {item.nodeName}
                          <ReactTooltip
                            id={`node-${item.data.i}`}
                            globalEventOff="click"
                            afterShow={() => {onNodeSelected(item.data.i)}}
                          />
                        </Node>
                      )
                    } else if (item.itemType === 'xAxis') {
                      return <XAxisNode key={item.data.i}>{item.nodeName}</XAxisNode>
                    } else {
                      return <YAxisNode key={item.data.i}>{item.nodeName}</YAxisNode>
                    }
                  })}
                </GridLayout>
              </MatrixArea>
            </Col>
            <Col md={4} debug>
              <SideArea>
                <Container>
                  {/* create node */}
                  <Row>
                    <Col md={4}>Name</Col>
                    <Col md={8}>
                      <input onChange={onNodeNameChanged} type="text" value={inputData.nodeName} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>Description</Col>
                    <Col md={8}>
                      <input
                        type="text"
                        onChange={onDescriptionChanged}
                        value={inputData.description}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <button onClick={onAddNode}>Add</button>
                    </Col>
                  </Row>
                  {/* update node */}
                  <Row>
                    <Col md={4}>Name</Col>
                    <Col md={8}>
                      <input onChange={onNodeNameChanged} type="text" value={updateData.nodeName} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>Description</Col>
                    <Col md={8}>
                      <input
                        type="text"
                        onChange={onDescriptionChanged}
                        value={updateData.description}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <button onClick={onAddNode}>Update</button>
                      <button onClick={onAddNode}>Delete</button>
                    </Col>
                  </Row>
                </Container>
              </SideArea>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <TextArea>{JSON.stringify(nodeData)}</TextArea>
            </Col>
          </Row>
        </Container>
      </ContainerWrapper>
    </>
  )
}

export default DndMatrix
