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
        .attr("transform", "translate(100 10)") // top horizontal line under slide rect
        .append("line")
        .attr("id", "horizLine")
        .attr("pointer-events", "none")
        .attr("stroke", "green")
        .attr("stroke-width", ".5")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", XaxisWidth)
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
        .attr("visible", "false")
        .on("mouseover", function()
        {
            if(SlideZoomOn==true)slideLeftButton.setAttribute("opacity", .7)
        })
        .on("mouseout", function()
        {
            if(SlideZoomOn==true)slideLeftButton.setAttribute("opacity", 1)
        })
        .attr("onclick", "slideToggleLeft()")
        .attr("pointer-events", "none")
        .attr("opacity", "0")
        .attr("transform", "translate(75 10)")
        .attr("x", "-25")
        .attr("y", "-25")
        .on("mousedown", function()
        {
            slideLeftButton.setAttribute("transform", "translate(75 10)scale(.8)")
        })
        .on("mouseup", function()
        {
            slideLeftButton.setAttribute("transform", "translate(75 10)")
        })
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
        })
        .attr("onclick", "slideToggleRight()")
        .attr("pointer-events", "none")
        .attr("opacity", "0")
        .attr("transform", "translate("+(XaxisWidth+125)+" 10)")
        .attr("x", "-25")
        .attr("y", "-25")
        .on("mousedown", function()
        {
            slideRightButton.setAttribute("transform", "translate("+(XaxisWidth+125)+" 10)scale(.8)")
        })
        .on("mouseup", function()
        {
            slideRightButton.setAttribute("transform", "translate("+(XaxisWidth+125)+" 10)")
        })
        .attr("width", "50")
        .attr("height", "50")
        .attr("xlink:href", "Images/slideRight.png")

        InitBoxSlide = true
    }
}

var SlideDeltaJD

function startBoxSlide()
{
    SlideZoomOn = true
    SlideRect.attr("fill", "green")
    SlideRectAdjustFactor = 0
    horizLine.style.display = "block"

    slideLeftButton.setAttribute("opacity", 1)
    slideLeftButton.setAttribute("pointer-events", "visible")

    slideRightButton.setAttribute("opacity", 1)
    slideRightButton.setAttribute("pointer-events", "visible")

    //----drag---

}

//============================toggle slide ===========================

function slideToggleLeft()
{
    slideToggle(slideLeftButton)
}

function slideToggleRight()
{
    slideToggle(slideRightButton)
}

function slideToggle(slide)
{
    var widthX = parseFloat(SlideRect.attr("width"))
    var halfWidthX = widthX/2

    var tf = d3.transform(SlideRect.attr("transform"))
    var transX = tf.translate[0]
    var x = transX+halfWidthX

    var spanJD = SlideJD1-SlideJD0

    var jdToX = (XaxisWidth < widthX) ? XaxisWidth/(PlotJDEnd-PlotJDStart) : widthX/spanJD

    SlideDeltaJD = spanJD / 2

    var slideWidth = spanJD*jdToX

    var limitX
    var atLimitX
    var newSlideDeltaJD

    if (slide === slideLeftButton) {
        limitX = PlotOffsetX // lower limit
        var newX = transX-SlideDeltaJD*jdToX
        atLimitX = (transX-SlideDeltaJD*jdToX <= limitX) // move left will get to lower limit?
        if(atLimitX)
        {
            transX = limitX // box to start
            newSlideDeltaJD = PlotJDStart-SlideJD0 // slideJD to start
        }
        else
        {
            transX -= SlideDeltaJD*jdToX // box left
            newSlideDeltaJD = -SlideDeltaJD // slideJD left
        }
    }
    else // slide === slideRightButton
    {
        limitX = PlotOffsetX+XaxisWidth // upper limit
        atLimitX = (transX+widthX+SlideDeltaJD*jdToX >= limitX) // move right will get to upper limit?
        if(atLimitX)
        {
            transX = limitX-widthX // box to end
            newSlideDeltaJD = PlotJDEnd-SlideJD1 // slideJD to end
        }
        else
        {
            transX += SlideDeltaJD*jdToX // box right
            newSlideDeltaJD = SlideDeltaJD // slideJD right
        }
    }

    SlideRect.attr("transform", "translate("+transX+" 0)")

    if(atLimitX)
    {
        SlideRect.attr("pointer-events", "none")
        SlideRect.attr("fill", "grey")
    }
    else
    {
        SlideRect.attr("transform", "translate("+transX+" 0)")
        SlideRect.attr("pointer-events", "visible")
        SlideRect.attr("fill", "green")

        slideLeftButton.setAttribute("pointer-events", "visible")
        slideRightButton.setAttribute("pointer-events", "visible")
    }

    if(newSlideDeltaJD==0)
    {
        slide.setAttribute("opacity",".1")
        slide.setAttribute("pointer-events", "none")
    }
    else
    {
        slide.setAttribute("opacity", 1)
        slide.setAttribute("pointer-events", "visible")
    }

    SlideJD0 += newSlideDeltaJD
    SlideJD1 += newSlideDeltaJD

    updateDomain()

// recenter position for zoom out

    BoxAreaBackArray.pop()

    recenterZoomBack()

    BoxAreaBackArray.push([SlideJD0, SlideJD1, BoxMinMag, BoxMaxMag, spanJD, slideWidth, transX])
}

// replace updateDomain

// <which> is intended to enable scaling on different axes
// (not necessarily fully implemented yet)

const scaleAxesType = {
    Days: 1,
    Mags: 2,
    Both: 3
}

function updateDomain(which)
{
    if(which == null)
        which = scaleAxesType.Both

    trimData()
    scaleAxes(which)
    scalePoints()

    if(DataPacketVis==true)
        setTimeout(slideDataPacketRect,1000)
}


function slideDataPacketRect()
{
    var tf=DataPacketPoint.getAttribute("transform")
    dataPacketRect.setAttribute("transform",tf) //---scale 10)
}
//================END BOX============================
