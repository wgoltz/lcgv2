//----------------------box slide----------------------------
//---create lines,buttons,rects: outside of plot area---
var SlideZoomOn = false   //---opacity control of slideLeftButton/slideRightButton---
var SlideRect
var SlideCoverRect //---prevents focus on other elements when drag in effect---
var InitBoxSlide = false
//---mouse move---
var OffsetStartX
var ObjStartY
var PrevTransX
var TransX
var StopDragRect = false
function initBoxSlide()
{
    if(InitBoxSlide==false)
    {
        SlideCoverRect = PlotSVG.append("rect")
        .attr("id", "sliderCoverRect")
        .attr("fill", "white")
        .attr("fill-opacity", "0")
        .attr("pointer-events", "visible")
        .attr("stroke", "none")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", PlotWidth)
        .attr("height", PlotHeight)
        .style("display", "none")

        var slideBoxG = PlotSVG.append("g")
        .attr("transform", "translate(70 10)")
        .append("line")
        .attr("id", "horizLine")
        .attr("pointer-events", "none")
        .attr("stroke", "green")
        .attr("stroke-width", ".5")
        .attr("x1", 20)
        .attr("y1", 0)
        .attr("x2", (XaxisWidth+120))
        .attr("y2", 0)
        .style("display", "none")

        SlideRect = PlotSVG.append("rect")
        .attr("id", "rectSlide")
        .attr("fill", "green")
        .attr("stroke", "green")
        .attr("stroke-width", "1")
        .attr("x", "0")
        .attr("y", "-5")
        .attr("height", "30")
        .attr("width", "0")
        .attr("fill-opacity", ".2")
        .attr("class", "slideRect")

        PlotSVG.append("image")
        .attr("id", "slideLeftButton")
        .on("mouseover", function()
            {
                if(SlideZoomOn==true)slideLeftButton.setAttribute("opacity", .7)
            }
        )
        .on("mouseout", function()
            {
                if(SlideZoomOn==true)slideLeftButton.setAttribute("opacity", 1)
            }
        )
        .attr("onclick", "slideToggleLeft()")
        .attr("pointer-events", "none")
        .attr("opacity", "0")
        .attr("transform", "translate(80 10)")
        .attr("x", "-25")
        .attr("y", "-25")
        .on("mousedown", function()
            {
                slideLeftButton.setAttribute("transform", "translate(80 10)scale(.8)")
            }
        )
        .on("mouseup", function()
            {
                slideLeftButton.setAttribute("transform", "translate(80 10)")
            }
        )
        .attr("width", "50")
        .attr("height", "50")
        .attr("xlink:href", "Images/slideLeft.png")

        PlotSVG.append("image")
        .attr("id", "slideRightButton")
        .on("mouseover", function()
            {
                if(SlideZoomOn==true)slideRightButton.setAttribute("opacity", .7)
            }
        )
        .on("mouseout", function()
            {
                if(SlideZoomOn==true)slideRightButton.setAttribute("opacity", 1)
            }
        )
        .attr("onclick", "slideToggleRight()")
        .attr("pointer-events", "none")
        .attr("opacity", "0")
        .attr("transform", "translate("+(XaxisWidth+120)+" 10)")
        .attr("x", "-25")
        .attr("y", "-25")
        .on("mousedown", function()
            {
                slideRightButton.setAttribute("transform", "translate("+(XaxisWidth+120)+" 10)scale(.8)")
            }
        )
        .on("mouseup", function()
            {
                slideRightButton.setAttribute("transform", "translate("+(XaxisWidth+120)+" 10)")
            }
        )
        .attr("width", "50")
        .attr("height", "50")
        .attr("xlink:href", "Images/slideRight.png")


        InitBoxSlide = true
    }

}

