import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'
import { feature } from 'topojson-client'

export default function Map() {
  const sandbox = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!map) return
    const svg = d3.select(sandbox.current)

    const projection = d3.geoNaturalEarth1()
    const pathGenerator = d3.geoPath().projection(projection)
    const countries = feature(map, map.objects.countries)

    svg
      .append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({ type: 'Sphere' }))

    svg
      .selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator)
      .style('stroke', 'white')
      .style('stroke-opacity', '0.1')
  }, [sandbox, map])

  useEffect(() => {
    d3.json('map.json').then(data => setMap(data))
  }, [])

  return <svg ref={sandbox} width="960" height="500" />
}
