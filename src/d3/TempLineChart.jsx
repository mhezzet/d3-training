import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'

export default function TempLineChart() {
  const sandbox = useRef(null)

  useEffect(() => {
    const svg = d3.select(sandbox.current)
    const width = svg.attr('width')
    const height = svg.attr('height')
    const titleLabel = 'A week in san francisco'
    const xAxisLabel = 'Time'
    const yAxisLabel = 'Temperature'

    const render = data => {
      const yValue = d => d.temperature
      const xValue = d => d.timestamp
      const margin = { top: 50, right: 30, bottom: 50, left: 60 }
      const innerWidth = width - margin.right - margin.left
      const innerHeight = height - margin.top - margin.bottom

      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice()

      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, yValue).reverse())
        .range([0, innerHeight])
        .nice()

      const graph = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      //left axis
      const yAxis = d3
        .axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10)

      graph
        .append('g')
        .call(yAxis)
        .style('color', '#635F5D')

      //bottom axis
      const xAxis = d3
        .axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(10)

      graph
        .append('g')
        .call(xAxis)
        .style('color', '#635F5D')
        .attr('transform', `translate(0,${innerHeight})`)
        .select('.domain')
        .remove()

      const lineGenerator = d3
        .line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveBasis)

      graph
        .append('path')
        .attr('d', lineGenerator(data))
        .style('fill', 'none')
        .style('stroke-width', 5)
        .style('stroke', 'maroon')
        .style('stroke-linejoin', 'round')

      // graph
      //   .selectAll('circle')
      //   .data(data)
      //   .enter()
      //   .append('circle')
      //   .attr('cy', d => yScale(yValue(d)))
      //   .attr('cx', d => xScale(xValue(d)))
      //   .attr('r', 6)
      //   .attr('fill', 'cornflowerblue')
      //   .style('opacity', 0.5)

      graph
        .append('text')
        .text(titleLabel)
        .attr('transform', `translate(100,-20)`)
        .attr('fill', '#635F5D')

      graph
        .append('text')
        .text(xAxisLabel)
        .attr('transform', `translate(250,340)`)
        .style('font-size', '1.2em')
        .style('color', '#C0C0BB')
        .attr('fill', '#C0C0BB')

      graph
        .append('text')
        .text(yAxisLabel)
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2 - 50)
        .attr('y', -40)
        .style('font-size', '1.2em')
        .style('color', '#C0C0BB')
        .attr('fill', '#C0C0BB')

      graph.selectAll('.tick line').style('color', '#C0C0BB')
      graph.select('line').remove()
    }

    d3.csv('temperature.csv').then(data => {
      data.forEach(d => {
        d.temperature = +d.temperature
        d.timestamp = new Date(d.timestamp)
      })
      render(data)
    })
  }, [sandbox])

  return <svg ref={sandbox} width="700" height="400" />
}
