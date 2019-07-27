import * as d3 from 'd3'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { feature } from 'topojson-client'

export default function ChoroplethMap() {
  const sandbox = useRef(null)
  const [map, setMap] = useState(null)
  const [mapMeta, setMapMeta] = useState(null)
  const [category, setCategory] = useState(null)

  useEffect(() => {
    if (!map) return
    if (!mapMeta) return

    const svg = d3.select(sandbox.current)
    const projection = d3.geoNaturalEarth1()
    const pathGenerator = d3.geoPath().projection(projection)
    const countries = feature(map, map.objects.countries)

    const wholeUpdate = svg.selectAll('.whole').data([null])
    const wholeEnter = wholeUpdate
      .enter()
      .append('g')
      .attr('class', 'whole')
    const whole = wholeUpdate.merge(wholeEnter)

    const legend = svg.append('g').attr('transform', 'translate(30,300)')
    svg.call(
      d3.zoom().on('zoom', () => {
        whole.attr('transform', d3.event.transform)
      })
    )
    const colorScale = economyColorScale(mapMeta)

    wholeEnter
      .append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({ type: 'Sphere' }))

    const countryPaths = whole.selectAll('.country2').data(countries.features)
    const countryPathsEnter = countryPaths
      .enter()
      .append('path')
      .attr('class', 'country2')
      .attr('d', pathGenerator)
      .attr('fill', d => colorScale(mapMeta[d.id].economy))

    countryPathsEnter.merge(countryPaths).attr('opacity', d => {
      if (!category) {
        return 1
      } else {
        return mapMeta[d.id].economy === category ? 1 : 0.1
      }
    })

    countryPathsEnter
      .append('title')
      .text(d => mapMeta[d.id].name + ' | ' + mapMeta[d.id].economy)

    legend.call(economyColorLegend, {
      colorScale,
      circleRadius: 8,
      spacing: 20,
      textOffset: 12,
      rectWidth: 240,
      setCategory: setCategory,
      category
    })
  }, [sandbox, map, mapMeta, category, setCategory])

  useEffect(() => {
    d3.json('map.json').then(data => setMap(data))
    d3.tsv('map-meta.tsv').then(data => {
      setMapMeta(data.reduce((a, c) => ({ ...a, [c.iso_n3]: c }), {}))
    })
  }, [])

  return <svg ref={sandbox} width="960" height="500" />
}

function economyColorScale(mapMeta) {
  const colorScale = d3.scaleOrdinal()
  const domain = Object.values(mapMeta)
    .reduce(
      (allColors, country) =>
        allColors.includes(country.economy)
          ? allColors
          : [...allColors, country.economy],
      []
    )
    .sort()
    .reverse()
  const range = d3.schemeSpectral[domain.length]

  return colorScale.domain(domain).range(range)
}

function economyColorLegend(selection, props) {
  const {
    colorScale,
    circleRadius,
    spacing,
    textOffset,
    rectWidth,
    setCategory,
    category
  } = props

  const container = selection.selectAll('rect').data([null])
  const n = colorScale.domain().length
  container
    .enter()
    .append('rect')
    .merge(container)
    .attr('x', -circleRadius * 2)
    .attr('y', -circleRadius * 2)
    .attr('rx', circleRadius * 2)
    .attr('width', rectWidth)
    .attr('height', spacing * n + circleRadius * 2)
    .attr('fill', 'white')
    .attr('opacity', 0.8)

  const groups = selection.selectAll('.tick').data(colorScale.domain())
  const groupsEnter = groups
    .enter()
    .append('g')
    .attr('class', 'tick')
  groupsEnter
    .merge(groups)
    .attr('transform', (_, i) => `translate(0,${i * spacing})`)
    .attr('opacity', d => (d === category || category === null ? 1 : 0.4))
    .on('click', d => (d === category ? setCategory(null) : setCategory(d)))

  groups.exit().remove()

  groupsEnter
    .append('circle')
    .merge(groups.select('circle'))
    .attr('r', circleRadius)
    .attr('fill', colorScale)

  groupsEnter
    .append('text')
    .merge(groups.select('text'))
    .text(d => d)
    .attr('dy', '0.32em')
    .attr('x', textOffset)
}
