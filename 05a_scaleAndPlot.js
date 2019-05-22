// ******** scaling and plotting

// Original program has plot showing as soon as the points are set.
// Scaling was done in various places, but not consistently.
// scaleAxes and scalePoints/plotPoints ensure consistency, but they have to
// be called explicitly after each user action that requires a rescale or
// plot update. scalePoints/plotPoints also handle data trimming.

function scaleAxes(which)
{
    if(which == null)
        which = scaleAxesType.Both

    var scaleDays = which & scaleAxesType.Days == scaleAxesType.Days
    var scaleMags = which & scaleAxesType.Mags == scaleAxesType.Mags

    if(scaleDays)
    {
        var jd0 = (BoxAreaSet) ? SlideJD0 : PlotJDStart
        var jd1 = (BoxAreaSet) ? SlideJD1 : PlotJDEnd

        var formatDate = d3.time.format.utc("%Y/%m/%d %H:%M:%S")

        var ext0 = formatDate.parse(julian2Date(jd0))
        var ext1 = formatDate.parse(julian2Date(jd1))

        XscaleTop.domain([ext0, ext1]);
        XscaleCalendar.domain([ext0, ext1]);

        XscaleJulian.domain([jd0, jd1]);

        if(DateFormat=="Julian")
            labelJulian()
        else // DateFormat == "Calendar"
            labelCalendar()
    }
    if(scaleMags)
    {
        var mg0 = (BoxAreaSet) ? BoxMinMag : MagMin
        var mg1 = (BoxAreaSet) ? BoxMaxMag : MagMax

        YL.domain([mg1,mg0]);  //---reversed---
        YR.domain([mg1,mg0]);  //---reversed--

        labelMags()
    }
}

// subfunction of scaleAxes
function labelMags()
{
    YaxisLeft = d3.svg.axis()
    .scale(YL)
    .orient("right")

    GridYG.call(make_y_axis().tickSize(-XaxisWidth, 0, 0).tickFormat(""))

    PlotSVG.select(".y.axis.left")
    .call(YaxisLeft)
    .selectAll("text")
    .attr("class", "y-axis-font")
    .attr("dx", "-4em")
    .attr("stroke", "none")
    .attr("fill", "black")
    .attr("font-size", "15px")

    PlotSVG.select(".y.axis.right")
    .call(YaxisRight)
}

// subfunction of scaleAxes
function labelCalendar()
{
    XaxisTop.scale(XscaleCalendar)
    XaxisTopG.call(XaxisTop)

    var height = PlotHeight-30
    GridXG.call(make_x_axisCalendar().tickSize(-height, 0, 0).tickFormat(""))

    xaxisCalendarG.style.visibility = "visible"
    xaxisJulianG.style.visibility = "hidden"

    d3.select("#xAxisName").text("U.T.C. Calendar Date").attr("y", 570)

    var domainJD = XscaleJulian.domain()
    if(domainJD[1]-domainJD[0]>=10)
    {
        XaxisCalendar.tickFormat(d3.time.format.utc("%Y/%m/%d"))
        if(BoxAreaSet==false)
            PlotSVG.select(".x.axis.calendar")
            .call(XaxisCalendar)
            .selectAll("text")
            .attr("y", 14)
            .attr("x", 0)
            .attr("dy", ".1em")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .attr("stroke", "none")
            .attr("fill", "black");
        else
            PlotSVG.select(".x.axis.calendar")
            .call(XaxisCalendar)
            .selectAll("text")
            .attr("y", 10)
            .attr("x", 0)
            .attr("dy", ".1em")
            .style("text-anchor", "start")
            .style("font-size", "14px")
            .attr("stroke", "none")
            .attr("fill", "black")
            .attr("transform", "rotate(7)")
    }
    else
    {
        XaxisCalendar.tickFormat(d3.time.format.utc("%Y/%m/%d %H:%M"))

        PlotSVG.select(".x.axis.calendar")
        .call(XaxisCalendar)
        .selectAll("text")
        .attr("y", 10)
        .attr("x", 0)
        .attr("dy", ".1em")
        .style("text-anchor", "start")
        .style("font-size", "14px")
        .attr("stroke", "none")
        .attr("fill", "black")
        .attr("transform", "rotate(7)")
    }
}


var FontSizeArray_JD = ["16px", "13px", "12px", "11px", "10px"]

function jd_decs(difJD)
{
    var jdDecs = (1.5 - Math.log10(difJD)).toFixed()

    if (jdDecs < 0)
        jdDecs = 0
    if (jdDecs >= 4)
        jdDecs = 4

    return jdDecs
}

