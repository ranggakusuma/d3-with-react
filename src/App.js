import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';
import d3Tip from 'd3-tip'
import dataCsv from './germany_suicide_data.csv'

class App extends Component {
  state = {
    dataset: [],
    show: null
  }


  componentDidMount = () => {
    d3.csv(dataCsv).then((data) => {
        // console.log('ini d3', d3)
        let processedData = {};
        let dataFinal = []
        const self = this

        data.forEach(each => {
          if (processedData[each.year] === undefined) {
            processedData[each.year] = +each.suicides_no
          } else {
            processedData[each.year] += +each.suicides_no
          }
        })

        // console.log(processedData)

        for (let key in processedData) {
          let dataTemp = {
            letter: key,
            frequency: processedData[key]
          }
          dataFinal.push(dataTemp)
        } 
        const maxData = Math.max.apply(Math, dataFinal.map(function(o) { return o.frequency; }))

        var margin = {top: 40, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
        var formatPercent = d3.format("0");
    
        var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);
    
        
        var y = d3.scaleLinear()
        .range([height, 0]);
    
        var xAxis = d3.axisBottom(x).tickFormat(formatPercent);
    
        var yAxis = d3.axisLeft(y);
    
        var tip = d3Tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
          })
        
        var svg = d3.select("#Grafik").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var color = d3.scaleLinear().domain([0,maxData])
          .interpolate(d3.interpolateHcl)
          .range(['#59b300', '#cc0000']);

        svg.call(tip);
        // console.log('ini color', color(12000))
        // console.log('ini color', color(1000))
    
        // console.log('shajshajshajhsjh', document.getElementById('kampret'))
    
        x.domain(dataFinal.map(function(d) { return d.letter; }));
        y.domain([0, d3.max(dataFinal, function(d) { return d.frequency; })]);
    
        svg.append("g")
        .attr("id", "containerX")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
        // console.log('ini y axis' ,height)
        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");
    
        svg.selectAll(".bar")
            .data(dataFinal)
          .enter().append("rect")
            .attr("class", "bar")
            .attr('style', function(d) {
              // console.log(d.frequency)
              return 'fill: ' + color(d.frequency)
            })
            .attr("x", function(d) { return x(d.letter); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.frequency); })
            .attr("height", function(d) { return height - y(d.frequency); })
            // .on('mouseover', tip.show)       
            // .on('mouseout', tip.hide)
            .on('mouseover', function(d) {
              // console.log(d, i) 
              tip.show(d, this)
              d3.select(this).attr("r", 10).style("fill", "yellow");
              
            })
            .on('mouseout', function(d) {
              tip.hide(d, this)
              d3.select(this).attr("r", 10).style("fill", color(d.frequency));
            })
            .on('click', function(d) {
              // console.log(d.letter)
              self.setState({
                show: d.letter
              })
            })

        this.setState({
          dataset: data
        })

    }).catch(function(err) {
        throw err;
    })

  }

  render() {
    const { dataset, show } = this.state
    const showPage = dataset.filter(data => data.year === show)
    let detailTable = null
    if (showPage.length !== 0) {
      // console.log('kena', showPage)
      detailTable = (
        <div style={{
          marginLeft: '35vh',
          marginRight: '35vh'
        }}>
          <h1>Detail Statistics</h1>
          <table className="table" >
            <thead>
              <tr>
                <th>Year</th>
                <th>Sex</th>
                <th>Age</th>
                <th>Suicides No</th>
                <th>Population</th>
              </tr>
            </thead>
            <tbody>
              
                {showPage.map((data, i) => <tr key={i}>
                    <td>{data.year}</td>
                    <td>{data.sex}</td>
                    <td>{data.age}</td>
                    <td>{data.suicides_no}</td>
                    <td>{data.population}</td>
                  </tr>
                )}
              
            </tbody>
          </table>
        </div>
      )
    } 
    return (
      <div className="App">
        <h1>WHO Suicide Statistics</h1>
        <h2>In Germany</h2>
        <h3>1990 - 2015</h3>
        <h4>( Click to detail )</h4>
        <div id="Grafik"></div>
        {/* {JSON.stringify(dataset, 0, 2)} */}
        {detailTable}
      </div>
    );

  }
}

export default App;
