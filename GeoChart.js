import React,{useRef,useEffect,useState} from 'react';
import {select,geoPath,geoMercator,min,max,scaleLinear} from 'd3';
import useResizeObserver from "./useResizeObserver";
function GeoChart({property,data}){
  const svgRef=useRef();
  const wrapperRef=useRef();
 const dimensions = useResizeObserver(wrapperRef);
 const [selectedCountry,setSelectedCountry]=useState(null);


  useEffect(()=>{
    const svg=select(svgRef.current);
    const minProp=min(data.features,feature=>feature.properties[property]);
    const maxnProp=max(data.features,feature=>feature.properties[property]);
    const colorScale=scaleLinear().domain([minProp,maxnProp]).range(["#ffe6e6","#ff0000"]);
   const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();
    console.log(width,height,13);
    // projects geo-cordinates on a 2d plane
    const projections=geoMercator().fitSize([width, height], selectedCountry || data)
     .precision(100);

    // takes geojson data and transform that into the d attribute of path element
    const pathGenerator=geoPath().projection(projections);
    svg.selectAll('.country')
    .data(data.features)
    .join("path")
    .on("click", feature => {
      console.log(feature);
      setSelectedCountry(selectedCountry === feature ? null : feature);
    })
    .attr("class","country")
    .transition()
    .duration(2000)
    .attr('fill',feature=>colorScale(feature.properties[property]))
    .attr('d',feature=>pathGenerator(feature))

    svg.selectAll('.label')
    .data([selectedCountry])
    .join("text")
    .attr("class","label")
    .text(feature=>feature && feature.properties.name + ":" + feature.properties[property].toString())
    .attr('x',10)
    .attr('y',25)
  },[data,dimensions,property,selectedCountry])
  return(
     <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
          <svg ref={svgRef}></svg>
    </div>
  )
}

export default GeoChart;