import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'

export default function AreaChart() {
  const sandbox = useRef(null)

  useEffect(() => {
    const svg = d3.select(sandbox.current)
    const width = svg.attr('width')
    const height = svg.attr('height')
    const titleLabel = 'The World Population 2015'
    const xAxisLabel = 'Year'
    const yAxisLabel = 'Population'

    const render = data => {
      const yValue = d => d.population
      const xValue = d => d.year
      const margin = { top: 50, right: 30, bottom: 50, left: 80 }
      const innerWidth = width - margin.right - margin.left
      const innerHeight = height - margin.top - margin.bottom

      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice()

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([innerHeight, 0])
        .nice()

      const graph = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      //left axis
      const yAxis = d3
        .axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat(n =>
          d3
            .format('.1s')(n)
            .replace('G', 'B')
        )
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

      const areaGenerator = d3
        .area()
        .x(d => xScale(xValue(d)))
        .y0(innerHeight)
        .y1(d => yScale(yValue(d)))
        .curve(d3.curveBasis)

      graph
        .append('path')
        .attr('d', areaGenerator(data))
        .style('fill', 'cornflowerblue')
        .style('opacity', '0.7')
        .style('stroke-linejoin', 'round')

      graph
        .append('text')
        .text(titleLabel)
        .attr('transform', `translate(100,-20)`)
        .attr('fill', '#635F5D')

      graph
        .append('text')
        .text(xAxisLabel)
        .attr('transform', `translate(260,350)`)
        .style('font-size', '1.2em')
        .style('color', '#C0C0BB')
        .attr('fill', '#C0C0BB')

      graph
        .append('text')
        .text(yAxisLabel)
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2 - 50)
        .attr('y', -60)
        .style('font-size', '1.2em')
        .style('color', '#C0C0BB')
        .attr('fill', '#C0C0BB')

      graph.selectAll('.tick line').style('color', '#C0C0BB')
      graph.select('line').remove()
    }

    d3.csv('world-population-2015.csv').then(data => {
      data.forEach(d => {
        d.year = new Date(d.year)
        d.population = +d.population
      })
      render(data)
    })
  }, [sandbox])

  return <svg ref={sandbox} width="700" height="400" />
}
