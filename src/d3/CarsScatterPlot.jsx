import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'

export default function CarsScatterPlot() {
  const sandbox = useRef(null)
  const [data, setData] = useState(null)
  const [axes, setAxes] = useState(['horsepower', 'weight'])

  useEffect(() => {
    if (!data) return
    const svg = d3.select(sandbox.current)
    const width = svg.attr('width')
    const height = svg.attr('height')
    const titleLabel = `cars plot ${axes[0]} vs ${axes[1]}`
    const xAxisLabel = axes[0]
    const yAxisLabel = axes[1]

    const xValue = d => d[axes[0]]
    const yValue = d => d[axes[1]]
    const margin = { top: 50, right: 30, bottom: 50, left: 80 }
    const innerWidth = width - margin.right - margin.left
    const innerHeight = height - margin.top - margin.bottom

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice()

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yValue).reverse())
      .range([0, innerHeight])
      .nice()

    const graph = svg.selectAll('.graph').data([null])
    const graphEnter = graph.enter().append('g')

    graphEnter
      .merge(graph)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('class', 'graph')

    graphEnter
      .append('text')
      .attr('class', 'title')
      .attr('transform', `translate(100,-20)`)
      .merge(graph.select('.title'))
      .transition()
      .duration(1000)
      .text(titleLabel)
      .attr('fill', '#635F5D')

    //left axis
    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10)

    graphEnter
      .append('g')
      .attr('class', 'y-axis')
      .style('color', '#635F5D')
      .merge(graph.select('.y-axis'))
      .transition()
      .duration(1000)
      .call(yAxis)
      .selectAll('.domain')
      .remove()

    graphEnter
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2 - 50)
      .attr('y', -60)
      .style('font-size', '1.2em')
      .style('color', '#C0C0BB')
      .attr('fill', '#C0C0BB')
      .merge(graph.select('.y-axis-label'))
      .transition()
      .duration(1000)
      .text(yAxisLabel)

    //bottom axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(10)

    graphEnter
      .append('g')
      .attr('class', 'x-axis')
      .style('color', '#635F5D')
      .merge(graph.select('.x-axis'))
      .transition()
      .duration(1000)
      .call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`)
      .select('.domain')
      .remove()

    graphEnter
      .append('text')
      .attr('transform', `translate(250,340)`)
      .attr('class', 'x-axis-label')
      .style('font-size', '1.2em')
      .style('color', '#C0C0BB')
      .attr('fill', '#C0C0BB')
      .merge(graph.select('.x-axis-label'))
      .transition()
      .duration(1000)
      .text(xAxisLabel)

    //graph circles
    const circles = graph
      .merge(graphEnter)
      .selectAll('circle')
      .data(data)
    circles
      .enter()
      .append('circle')
      .attr('cy', innerHeight / 2)
      .attr('cx', innerWidth / 2)
      .attr('r', 0)
      .attr('fill', 'cornflowerblue')
      .style('opacity', 0.5)
      .attr('r', 6)
      .merge(circles)
      .transition()
      .duration(1000)
      .attr('cy', d => yScale(yValue(d)))
      .attr('cx', d => xScale(xValue(d)))

    graph.selectAll('.tick line').style('color', '#C0C0BB')
    graph.select('line').remove()
  }, [sandbox, data, axes])

  useEffect(() => {
    d3.csv('cars.csv').then(data => {
      data.forEach(d => {
        d.mpg = +d.mpg
        d.cylinders = +d.cylinders
        d.displacement = +d.displacement
        d.horsepower = +d.horsepower
        d.weight = +d.weight
        d.acceleration = +d.acceleration
        d.year = +d.year
      })
      setData(data)
    })
  }, [])

  const selectChangeHandler = number => e => {
    const value = e.target.value
    setAxes(a => (number === 0 ? [value, a[1]] : [a[0], value]))
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <label style={{ marginRight: 4 }} htmlFor="x">
          x-axis
        </label>
        <select id="x" onChange={selectChangeHandler(0)}>
          <option value="mpg">mpg</option>
          <option value="cylinders">cylinders</option>
          <option value="displacement">displacement</option>
          <option value="horsepower">horsepower</option>
          <option value="weight">weight</option>
          <option value="acceleration">acceleration</option>
          <option value="year">year</option>
        </select>
        <label style={{ marginLeft: 10, marginRight: 4 }} htmlFor="y">
          y-axis
        </label>
        <select id="y" onChange={selectChangeHandler(1)} value={axes[1]}>
          <option value="mpg">mpg</option>
          <option value="cylinders">cylinders</option>
          <option value="displacement">displacement</option>
          <option value="horsepower">horsepower</option>
          <option value="weight">weight</option>
          <option value="acceleration">acceleration</option>
          <option value="year">year</option>
        </select>
      </div>
      <svg ref={sandbox} width="700" height="400" />
    </>
  )
}
