var MagRangeChanged=false
function changeMagRangeButtonClicked()
{
    /*---Preferences---
        Called from:
            changeMagRangeButton @ lcgBETA.js
    */
     magRangeMinValue.style.background=""
    var minMag = parseFloat(magRangeMinValue.value)
    var maxMag = parseFloat(magRangeMaxValue.value)
    if(minMag<maxMag)
    {
    //---hide symbols outside of range---
    var points = SymbolG.selectAll(".Points")[0]
    for(var k = 0; k<points.length; k++)
    {
        var point = points[k]
        var myMag = parseFloat(point.getAttribute("yVal"))
        if(myMag<minMag||myMag>maxMag)
        {
            point.style.display = "none"

        }

    }

    YL.domain([maxMag, minMag]);
    YR.domain([maxMag, minMag])
    YaxisLeft = d3.svg.axis().scale(YL)
    .orient("right")

    PlotSVG.select(".y.axis.left")
    .call(YaxisLeft)
    .selectAll("text")
    .attr("dy", "1em")
    .attr("dx", "-4em")
    .attr("stroke", "none")
    .attr("fill", "maroon")
    .attr("font-size", "13")

    PlotSVG.select(".y.axis.right")
    .call(YaxisRight)

    //---change grid---

    GridYG.call(make_y_axis()
        .tickSize(-XaxisWidth, 0, 0)
        .tickFormat("")
    )


    if(DateFormat=="Calendar")
        PlotSVG.selectAll(".Points")
        .data(Data)
        .transition()
        .duration(800)
        .attr("transform", function (d)
            {
                return "translate("+ XscaleCalendar(d.time)+","+YL(d.mag)+")scale("+SymbolScaleRatio+")"
            }
        )

        else if(DateFormat=="Julian")
            PlotSVG.selectAll(".Points")
            .data(Data)
            .transition()
            .duration(800)
            .attr("transform", function (d)
                {
                    return "translate("+ XscaleJulian(d.JD)+","+YL(d.mag)+")scale("+SymbolScaleRatio+")"
                }
            )
            if(ErrorBarActive)
            ErrorBars.attr("transform", function (d)
                {
                    return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")"
                }
            )

          if(DataPacketVis==true)
              setTimeout(slideDataPacketRect,1000)
    resetMagRangeButton.disabled = false
    MagRangeChanged=true
    }
    else
        magRangeMinValue.style.background="red"


}

function resetMagRangeButtonClicked()
{
    /*---Preferences---
        Called from:
            resetMagRangeButton @ lcgBETA.js
    */
   if(MagRangeChanged==true)
   {
    MagRangeChanged=false
    var minMag = getMinMag(Data)
    var maxMag = getMaxMag(Data)

    magRangeMinValue.value = minMag
    magRangeMaxValue.value = maxMag

    SymbolG.selectAll(".Points").style("display", "block")

    YL.domain([maxMag, minMag]);
    YR.domain([maxMag, minMag])
    YaxisLeft = d3.svg.axis().scale(YL)
    .orient("right")

    PlotSVG.select(".y.axis.left")
    .call(YaxisLeft)
    .selectAll("text")
    .attr("dy", "1em")
    .attr("dx", "-4em")
    .attr("stroke", "none")
    .attr("fill", "maroon")
    .attr("font-size", "13")

    PlotSVG.select(".y.axis.right")
    .call(YaxisRight)

    //---change grid---

    GridYG.call(make_y_axis()
        .tickSize(-XaxisWidth, 0, 0)
        .tickFormat("")
    )

    if(DateFormat=="Calendar")
        PlotSVG.selectAll(".Points")
        .data(Data)
        .transition()
        .duration(800)
        .attr("transform", function (d)
            {
                return "translate("+ XscaleCalendar(d.time)+","+YL(d.mag)+")scale("+SymbolScaleRatio+")"
            }
        )

        else if(DateFormat=="Julian")
            PlotSVG.selectAll(".Points")
            .data(Data)
            .transition()
            .duration(800)
            .attr("transform", function (d)
                {
                    return "translate("+ XscaleJulian(d.JD)+","+YL(d.mag)+")scale("+SymbolScaleRatio+")"
                }
            )
            if(ErrorBarActive)
            ErrorBars.attr("transform", function (d)
                {
                    return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")"
                }
            )

          if(DataPacketVis==true)
              setTimeout(slideDataPacketRect,1000)

    resetMagRangeButton.disabled = true
    }
    else
    {
            var minMag = getMinMag(Data)
    var maxMag = getMaxMag(Data)

           magRangeMinValue.value = minMag
    magRangeMaxValue.value = maxMag


    }

}