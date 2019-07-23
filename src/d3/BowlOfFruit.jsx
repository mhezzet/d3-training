import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'

export default function BowlOfFruit() {
  const sandbox = useRef(null)
  const [fruits, setFruits] = useState(initailState)
  const [opacity, setOpacity] = useState(0.9)

  useEffect(() => {
    const svg = d3.select(sandbox.current)

    renderBowelOfFruit(svg, { fruits, opacity })
  }, [sandbox, fruits, opacity])

  return (
    <>
      <svg ref={sandbox} width="700" height="300" />
      <div>
        <button
          style={{ margin: 5 }}
          onClick={() => setFruits(frts => frts.splice(0, frts.length - 1))}
        >
          EAT A FRUIT
        </button>
        <button
          style={{ margin: 5 }}
          onClick={() =>
            setFruits(frts => [...frts, { type: 'apple', id: Math.random() }])
          }
        >
          ADD AN APPLE
        </button>
        <button
          style={{ margin: 5 }}
          onClick={() =>
            setFruits(frts => [...frts, { type: 'lemon', id: Math.random() }])
          }
        >
          ADD A LEMON
        </button>
        <button
          style={{ margin: 5 }}
          onClick={() => setOpacity(o => (o === 0.9 ? 0.7 : 0.9))}
        >
          CHANGE OPACITY
        </button>
        <button
          style={{ margin: 5 }}
          onClick={() =>
            setFruits(frts =>
              frts.map(frt => ({
                ...frt,
                type: frt.type === 'lemon' ? 'apple' : 'lemon'
              }))
            )
          }
        >
          REPLACE
        </button>
      </div>
    </>
  )
}

const initailState = [
  { type: 'apple' },
  { type: 'lemon', id: Math.random() },
  { type: 'apple', id: Math.random() },
  { type: 'lemon', id: Math.random() },
  { type: 'apple', id: Math.random() }
]

const renderBowelOfFruit = (selection, props) => {
  const height = +selection.attr('height')
  const width = +selection.attr('width')
  const { fruits, opacity } = props

  const colorScale = d3
    .scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range(['#8a0a05', '#f6d601'])
  const radiusScale = d3
    .scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range([40, 20])

  const fruitGroups = selection.selectAll('g').data(fruits, d => d.id)

  //enter and update
  const fruitGroupsEnter = fruitGroups.enter().append('g')

  fruitGroupsEnter
    .transition()
    .duration(500)
    .attr(
      'transform',
      () =>
        `translate(${d3.randomUniform(0, width)()},${d3.randomUniform(
          0,
          height
        )()})`
    )

  fruitGroupsEnter
    .append('circle')
    .merge(fruitGroups.select('circle'))
    .transition()
    .duration(500)
    .attr('r', d => radiusScale(d.type))
    .attr('fill', d => colorScale(d.type))
    .style('opacity', opacity)

  fruitGroupsEnter
    .append('text')
    .merge(fruitGroups.select('text'))
    .transition()
    .duration(500)
    .text(d => d.type)
    .attr('y', d => (d.type === 'lemon' ? '30' : '50'))
    .attr('x', d => (d.type === 'lemon' ? '-16' : '-14'))
    .style('font-size', '12')
    .style('opacity', opacity)

  //exit
  fruitGroups
    .exit()
    .transition()
    .duration(500)
    .attr('transform', `scale(0)`)
    .remove()
}
