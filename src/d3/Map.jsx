import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'
import { feature } from 'topojson-client'

export default function Map() {
  const sandbox = useRef(null)
  const [map, setMap] = useState(null)
  const [mapMeta, setMapMeta] = useState(null)

  useEffect(() => {
    if (!map) return
    if (!mapMeta) return

    const svg = d3.select(sandbox.current)
    const projection = d3.geoNaturalEarth1()
    const pathGenerator = d3.geoPath().projection(projection)
    const countries = feature(map, map.objects.countries)

    const whole = svg.append('g')

    svg.call(
      d3.zoom().on('zoom', () => {
        whole.attr('transform', d3.event.transform)
      })
    )

    whole
      .append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({ type: 'Sphere' }))

    whole
      .selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator)
      .append('title')
      .text(d => mapMeta.find(c => c.iso_n3 === d.id).name)
  }, [sandbox, map, mapMeta])

  useEffect(() => {
    d3.json('map.json').then(data => setMap(data))
    d3.tsv('map-meta.tsv').then(data => setMapMeta(data))
  }, [])

  return <svg ref={sandbox} width="960" height="500" />
}
