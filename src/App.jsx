import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'

export default function App() {
  const sandbox = useRef(null)

  useEffect(() => {
    const svg = d3.select(sandbox.current)
    svg.style('background-color', 'red')
  }, [sandbox])

  return (
    <div>
      <h1>D3 training</h1>
      <svg ref={sandbox} width='800' height='500' />
    </div>
  )
}
