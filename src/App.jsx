import React from 'react'
import AreaChart from './d3/AreaChart'
import BarChart from './d3/BarChart'
import CarsScatterPlot from './d3/CarsScatterPlot'
import Face from './d3/Face'
import Interactions from './d3/Interactions'
import Map from './d3/Map'
import ScatterChart from './d3/ScatterChart'
import TempLineChart from './d3/TempLineChart'

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
        <h2>Temperature line plot</h2>
        <TempLineChart />
        <h2>Population area chart</h2>
        <AreaChart />
        <h2>Bowel Of Fruit - Interactions</h2>
        <Interactions />
        <h2>Map Plot</h2>
        <Map />
      </div>
    </div>
  )
}