var SlideDeltaJD
var JDperX
var DeltaJD=0
function startBoxSlide()
{
    SlideZoomOn = true
    slideLeftButton.setAttribute("opacity", 1)
    slideRightButton.setAttribute("opacity", 1)
    SlideRect.attr("fill", "green")
    SlideRectAdjustFactor = 0
    horizLine.style.display = "block"
    slideLeftButton.setAttribute("pointer-events", "visible")
    slideRightButton.setAttribute("pointer-events", "visible")

    var width = parseFloat(SlideRect.attr("width"))

    //---toggle---
    var widthFactor = width*.5
    var jdFactor = widthFactor/width
    SlideDeltaJD = jdFactor*(SlideJD1-SlideJD0)
    //----drag---
    JDperX = (PlotJDEnd-PlotJDStart)/XaxisWidth
      if(DateFormat=="Calendar")
      errorBarCheck.disabled=true
}

//============================toggle slide ===========================
function slideToggleLeft()
{
    slideRightButton.setAttribute("pointer-events", "visible")
    slideRightButton.setAttribute("opacity", 1)

    var width = parseFloat(SlideRect.attr("width"))
    var tf = d3.transform(SlideRect.attr("transform"))
    var transX = tf.translate[0]
    var widthFactor = width*.5
    var targetX = transX-widthFactor
    if(targetX>140)
    {
        SlideRect.attr("fill", "green")
        SlideRect.attr("transform", "translate("+targetX+" 0)")
        SlideRect.attr("pointer-events", "visible")
        DeltaJD = SlideDeltaJD/-1 // +=right, -=left
        slideToggle(DeltaJD)
    }
    else
    {
        setTimeout('slideLeftButton.setAttribute("opacity",.1)', 300)
        SlideRect.attr("transform", "translate(100 0)")
        slideLeftButton.setAttribute("pointer-events", "none")
        SlideRect.attr("fill", "grey")
         SlideRect.attr("pointer-events", "none")
        SlideJD0 = PlotJDStart

        DeltaJD = 0
        slideToggle(DeltaJD)
    }

}
function slideToggleRight()
{

    SlideRect.attr("pointer-events", "visible")
    slideLeftButton.setAttribute("opacity", 1)
    slideLeftButton.setAttribute("pointer-events", "visible")
    var width = parseFloat(SlideRect.attr("width"))
    var tf = d3.transform(SlideRect.attr("transform"))
    var transX = tf.translate[0]
    var widthFactor = width*.5
    var targetX = transX+widthFactor
    if(targetX<1325-width)
    {
         SlideRect.attr("pointer-events", "visible")
        SlideRect.attr("fill", "green")
        SlideRect.attr("transform", "translate("+targetX+" 0)")
        DeltaJD = SlideDeltaJD // +=right, -=left
        slideToggle(DeltaJD)
    }
    else
    {
        setTimeout('slideRightButton.setAttribute("opacity",".1")', 300)
        SlideRect.attr("transform", "translate("+(1325-width)+",0)")
        slideRightButton.setAttribute("pointer-events", "none")
         SlideRect.attr("pointer-events", "none")
        SlideRect.attr("fill", "grey")

        SlideJD1 = PlotJDEnd

        DeltaJD = 0
        slideToggle(DeltaJD)

    }

}
function slideToggle(DeltaJD)
{
    SlideJD0 = SlideJD0+DeltaJD
    SlideJD1 = SlideJD1+DeltaJD
    //--Update scale domains---
    updateDomain(SlideJD0, SlideJD1,BoxMinMag,BoxMaxMag,DeltaJD)
    ZoomCenterJD = SlideJD0+(SlideJD1-SlideJD0)/2
}


