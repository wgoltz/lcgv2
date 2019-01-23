
var PlotWidth
var PlotHeight
var PlotG
var PlotSVG
var PlotOffsetX=100
var PlotOffsetY=25

function initPlot()
{     
    /*---build the basic SVG elements for the Plot---
        SVG and D3 (d3.) interlaced to create the SVG elements and plot axis
        This initializes the base plot SVG elements when
        the first star is requested.
        Called from:
            buildJsonObj @ 02_buildData.js
    */
    PlotWidth = 1360
    PlotHeight = 530

    if(BrowserName=="Internet Explorer")
    {
        var svgWidth = PlotWidth
        var svgHeight = PlotHeight+80
    }
    else
    {
        var svgWidth = "100%"
        var svgHeight = "100%"
    }

    //=============Plot SVG==========================================
 PlotSVG = d3.select("#plotDiv").append("svg")
    .attr("width", svgWidth).attr("height", svgHeight)
    .attr("id", "plotSVG")
    .attr("overflow", "visible")
    .attr("viewBox", "0 0 "+PlotWidth+" "+(PlotHeight))
    /*
    .on("mousemove", function()
        {
            if(BoxOn==true)
            {
                SVGx = d3.mouse(this)[0]
                SVGy = d3.mouse(this)[1]

                trackBoxRect()
            }
        }
    )
    .on("click", startBoxRect)
    */
    //----error bar markers---
    var defs = PlotSVG.append("defs")
    .append("marker")
    .attr("id", "endArrow")
    .attr("viewBox", "0 0 8000 8000")
    .attr("vector-effect", "non-scaling-stroke")
    .attr("refX", "250")
    .attr("refY", "150")
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", "300")
    .attr("markerHeight", "300")
    .attr("orient", "auto")
    .attr("fill", "#9370DB")
    .attr("stroke-linejoin", "bevel")
    .append("path")
    .attr("d", "M2 59,293 148,1 243,121 151, M290 0,L300 300")
    .attr("stroke", "#9370DB")
    .attr("stroke-width", "30")

    //---used for error bars ---
    var defs = PlotSVG.append("defs")
    .append("marker")
    .attr("id", "startArrow")
    .attr("viewBox", "0 0 8000 8000")
    .attr("vector-effect", "non-scaling-stroke")
    .attr("refX", "0")
    .attr("refY", "0")
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", "300")
    .attr("markerHeight", "600")
    .attr("orient", "auto")
    .attr("fill", "#9370DB")
    .attr("stroke-linejoin", "bevel")
    .append("path")
    .attr("transform", "translate(315 150)rotate(180)")
    .attr("d", "M2 59,293 148,1 243,121 151, M290 0,L300 300")
    .attr("stroke", "#9370DB")
    .attr("stroke-width", "30")

    //----Spectra gradient for spectra symbols --
      var defs = PlotSVG.append("defs")
    var spectralGrad = defs.append("radialGradient")
    .attr("id", "spectra")
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "50%")
    .attr("fx", "50%")
    .attr("fy", "50%")
    spectralGrad.append("stop")
    .attr('stop-color', 'rgb(255,0,0)')
    .attr('offset', '0%')
    .attr('stop-opacity', '1')
    spectralGrad.append("stop")
    .attr('stop-color', 'orange')
    .attr('offset', '50%')
    .attr('stop-opacity', '1')
    spectralGrad.append("stop")
    .attr('stop-color', 'blue')
    .attr('offset', '100%')
    .attr('stop-opacity', '1')

    //---white background for the Plot---
    PlotSVG.append("rect")
    .attr("pointer-events", "none")
    .attr("x", "0")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("fill", "white")
    .attr("stroke", "none")


    //---container for all plot elements---
    /*
    PlotG = PlotSVG.append("g")
    .attr("id", "plotG")
    .style("font-family", 'Lucida Console')
    .style("font-size", '10')
    */
     PlotG = PlotSVG.append("g")
    .attr("id", "plotG")
    .attr("transform", "translate("+PlotOffsetX+" "+PlotOffsetY+")")


    if(EmptyRequest==false&&MainRequest==false)
    {
        buildPlot()
        initGrid()
    }
    createSymbolClones() //---initilized, don't update---
    if(Mobile==false)
    {
        initMeanBinSlider()
        contribSelectDiv.style.display = "block"
    }

}
