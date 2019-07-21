import React from 'react'
import BarChart from './d3/BarChart'
import CarsScatterPlot from './d3/CarsScatterPlot'
import Face from './d3/Face'
import ScatterChart from './d3/ScatterChart'

export default function App() {
  return (
    <div>
      <h1>D3 training</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <h2>Fact</h2>
        <Face />
        <h2>Bar Chart</h2>
        <BarChart />
        <h2>Scatter plot</h2>
        <ScatterChart />
        <h2>Car Scatter plot</h2>
        <CarsScatterPlot />
      </div>
    </div>
  )
}
