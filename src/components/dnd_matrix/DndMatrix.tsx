import React, { ReactElement, useEffect, useRef, useState } from 'react'
import 'react-grid-layout/css/styles.css'
import { Col, Container, Row } from 'react-grid-system'
import styled from 'styled-components'
import GridLayout from 'react-grid-layout'

interface InputData {
  nodeName: string,
  description: string,
}

interface Item {
  nodeName: string,
  description: string,
  data: GridLayout.Layout,
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

const SideArea = styled.div`
`

const Node = styled.div`
  border-radius: 100%;
  border: 1px solid black;
`

/* const Node2 = styled.div`
 *   border: 1px solid red;
 *   background-color: red;
 * ` */

const DndMatrix: React.FC = (): ReactElement => {
  const elm = useRef<HTMLDivElement>(null)
  const [matrixAreaWidth, setMatrixAreaWidth] = useState(0)
  const [nodeData, setNodeData] = useState<Item[]>([
    {
      nodeName: 'X axis',
      description: '',
      data: {i: '1', x: 1, y: 6, w: 11, h: 1, static: true},
    },
  ])
  const [inputData, setInputData] = useState<InputData>({nodeName: '', description: ''})

  useEffect(() => {
    if (elm.current) {
      setMatrixAreaWidth(elm.current.getBoundingClientRect().width)
    }
  }, [matrixAreaWidth, nodeData])

  const onLayoutChange = (layout: GridLayout.Layout[]) => {
    var newNodeData: Item[] = []
    layout.forEach((item) => {
      var result = nodeData.find((i) => i.data.i == item.i)
      if (result) {
        result.data = item
        newNodeData.push(result)
      }
    })
    setNodeData(newNodeData)
  }

  const onNodeNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({nodeName: event.target.value, description: inputData.description})
  }

  const onDescriptionChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({nodeName: inputData.nodeName, description: event.target.value})
  }

  const onAddNode = () => {
    const maxIdx = Math.max.apply(null, nodeData.map((item) => parseInt(item.data.i)))
    var newNodeData = nodeData
    newNodeData.push({
      nodeName: inputData.nodeName,
      description: inputData.description,
      data: {
        i: `${maxIdx + 1}`,
        x: 0,
        y: 0,
        w: 1,
        h: 1,
      }
    })
    setNodeData(newNodeData)
    setInputData({nodeName: '', description: ''})
  }

  return (
    <>
      <h2>DndMatrix</h2>
      <ContainerWrapper>
        <Container fluid>
          <Row>
            <Col md={8} debug>
              <MatrixArea ref={elm}>
                <GridLayout cols={12} rowHeight={30} maxRows={12} layout={nodeData.map((item) => item.data)} width={matrixAreaWidth} compactType={null} onLayoutChange={onLayoutChange}>
                  {nodeData.map((item) => <Node key={item.data.i}>{item.nodeName}</Node>)}
                </GridLayout>
              </MatrixArea>
            </Col>
            <Col md={4} debug>
              <SideArea>
                <Container>
                  <Row>
                    <Col md={4}>Name</Col>
                    <Col md={8}>
                      <input onChange={onNodeNameChanged} type='text' value={inputData.nodeName} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>Description</Col>
                    <Col md={8}>
                      <input type='text' onChange={onDescriptionChanged} value={inputData.description} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <button onClick={onAddNode}>Add</button>
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
