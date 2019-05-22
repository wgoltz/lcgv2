var DrawX
var BoxRect
var SVGx
var SVGy
var BoxG

function initBox()
{
    BoxG=PlotSVG.append("g")

    DrawX = BoxG.append("g")
    .style("display", "none")
    .attr("id", "domDrawX")
    .attr("stroke", "lime")
    .attr("stroke-width", ".5")
    .attr("pointer-events", "none")
    DrawX.append("circle")
    .attr("cx", "0")
    .attr("cy", "0")
    .attr("r", "3")
    .attr("fill", "black")
    DrawX.append("line")
    .attr("x1", "0")
    .attr("y1", "-5%")
    .attr("x2", "0")
    .attr("y2", "5%")
    DrawX.append("line")
    .attr("x1", "-5%")
    .attr("y1", "0")
    .attr("x2", "5%")
    .attr("y2", "0")

    BoxRect = BoxG.append("rect")
    .attr("id", "boxRect")
    .style("fill-opacity", ".2")
    .attr("stroke", "green")
    .attr("stroke-width", "1")
    .attr("fill", "green")
    .attr("class", "dragBox")
    .style("cursor", "move")

    DragDot = PlotSVG.append("circle")
    .attr("id", "dotDrag")
    .attr("class", "dragDot")
    .attr("cx", "0")
    .attr("cy", "0")
    .attr("r", "12")
    .attr("fill", "gainsboro")
    .attr("fill-opacity", ".5")
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .style("display", "none")
    .style("cursor", "move")

    PlotSVG.on("mousemove", function()
    {
        if(BoxOn==true)
        {
            SVGx = d3.mouse(this)[0]
            SVGy = d3.mouse(this)[1]
            trackBoxRect()
        }
    })
    .on("click", startBoxRect)

    initBoxSlide()
}

var BoxOn = false
var BoxActive = false //--not reset,slice existing box rect---
var BoxRectSet = false
var BoxRectStart = false

function boxButtonClicked()
{
    /*---opens the Box (or toggles it closed)---
         Called from:
            boxButton @ index.htm
    */
    resetMean()

    if(BoxOn) // box is on: turn box off
    {
        DragDot.attr("transform", null)
        DragDot.style("display", "none")
        BoxRect.attr("width", 0)
        BoxRect.attr("height", 0)
        BoxRect.attr("transform", null)
        BoxRect.style("display", "none")
        boxButton.style.borderStyle = "outset"

        SlideCoverRect.style("display", "none")

        PlotSVG.attr("onmousedown", null)
        .attr("onmousemove", null)
        .attr("onmouseup", null)

        pointSVG.removeAttribute("onmousedown")
        pointSVG.removeAttribute("onmousemove")
        pointSVG.removeAttribute("onmouseup")

        BoxAreaSet = false
    }
    else // box is off: turn box on
    {
        DragDot.style("display", "none")
        BoxRect.style("display", "block")
        boxButton.style.borderStyle = "inset"      

        BoxRectStart = false
    }

    DrawX.style("display", "none")
    SpectraG.style("display", "none")

    BoxOn = !BoxOn
    BoxRectSet = false
//    meanCurveButton.disabled = BoxOn
}

//---button:on click--

function startBoxRect()
{
    if(BoxOn==true && BoxRectStart==false) //---first click
    {
        BoxRect.attr("width", 60)
        BoxRect.attr("height", 60)
        BoxRect.style("display", "block")
        BoxRect.attr("transform", "translate("+SVGx+" "+SVGy+")")

        DragDot.attr("cx", 60)
        DragDot.attr("cy", 60)
        DragDot.style("display", "block")
        DragDot.attr("transform", "translate("+SVGx+" "+SVGy+")")

        BoxRectSet = true
        BoxRectStart = true
    }
}

function boxBackButtonClicked()
{
    BoxAreaBackArray.pop()
    if(BoxAreaBackArray.length>0)
    {
//---BoxAreaBackArray.push[SlideJD0,SlideJD1,BoxMinMag,BoxMaxMag,spanJD,slideWidth,transX]
        SlideJD0=BoxAreaBackArray[BoxAreaBackArray.length-1][0]
        SlideJD1=BoxAreaBackArray[BoxAreaBackArray.length-1][1]
        BoxMinMag=BoxAreaBackArray[BoxAreaBackArray.length-1][2]
        BoxMaxMag=BoxAreaBackArray[BoxAreaBackArray.length-1][3]

        var spanJD=BoxAreaBackArray[BoxAreaBackArray.length-1][4]
        var slideWidth=BoxAreaBackArray[BoxAreaBackArray.length-1][5]
        var transX=BoxAreaBackArray[BoxAreaBackArray.length-1][6]

        SlideRect.attr("transform", "translate("+transX+" 0)")
        SlideRect.attr("width", slideWidth)


    }
    else
        boxReset()

        updateDomain()
}

