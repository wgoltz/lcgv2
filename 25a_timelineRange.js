var RequestedDateSet = false
var RequestedFromJD
var RequestedToJD

function setRequestedDate(fromJD, toJD)
{
    //---called from plotAnotherCurve.js---
    requestedDateCheck.checked = false
    requestedDateCheck.disabled = true
    RequestedDateSet = false
    if(!plotAllDaysCheck.checked && RequestInitDateFormat=="Julian")
    {
        requestedDateFromValue.value = anotherFromDateValue.value
        requestedDateToValue.value = anotherToDateValue.value
        requestedDateCheck.disabled = false
        requestedTR.style.opacity="1"
        RequestedFromJD = fromJD
        RequestedToJD = toJD
    }
    else
    {
        requestedDateFromValue.value = ""
        requestedDateToValue.value = ""
        requestedDateCheck.disabled = true
        requestedTR.style.opacity=".3"
        RequestedFromJD = null
        RequestedToJD = null
    }
}

function requestedDateChecked()
{
    //--checkbox---
    if(requestedDateCheck.checked==true)
    {
        if(BoxOn==true)
        {
            BoxOn = false
            BoxRectSet = false
            BoxAreaSet = false
            BoxRect.attr("width", 0)
            BoxRect.attr("height", 0)
            BoxRect.attr("transform", null)
            DragDot.attr("transform", null)
            BoxRect.style("display", "none")
            DrawX.style("display", "none")
            DragDot.style("display", "none")

            boxButton.style.borderStyle = "outset"
            PlotSVG.attr("onmousedown", null)
            .attr("onmousemove", null)
            .attr("onmouseup", null)
            pointSVG.removeAttribute("onmousedown")
            pointSVG.removeAttribute("onmousemove")
            pointSVG.removeAttribute("onmouseup")
            SlideCoverRect.style("display", "none")
            meanCurveButton.disabled = false
        }
        else if(BoxAreaSet == true)
            boxReset()

        boxButton.disabled = true
        calendarDateRadio.disabled = true
        RequestedDateSet = true

// replace this:
//        XscaleJulian.domain([RequestedFromJD, RequestedToJD])
//        XaxisJulian.scale(XscaleJulian)
//        XscaleTop.domain([RequestedFromJD, RequestedToJD])
// with this:
        SlideJD0 = RequestedFromJD
        SlideJD1 = RequestedToJD
        updateDomain()
// doesn't work yet

//        transition_data();
//        setTimeout(resetRequest_axis, 800)
    }
    else
    {
        boxButton.disabled = false
        RequestedDateSet = false
        calendarDateRadio.disabled = false
        var minMag = parseFloat(magRangeMinValue.value)
        var maxMag = parseFloat(magRangeMaxValue.value)
        YL.domain([maxMag, minMag]);
        YR.domain([maxMag, minMag])
        YaxisLeft = d3.svg.axis().scale(YL)
        .orient("right")

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
        //---change grid---
        GridYG.call(make_y_axis().tickSize(-XaxisWidth, 0, 0).tickFormat(""))
        //---needed for APASS data---
        function getMaxJD(Data)
        {
            var maxJD;
            var index;
            for (var i = 0; i<Data.length; i++)
            {
                if (!maxJD || Data[i].JD > maxJD)
                {
                    maxJD = Data[i].JD;
                    index = i
                }
            }
            return[maxJD, index]
        }
        function getMinJD(Data)
        {
            var minJD;
            var index;
            for (var i = 0; i<Data.length; i++)
            {
                if (!minJD || Data[i].JD < minJD)
                {
                    minJD = Data[i].JD;
                    index = i
                }
            }
            return[minJD, index]
        }

        XscaleJulian.domain(d3.extent(Data, function(d)
        {
            return d.JD;
        }))

        XaxisJulian.scale(XscaleJulian)

        SlideJD0 = PlotJDStart
        SlideJD1 = PlotJDEnd
        updateDomain()

//        transition_data();
        //        reset_axis()

    }
//    if(ErrorBarActive)
//        displayErrorBars()

}

function resetRequest_axis()
{

    PlotSVG.select(".x.axis.julian")
    .attr("shape-rendering", "geometricPrecision")
    .call(XaxisJulian)
    .selectAll("text")
    .attr("y", 14)
    .attr("x", 0)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .style("font-size", "15px")
    .attr("stroke", "none")
    .attr("fill", "black");

    XaxisTop.scale(XscaleJulian)
    XaxisTopG.call(XaxisTop)

    var height = PlotHeight-30

    GridXG.call(make_x_axisJulian()
        .tickSize(-height, 0, 0)
        .tickFormat("")
    )

}

function transition_data()
{
    Points = SymbolG.selectAll(".trimmed")
    .data(Data).transition().duration(1000)
    .attr("transform", function (d)
    {
        return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")scale("+SymbolScaleRatio+")"
    })

}