// subfunction of scaleAxes
function labelJulian()
{
    XaxisTop.scale(XscaleJulian)
    XaxisTopG.call(XaxisTop)

    var height = PlotHeight-30
    GridXG.call(make_x_axisJulian().tickSize(-height, 0, 0).tickFormat(""))

    xaxisCalendarG.style.visibility = "hidden"
    xaxisJulianG.style.visibility = "visible"

    d3.select("#xAxisName").text("Julian Days").attr("y", 560)

    var domainJD = XscaleJulian.domain()
    var jdDecs = jd_decs(domainJD[1]-domainJD[0])
    XaxisJulian.tickFormat(d3.format("."+jdDecs+"f"))

    //---update x,y axis---
    PlotSVG.select(".x.axis.julian")
    .call(XaxisJulian)
    .selectAll("text")
    .attr("class", "XaxisJulianFont")
    .attr("y", 14)
    .attr("x", 0)
    .attr("dy", ".1em")
    .style("text-anchor", "middle")
    .style("font-size", FontSizeArray_JD[jdDecs])
    .attr("stroke", "none")
    .attr("fill", "black");
}

// ********** trimData

// truncates data to a subrange for faster scaling and panning

var TrimmedData // subrange of Data
var I0, I1      // low and high indices (within Data) for start and end if trimmed data

function trimData()
{
    jd0 = SlideJD0
    jd1 = SlideJD1

    var points = SymbolG.selectAll(".Points")[0]

    var jdBisector = d3.bisector(function(d)
    {
        return d.getAttribute("xValTop")
    })

    I0 = jdBisector.left(points, jd0)
    I1 = jdBisector.left(points, jd1)
    var spliceHi = points.length - I1

    TrimmedData = [].concat(Data)
    TrimmedData.splice(0, I0)
    TrimmedData.splice(-spliceHi, spliceHi)
}


// scale trimmed data
function scalePoints()
{
    SymbolG.selectAll(".Points")
    .data(Data)
    .classed("trimmed", function(d, i)
    {
        return (i >= I0) && (i < I1)
    })

    SymbolG.selectAll(".Points.trimmed")
    .data(TrimmedData)
    .attr("transform", function(d)
    {
        return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")scale("+SymbolScaleRatio+")"
    })

    displayPoints()
}


// plot everything that is selected and in range
function displayPoints()
{
    // hide all points
    SymbolG.selectAll(".Points")
    .style("display", "none")

    // show selected points
    SymbolG.selectAll(".Points.trimmed.selected")
    .style("display", "block")

    // hide all faint points
    SymbolG.selectAll(".Points.faint")
    .style("display", "none")

    // show faint points if faint check selected
    SymbolG.selectAll(".Points.trimmed.selected.showFaint")
    .style("display", "block")

    // show/hide errorbars
    ErrorBarG.style("display", ErrorBarActive ? "block" : "none")
    if(ErrorBarActive)
        showErrorBars()

    if(MeanActive)
        setMeanBin()
}

// subfunction of displayPoints: display error bars
function showErrorBars()
{
// hide all errorBars
    ErrorBarG.selectAll(".errorBar")
    .classed("selected", false)
    .style("display", "none")

    var domainMag = YL.domain()
    var height = PlotHeight-30
    var magXFactor = height/(domainMag[1]-domainMag[0])

// for selected points, select errorbars > UncertGT, scale them
    var points = SymbolG.selectAll(".Points.trimmed.selected")[0]
    var errorBars = ErrorBarG.selectAll(".errorBar")[0]
    for (k = 0; k < points.length; k++)
    {
        var point = points[k]
        var errorBar = errorBars[point.getAttribute("dataLoc")]
        var uncert = point.getAttribute("uncert")
        var opacity = point.getAttribute("opacity")
        if(uncert>UncertGT)
        {
            errorBar.setAttribute("transform", "translate("+XscaleJulian(point.getAttribute("xValTop"))+" "+YL(point.getAttribute("yVal"))+")")
            errorBar.setAttribute("y1", -uncert*magXFactor)
            errorBar.setAttribute("y2", uncert*magXFactor)
            errorBar.setAttribute("class", "errorBar selected")
        }

        var opacity = point.getAttribute("opacity")
        //            if(opacity)
        errorBar.setAttribute("opacity", opacity)
    }

// show selected error bars
    ErrorBarG.selectAll(".errorBar.selected")
    .style("display", "block")
}


// updates BoxAreaBackArray so zooming back leaves the view centered at the same position
// used in slideToggle and in setBoxArea
function recenterZoomBack()
{
    var slideCenterJD = (SlideJD0+SlideJD1)/2

    for(var i = BoxAreaBackArray.length-1; i>=0; i--)
    {
        var lastSlideJD0 = BoxAreaBackArray[i][0]
        var lastSlideJD1 = BoxAreaBackArray[i][1]
        var lastSlideWidth = BoxAreaBackArray[i][5]
        var lastTransX = BoxAreaBackArray[i][6]

        var lastSlideCenterJD = (lastSlideJD0+lastSlideJD1)/2
        var lastSpanJD = lastSlideJD1-lastSlideJD0

        BoxAreaBackArray[i][0] = slideCenterJD - lastSpanJD/2
        BoxAreaBackArray[i][1] = slideCenterJD + lastSpanJD/2

        var deltaX = (slideCenterJD-lastSlideCenterJD)/lastSpanJD*lastSlideWidth

        BoxAreaBackArray[i][6] = lastTransX + deltaX
    }
}
