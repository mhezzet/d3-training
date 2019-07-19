import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'

export default function Face() {
  const sandbox = useRef(null)

  useEffect(() => {
    const svg = d3.select(sandbox.current)

    const height = +svg.attr('height')
    const width = +svg.attr('width')
    const arc = d3.arc()

    //face
    svg
      .append('circle')
      .attr('r', height / 2 - 5)
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('fill', 'yellow')
      .attr('stroke', 'black')

    //left eye
    const leftEye = svg
      .append('circle')
      .attr('r', 17)
      .attr('cx', width / 2 - 70)
      .attr('cy', height / 2 - 40)
      .attr('fill', 'black')

    //right eye
    const rightEye = svg
      .append('circle')
      .attr('r', 17)
      .attr('cx', width / 2 + 70)
      .attr('cy', height / 2 - 40)
      .attr('fill', 'black')

    //moth
    svg
      .append('path')
      .attr(
        'd',
        arc({
          innerRadius: 0,
          outerRadius: 90,
          startAngle: Math.PI / 2,
          endAngle: (Math.PI * 3) / 2
        })
      )
      .attr('transform', `translate(${width / 2},${height / 1.7})`)

    //repeat transition
    d3.interval(() => {
      rightEye
        .transition()
        .duration(500)
        .attr('r', 20)
        .transition()
        .duration(500)
        .attr('r', 17)
    }, 900)

    d3.interval(() => {
      leftEye
        .transition()
        .duration(500)
        .attr('r', 20)
        .transition()
        .duration(500)
        .attr('r', 17)
    }, 1000)
  }, [sandbox])

  return <svg ref={sandbox} width="700" height="300" />
}