//---needed for APASS data---
function getMaxJD(data)
{
    var maxJD;
    var index;
    for (var i=0 ; i<data.length ; i++) {
        if (!maxJD || data[i].JD > maxJD)
        {
            maxJD= data[i].JD;
            index=i
        }
    }
    return [maxJD,index]
}
function getMinJD(data)
{
    var minJD;
    var index;
    for (var i=0 ; i<data.length ; i++) {
        if (!minJD || data[i].JD < minJD)
        {
            minJD= data[i].JD;

            index=i
        }
    }
    return [minJD,index]
}

function boxReset()
{
    /*---Remove Box, return plot to original view---
       Called from:
         onClick:boxResetButton @ index.htm
    */

    //---enable Mean selection---
    meanCurveButton.disabled = false
    boxResetButton.disabled = true
    hidePointData()

    if(RequestedDateSet==false)
    {
        var minDateIndex=getMinJD(Data)[1]
        var maxDateIndex=getMaxJD(Data)[1]

        var minDate = Data[minDateIndex].time
        var maxDate = Data[maxDateIndex].time

        var minMag = parseFloat(magRangeMinValue.value)
        var maxMag = parseFloat(magRangeMaxValue.value)

        YL.domain([maxMag, minMag])
        YR.domain([maxMag, minMag])

        SlideJD0 = PlotJDStart
        SlideJD1 = PlotJDEnd
//        XscaleJulian.domain(extentJD)
    }
    else
    {
// set minDate, maxDate, XscaleJulian
    }

//    XscaleCalendar.domain([minDate, maxDate])
//    XaxisJulian.scale(XscaleJulian)

    BoxAreaSet = false
    BoxActive = false

    if(DateFormat=="Calendar")
        calendarDateRadioClicked()
    else
        julianDateRadioClicked()

    scaleAxes(scaleAxesType.Both)
    scalePoints(SlideJD0, SlideJD1)

    horizLine.style.display = "none"

    slideLeftButton.setAttribute("opacity", 0)
    slideLeftButton.setAttribute("pointer-events", "none")

    slideRightButton.setAttribute("opacity", 0)
    slideRightButton.setAttribute("pointer-events", "none")

    if(DataPacketVis==true)
        setTimeout(slideDataPacketRect,1200)

    SlideCoverRect.style("display", "none")
    SlideRect.attr("width", "0")
}

var RectObj

function getRealBoundsFromRectBounds()
{
    var yToMag = (BoxMaxMag-BoxMinMag)/(PlotHeight-30)
    var xToJD = (SlideJD1-SlideJD0)/XaxisWidth

    var boxX0 = RectObj.x-PlotOffsetX
    var boxY0 = RectObj.y-PlotOffsetY
    var boxX1 = boxX0+RectObj.width
    var boxY1 = boxY0+RectObj.height

    var lastJD = SlideJD0
    SlideJD0 = lastJD + boxX0*xToJD
    SlideJD1 = lastJD + boxX1*xToJD

    var lastMinMag = BoxMinMag
    BoxMinMag = lastMinMag + boxY0*yToMag
    BoxMaxMag = lastMinMag + boxY1*yToMag
}

