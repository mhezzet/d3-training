import React from 'react'
import Face from './d3/Face'
import BarChart from './d3/BarChart'

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
        <Face />
        <br />
        <BarChart />
      </div>
    </div>
  )
}
