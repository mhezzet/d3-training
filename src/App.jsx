import React from 'react'
import AreaChart from './d3/AreaChart'
import BarChart from './d3/BarChart'
import CarsScatterPlot from './d3/CarsScatterPlot'
import Face from './d3/Face'
import Interactions from './d3/Interactions'
import ScatterChart from './d3/ScatterChart'
import TempLineChart from './d3/TempLineChart'
import CountriesTree from './d3/CountriesTree'
import ChoroplethMap from './d3/ChoroplethMap'

export default function App() {
  return (
    <div>
      <h1>D3 training</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 30
        }}
      >
        <h2>Fact</h2>
        <Face />
        <h2>Bar Chart</h2>
        <BarChart />
        <h2>Scatter plot</h2>
        <ScatterChart />
        <h2>Temperature line plot</h2>
        <TempLineChart />
        <h2>Population area chart</h2>
        <AreaChart />
        <h2>Bowel Of Fruit - Interactions</h2>
        <Interactions />
        <h2>World Countries Tree</h2>
        <CountriesTree />
        <h2>Choropleth Map</h2>
        <ChoroplethMap />
        <h2>Car Scatter plot</h2>
        <CarsScatterPlot />
      </div>
    </div>
  )
}