var JDspanPrev //---used to set slide rect size in active box---
function trackBoxRect()
{
    if(BoxRectStart==true)
    {
        DragDot.style("display", "block")
        BoxRect.style("display", "block")
    }
    if(BoxOn==true && BoxRectSet==false)
    {
        DrawX.style("display", "block")
        .attr("transform", "translate("+SVGx+" "+SVGy+")")

        //---d3 drag to compensate for screen resolution---
        var dragBox = d3.behavior.drag()
        .on("drag", function()
        {
            BoxRect.attr("transform", "translate(" + (d3.event.x-30) + "," + (d3.event.y-30) + ")")
            DrawX.attr("transform", "translate(" + (d3.event.x-30) + "," + (d3.event.y-30) + ")")
            DragDot.attr("transform", "translate(" + (d3.event.x-30) + "," + (d3.event.y-30) + ")")
        })

        d3.selectAll(".dragBox")
        .call(dragBox)

        var dragDot = d3.behavior.drag()
        .on("drag", function()
        {
            DragDot.attr("transform", "translate(" + (d3.event.x-60) + "," + (d3.event.y-60) + ")")

            var tfDot = d3.transform(DragDot.attr("transform"))
            var transDotX = tfDot.translate[0]+60
            var transDotY = tfDot.translate[1]+60

            var tfBox = d3.transform(BoxRect.attr("transform"))
            var transBoxX = tfBox.translate[0]
            var transBoxY = tfBox.translate[1]

            var width = transDotX-transBoxX
            var height = transDotY-transBoxY

            if(width>0 && height>0)
            {
                BoxRect.attr("width", width)
                BoxRect.attr("height", height)
            }
        })
        .on("dragend", function()  //---creates the Box, and boxSlide environment---
        {
            var width = parseFloat(BoxRect.attr("width"))
            var height = parseFloat(BoxRect.attr("height"))

            if(width>30 && height>30)
            {
                var tf = d3.transform(BoxRect.attr("transform"))

                RectObj = pointSVG.createSVGRect()

                RectObj.x = tf.translate[0]
                RectObj.y = tf.translate[1]
                RectObj.width = width
                RectObj.height = height

                //----compute plot mag vs JS box--
                if(BoxActive==false)
                {
                    var jd=d3.extent(Data, function(d){return d.JD;})
                    var mag=d3.extent(Data, function (d) { return d.mag; })

                    BoxMinMag = parseFloat(magRangeMinValue.value)
                    BoxMaxMag = parseFloat(magRangeMaxValue.value)

                    SlideJD0=jd[0]
                    SlideJD1=jd[1]

                    JDspanPrev = SlideJD1-SlideJD0
                }
                else
                    JDspanPrev = BoxAreaBackArray[BoxAreaBackArray.length-1][4]

                getRealBoundsFromRectBounds()

                setBoxArea()
                updateDomain()                
                startBoxSlide()

                //---stop rect---
                BoxRect.attr("width", 0)
                BoxRect.attr("height", 0)
                BoxRect.attr("transform", null)
                BoxRect.style("display", "none")
                DragDot.style("display", "none")
                DragDot.attr("transform", null)
                DrawX.style("display", "none")

                boxButton.style.borderStyle = "outset"

                BoxOn = false
                BoxRectStart = false
                BoxRectSet = false
            }
        })

        d3.selectAll(".dragDot")
        .call(dragDot)
    }
}


//============toggle, resets, symbol transitions===============

var SlideJD0
var SlideJD1
var BoxMinMag
var BoxMaxMag

var BoxAreaBackArray=[]
var BoxAreaSet = false

function setBoxArea()
{
    var height = PlotHeight-30

    var transX1 = XaxisWidth + PlotOffsetX
    var transX0 = PlotOffsetX

    boxResetButton.disabled = false

    //--recompute Slide  Rect width---
    //    PlotJDStart=Data[0].JD
    //    PlotJDEnd=Data[Data.length-1].JD

    var spanJD = SlideJD1-SlideJD0 // new zoom

    var slideWidth = (BoxActive) ? parseFloat(SlideRect.attr("width"))*spanJD/JDspanPrev : RectObj.width

    var jdToX = slideWidth/spanJD

    BoxAreaSet = true

    if (slideWidth > XaxisWidth)
        slideWidth = XaxisWidth

    //---translate slide rect to proper location

    //    var transX = RectObj.x-transX0
    var transX = (SlideJD0-PlotJDStart)*jdToX+transX0

    if(transX >= transX1-slideWidth)
    {
        transX = transX1-slideWidth
        slideRightButton.setAttribute("pointer-events", "none")
        slideRightButton.setAttribute("opacity", .1)
    }

    if(transX < transX0)
    {
        transX = transX0
        slideLeftButton.setAttribute("pointer-events", "none")
        slideLeftButton.setAttribute("opacity", .1)
    }

    SlideRect.attr("transform", "translate("+transX+" 0)")
    SlideRect.attr("width", slideWidth)

    recenterZoomBack()

    BoxAreaBackArray.push([SlideJD0, SlideJD1, BoxMinMag, BoxMaxMag, spanJD, slideWidth, transX])

    BoxActive = true
}


