import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'

export default function ScatterChart() {
  const sandbox = useRef(null)

  useEffect(() => {
    const svg = d3.select(sandbox.current)
    const width = svg.attr('width')
    const height = svg.attr('height')

    const render = data => {
      const xValue = d => d.population
      const yValue = d => d.country
      const margin = { top: 50, right: 30, bottom: 100, left: 120 }
      const innerWidth = width - margin.right - margin.left
      const innerHeight = height - margin.top - margin.bottom

      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth])
        .nice()

      const yScale = d3
        .scalePoint()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.6)

      const graph = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      //left axis

      const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth)

      graph
        .append('g')
        .call(yAxis)
        .style('color', '#635F5D')

      //bottom axis
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(number =>
          d3
            .format('0.2s')(number)
            .replace('G', 'B')
        )
        .tickSize(-innerHeight)

      graph
        .append('g')
        .call(xAxis)
        .style('color', '#635F5D')
        .attr('transform', `translate(0,${innerHeight})`)
        .select('.domain')
        .remove()

      //graph bars
      graph
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', 7)
        .attr('fill', 'cornflowerblue')

      graph
        .append('text')
        .text('Top 10 Most Populous Countries')
        .attr('transform', `translate(100,-20)`)
        .attr('fill', '#635F5D')

      graph
        .append('text')
        .text('Population')
        .attr('transform', `translate(230,300)`)
        .style('font-size', '1.2em')
        .style('color', '#C0C0BB')
        .attr('fill', '#C0C0BB')

      graph.selectAll('.tick line').style('color', '#C0C0BB')
      graph.select('line').remove()
    }

    d3.csv('population.csv').then(data => {
      data.forEach(d => (d.population = +d.population * 1000))
      render(data)
    })
  }, [sandbox])

  return <svg ref={sandbox} width='700' height='400' />
}
