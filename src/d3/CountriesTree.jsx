import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'

export default function CountriesTree() {
  const sandbox = useRef(null)
  const [treeRoot, setTreeRoot] = useState(null)

  useEffect(() => {
    if (!treeRoot) return

    const svg = d3.select(sandbox.current)
    const height = +svg.attr('height')
    const width = +svg.attr('width')
    const margin = { top: 0, right: 50, bottom: 0, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const treeLayout = d3.tree().size([innerHeight, innerWidth])
    const whole = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const links = treeLayout(treeRoot).links()
    const linkPathGeneratpor = d3
      .linkHorizontal()
      .x(d => d.y)
      .y(d => d.x)

    svg.call(
      d3.zoom().on('zoom', () => {
        whole.attr('transform', d3.event.transform)
      })
    )

    whole
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', linkPathGeneratpor)

    whole
      .selectAll('text')
      .data(treeRoot.descendants())
      .enter()
      .append('text')
      .attr('x', d => d.y)
      .attr('y', d => d.x)
      .attr('dy', '0.32em')
      .text(d => d.data.data.id)
      .attr('class', 'tree-text')
      .attr('text-anchor', d => (d.children ? 'middle' : 'start'))
      .style('font-size', d => {
        switch (d.depth) {
          case 0:
            return '2em'
          case 1:
            return '1.5em'
          case 2:
            return '0.9em'
          default:
            return '0.17em'
        }
      })
  }, [sandbox, treeRoot])

  useEffect(() => {
    d3.json('tree.json').then(data => setTreeRoot(d3.hierarchy(data)))
  }, [])

  return <svg ref={sandbox} width="800" height="800" />
}