function updateDomain(startJD,endJD,minMag,maxMag,DeltaJD)
{
    //--Update scale domains---

    YL.domain([maxMag,minMag]);  //---reversed---
    YR.domain([maxMag,minMag]);  //---reversed--

    //-------modify locations---------------
    if(DateFormat=="Julian")
    {     XscaleJulian.domain([startJD,endJD])
         XscaleTop.domain([startJD,endJD]);
        if(Data.length>5000)
            Points = SymbolG.selectAll(".Points")
            .data(Data)
            .attr("transform", function (d){return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")scale("+SymbolScaleRatio+")"})
        else
            Points = SymbolG.selectAll(".Points")
            .data(Data).transition().duration(1000)
            .attr("transform", function (d){return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")scale("+SymbolScaleRatio+")"})
    }
   else if(DateFormat=="Calendar")
   {
         //---Date Format----
        var date0 = julian2Date(SlideJD0+DeltaJD)
        var date1 = julian2Date(SlideJD1+DeltaJD)
        var formatDate = d3.time.format.utc("%Y/%m/%d %H:%M:%S")
        var ext0 = formatDate.parse(date0)
        var ext1 = formatDate.parse(date1)


      XscaleCalendar.domain([ext0, ext1]);
          XscaleTop.domain([ext0,ext1]);
        if(Data.length>5000)
            Points = SymbolG.selectAll(".Points")
            .data(Data)
            .attr("transform", function (d){return "translate("+XscaleCalendar(d.time)+" "+YL(d.mag)+")scale("+SymbolScaleRatio+")"})
        else
            Points = SymbolG.selectAll(".Points")
            .data(Data).transition().duration(1000)
            .attr("transform", function (d){return "translate("+XscaleCalendar(d.time)+" "+YL(d.mag)+")scale("+SymbolScaleRatio+")"})
    }

    if(endJD-startJD<10)
    {
        XaxisJulian.tickFormat(d3.format(".2f"))
        var fontSize="13px"
    }
    else
    {
        XaxisJulian.tickFormat(d3.format("f"))
        var fontSize="16px"
    }
    //---update x,y axis---
    PlotSVG.select(".x.axis.julian")
    .call(XaxisJulian)
     .selectAll("text")
    .attr("class", "XaxisJulianFont")
    .attr("y", 14)
    .attr("x", 0)
    .attr("dy", ".1em")
    .style("text-anchor", "middle")
    .style("font-size", fontSize)
    .attr("stroke", "none")
    .attr("fill", "black");

     PlotSVG.select(".x.axis.calendar")
        .call(XaxisCalendar)
        .selectAll("text")
        .attr("y", 14)
        .attr("x", 0)
        .attr("dy", ".35em")
        .attr("transform", "rotate(9)")
        .style("text-anchor", "start")
        .style("font-size", "14px")
        .attr("stroke", "none")
        .attr("fill", "black");

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

    //---update grid---
   var height = PlotHeight-30

    if(DateFormat=="Julian")
        GridXG.call(make_x_axisJulian()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )
        else
            GridXG.call(make_x_axisCalendar()
                .tickSize(-height, 0, 0)
                .tickFormat("")
            )


    GridYG.call(make_y_axis()
        .tickSize(-XaxisWidth, 0, 0)
        .tickFormat("")
    )
     if(DateFormat=="Calendar")
        XaxisTop.scale(XscaleCalendar)
    else
       XaxisTop.scale(XscaleJulian)


    PlotSVG.select(".x.axis.top")
    .call(XaxisTop)

    if(ErrorBarActive&&DateFormat=="Julian")
    {      ErrorBarG.style("display", "block")
//            ErrorBars.attr("transform", function (d)
//                {
//                    return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")"
//                }
//            )
        var scaleY = 1/(YL.domain()[0] - YL.domain()[1])
        ErrorBars.attr("transform", function (d)
            {
                return "scale(1, "+scaleY+") translate("+XscaleJulian(d.JD)+" "+YL(d.mag)/scaleY+")"
            }
        )
    }
    else if(ErrorBarActive&&DateFormat=="Calendar")
    {
        ErrorBarG.style("display", "none")
        errorBarCheck.disabled=true
     }
     if(DateFormat=="Calendar")
      errorBarCheck.disabled=true

     if(DataPacketVis==true)
        setTimeout(slideDataPacketRect,1000)

}
function slideDataPacketRect()
{
    var tf=DataPacketPoint.getAttribute("transform")
   dataPacketRect.setAttribute("transform",tf) //---scale 10)
}

//================END BOX============================
