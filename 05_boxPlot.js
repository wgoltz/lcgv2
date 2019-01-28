
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
var SlideRectPrevWidth
function boxButtonClicked()
{
    /*---opens the Box (or toggles it closed)---
         Called from:
            boxButton @ index.htm
    */
    resetMean()
    meanCurveButton.disabled = true
    SpectraG.style("display", "none")

    if(BoxOn==false)
    {
        DrawX.style("display", "none")
        DragDot.style("display", "none")

        BoxRect.style("display", "block")
        boxButton.style.borderStyle = "inset"
        BoxRectSet = false
        BoxRectStart = false
        BoxOn = true
    }
    else
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

}
//---button:on click--
function startBoxRect()
{
    if(BoxOn==true&&BoxRectStart==false) //---first click
    {
        if(BoxActive==true)
            SlideRectPrevWidth = parseFloat(SlideRect.attr("width"))

        BoxRect.attr("transform", "translate("+SVGx+" "+SVGy+")")
        BoxRect.attr("width", 60)
        BoxRect.attr("height", 60)
        BoxRectStart = true
        DragDot.style("display", "block")
        BoxRect.style("display", "block")
        var transX = SVGx
        var transY = SVGy
        DragDot.attr("cx", 60)
        DragDot.attr("cy", 60)

        DragDot.attr("transform", "translate("+transX+" "+transY+")")
        BoxRectSet = true

    }

}
function boxBackButtonClicked()
{
  BoxAreaBackArray.pop()
    if(BoxAreaBackArray.length>0)
    {
        var boxStartJD=BoxAreaBackArray[BoxAreaBackArray.length-1][0]
        var boxEndJD=BoxAreaBackArray[BoxAreaBackArray.length-1][1]
        var boxStartMag=BoxAreaBackArray[BoxAreaBackArray.length-1][2]
        var boxEndMag=BoxAreaBackArray[BoxAreaBackArray.length-1][3]
        //---set for next active box---
        ActiveMag0=boxStartMag
        ActiveMag1=boxEndMag
        ActiveJD0=boxStartJD
        ActiveJD1=boxEndJD
        //---used in box toggle slide---
        SlideJD0 = boxStartJD
        SlideJD1 = boxEndJD
        BoxMinMag= boxStartMag
        BoxMaxMag= boxEndMag
        //---BoxAreaBackArray.push[slideWidth,transX,SlideJD0,SlideJD1,JDspanPrev,BoxMinMag,BoxMaxMag,ZoomCenterJD,PlotJDStart,PlotJDEnd]
        var slideWidth=BoxAreaBackArray[BoxAreaBackArray.length-1][4]
        var transX=BoxAreaBackArray[BoxAreaBackArray.length-1][5]
        SlideJD0=BoxAreaBackArray[BoxAreaBackArray.length-1][6]
        SlideJD1=BoxAreaBackArray[BoxAreaBackArray.length-1][7]
        JDspanPrev=BoxAreaBackArray[BoxAreaBackArray.length-1][8]
        BoxMinMag=BoxAreaBackArray[BoxAreaBackArray.length-1][9]
        BoxMaxMag=BoxAreaBackArray[BoxAreaBackArray.length-1][10]
        ZoomCenterJD=BoxAreaBackArray[BoxAreaBackArray.length-1][11]
        PlotJDStart=BoxAreaBackArray[BoxAreaBackArray.length-1][12]
        PlotJDEnd=BoxAreaBackArray[BoxAreaBackArray.length-1][13]

        updateDomain(boxStartJD,boxEndJD,boxStartMag,boxEndMag,0)

        SlideRect.attr("transform", "translate("+ transX+" 0)")
        SlideRect.attr("width", slideWidth)

    }
   else
        boxReset()


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
    //---needed for APASS data---
           function getMaxJD(Data) {
            var maxJD;
            var index;
            for (var i=0 ; i<Data.length ; i++) {
                if (!maxJD || Data[i].JD > maxJD)
                {
                    maxJD= Data[i].JD;
                    index=i
                 }
            }
            return [maxJD,index]
        }
        function getMinJD(Data) {
            var minJD;
            var index;
            for (var i=0 ; i<Data.length ; i++) {
                if (!minJD || Data[i].JD < minJD)
                {
                    minJD= Data[i].JD;

                    index=i
                 }
            }
            return [minJD,index]
        }

    var minDateIndex=getMinJD(Data)[1]

    var maxDateIndex=getMaxJD(Data)[1]
    var minDate = Data[minDateIndex].time;
    var maxDate = Data[maxDateIndex].time;

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
    GridYG.call(make_y_axis()
        .tickSize(-XaxisWidth, 0, 0)
        .tickFormat("")
    )
    XscaleJulian.domain(d3.extent
        (Data, function(d)
            {
                return d.JD;
            }
        )
    )

      if(DateFormat=="Calendar")
        XscaleTop.domain([minDate, maxDate]);
    else
        XscaleTop.domain(d3.extent
            (Data, function(d)
                {
                    return d.JD;
                }
            )
        );

   }

    XscaleCalendar.domain([minDate, maxDate])
    XaxisJulian.scale(XscaleJulian)

    XaxisJulian.tickFormat(d3.format("f"))
    if(DateFormat=="Calendar")
    {
        if(Data.length>5000)
            Points = SymbolG.selectAll(".Points")
            .data(Data)
            .attr("transform", function (d){return "translate("+XscaleCalendar(d.time)+" "+YL(d.mag)+")scale("+SymbolScaleRatio+")"})
        else
            Points = SymbolG.selectAll(".Points")
            .data(Data).transition().duration(1000)
            .attr("transform", function (d){return "translate("+XscaleCalendar(d.time)+" "+YL(d.mag)+")scale("+SymbolScaleRatio+")"})
    }
    else if(DateFormat=="Julian")
    {
        if(Data.length>5000)
            Points = SymbolG.selectAll(".Points")
            .data(Data)
            .attr("transform", function (d){return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")scale("+SymbolScaleRatio+")"})
        else
            Points = SymbolG.selectAll(".Points")
            .data(Data).transition().duration(1000)
            .attr("transform", function (d){return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")scale("+SymbolScaleRatio+")"})
    }

    BoxAreaSet = false
    BoxActive = false
    if(DateFormat=="Calendar")
            calendarDateRadioClicked()
        else
            julianDateRadioClicked()

    slideLeftButton.setAttribute("opacity", 0)
    slideRightButton.setAttribute("opacity", 0)
    horizLine.style.display = "none"

    slideLeftButton.setAttribute("pointer-events", "none")
    slideRightButton.setAttribute("pointer-events", "none")

    if(ErrorBarActive)
    {
         ErrorBarG.style("display", "block")
//            ErrorBars.attr("transform", function (d)
//                {
//                    return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")"
//                }
//            )
        var scaleY = YL.domain()[0] - YL.domain()[1]
        ErrorBars.attr("transform", function (d)
            {
                return "scale(1, "+scaleY+") translate("+XscaleJulian(d.JD)+" "+YL(d.mag)/scaleY+")"
            }
        )
    }
    errorBarCheck.disabled=false
    if(DataPacketVis==true)
        setTimeout(slideDataPacketRect,1200)
    SlideCoverRect.style("display", "none")
    SlideRect.attr("width", "0")

}


var BoxRectStart = false
var BoxRectSet = false
var RectObj
var ActiveMag0
var ActiveMag1
var ActiveJD0
var ActiveJD1

function trackBoxRect()
{
    if(BoxRectStart==true)
    {
        DragDot.style("display", "block")
        BoxRect.style("display", "block")
    }
    if(BoxOn==true&&BoxRectSet==false)
    {
        DrawX.style("display", "block")

        DrawX.attr("transform", "translate("+SVGx+" "+SVGy+")")

      //---d3 drag to compensate for screen resolution---
        var dragBox = d3.behavior.drag()
        .on("drag", function()
            {

                BoxRect.attr("transform", "translate(" + (d3.event.x-30) + "," + (d3.event.y-30) + ")");
                DrawX.attr("transform", "translate(" + (d3.event.x-30) + "," + (d3.event.y-30) + ")");
                DragDot.attr("transform", "translate(" + (d3.event.x-30) + "," + (d3.event.y-30) + ")");
            }
        )

        d3.selectAll(".dragBox").call(dragBox);

        var dragDot = d3.behavior.drag()
         .on("drag", function()
            {
                DragDot.attr("transform", "translate(" + (d3.event.x-60) + "," + (d3.event.y-60) + ")");
                var tfDot = d3.transform(DragDot.attr("transform"))
                var transDotX = tfDot.translate[0]+60
                var transDotY = tfDot.translate[1]+60

                var tfBox = d3.transform(BoxRect.attr("transform"))
                var transBoxX = tfBox.translate[0]
                var transBoxY = tfBox.translate[1]
                var width = transDotX-transBoxX
                var height = transDotY-transBoxY
                if(width>0&&height>0)
                {
                    BoxRect.attr("width", width)
                    BoxRect.attr("height", height)
                }
            }
        )
        .on("dragend", function()  //---creates the Box, and boxSlide environment---
            {
                var testWidth = parseFloat(BoxRect.attr("width"))
                var testHeight = parseFloat(BoxRect.attr("height"))
                if(testWidth>30&&testHeight>30)
                {
                    RectObj = pointSVG.createSVGRect()
                    var tf = d3.transform(BoxRect.attr("transform"))
                    RectObj.x = tf.translate[0]
                    RectObj.y = tf.translate[1]
                    RectObj.width = parseFloat(BoxRect.attr("width"))
                    RectObj.height = parseFloat(BoxRect.attr("height"))

                    //----compute plot mag vs JS box--
                    if(BoxActive==false)
                    {
                        var jd=d3.extent(Data, function(d){return d.JD;})
                        var mag=d3.extent(Data, function (d) { return d.mag; })

                        ActiveMag0 = parseFloat(magRangeMinValue.value)
                        ActiveMag1 = parseFloat(magRangeMaxValue.value)

                         ActiveJD0=jd[0]
                         ActiveJD1=jd[1]
                    }

                    var magSpan=ActiveMag1-ActiveMag0
                    var jdSpan=ActiveJD1-ActiveJD0

                    var magAxisLength=PlotHeight-30
                    var magYratio=magSpan/magAxisLength  //--mag/px

                    var jdAxisLength=XaxisWidth
                    var jdXratio=jdSpan/jdAxisLength //--jd/px
                    var boxX0=RectObj.x-PlotOffsetX
                    var boxY0=RectObj.y-PlotOffsetY
                    var boxX1=RectObj.x+RectObj.width-PlotOffsetX
                    var boxY1=RectObj.y+RectObj.height-PlotOffsetY
                    var boxStartMag=ActiveMag0+(boxY0*magYratio)
                    var boxEndMag=ActiveMag0+boxY1*magYratio

                    var boxStartJD=ActiveJD0+boxX0*jdXratio
                    var boxEndJD=ActiveJD0+boxX1*jdXratio

                    //---set for next active box---
                    ActiveMag0=boxStartMag
                    ActiveMag1=boxEndMag
                    ActiveJD0=boxStartJD
                    ActiveJD1=boxEndJD
                    //---used in box toggle slide---
                    SlideJD0 = boxStartJD
                    SlideJD1 = boxEndJD
                    BoxMinMag= boxStartMag
                    BoxMaxMag= boxEndMag

                    updateDomain(boxStartJD,boxEndJD,boxStartMag,boxEndMag,0)
                    BoxAreaBackArray.push([boxStartJD,boxEndJD,boxStartMag,boxEndMag])

                    BoxRectStart = false //---stop rect---
                    BoxRect.attr("width", 0)
                    BoxRect.attr("height", 0)
                    BoxRect.attr("transform", null)
                    DragDot.attr("transform", null)
                    BoxRect.style("display", "none")
                    DrawX.style("display", "none")
                    DragDot.style("display", "none")

                    boxButton.style.borderStyle = "outset"

                    BoxOn = false
                    BoxRectStart = false
                    BoxRectSet = false

                    setBoxArea()
                    startBoxSlide()

                }
            }
        );

        d3.selectAll(".dragDot").call(dragDot);

    }

}


//============toggle, resets, symbol transitions===============
var BoxAreaSet = false
var SlideJD0
var SlideJD1
var JDspanPrev //---used to set slide rect size in active box---
var BoxMinMag
var BoxMaxMag
var ZoomCenterJD
var PlotJDStart
var PlotJDEnd
var BoxAreaBackArray=[]
function setBoxArea()
{
    var height = PlotHeight-30

    boxResetButton.disabled = false

    BoxAreaSet = true

    //--recompute Slide  Rect width---
     PlotJDStart=Data[0].JD
     PlotJDEnd=Data[Data.length-1].JD
     var currentBoxJD=SlideJD1-SlideJD0
    if(BoxActive==true)
    {
        var boxWidthFactor = currentBoxJD/JDspanPrev
        var slideWidth = SlideRectPrevWidth*boxWidthFactor
    }
    else
    {
        var boxWidthFactor = currentBoxJD/(PlotJDEnd-PlotJDStart)
        var slideWidth = RectObj.width//*boxWidthFactor
        SlideRectPrevWidth = RectObj.width
    }
    JDspanPrev = SlideJD1-SlideJD0

    //---translate slide rect to proper location

    if(RectObj.x+RectObj.width>=1180-slideWidth)
    {
        var transX = 1179-slideWidth
        slideRightButton.setAttribute("pointer-events", "none")
        slideRightButton.setAttribute("opacity", .1)
    }

    else if(RectObj.x<=80)
    {
        var transX = 81
        slideLeftButton.setAttribute("pointer-events", "none")
        slideLeftButton.setAttribute("opacity", .1)
    }
    else
    {
        var transX = RectObj.x+RectObj.width/2-slideWidth/2
    }
    SlideRect.attr("transform", "translate("+ transX+" 0)")

    SlideRect.attr("width", slideWidth)

    JDspanPrev = SlideJD1-SlideJD0
    BoxActive = true

    ZoomCenterJD = SlideJD0+(SlideJD1-SlideJD0)/2
    if(DateFormat=="Calendar")
      errorBarCheck.disabled=false

    BoxAreaBackArray[BoxAreaBackArray.length-1][4]=slideWidth
    BoxAreaBackArray[BoxAreaBackArray.length-1][5]=transX
    BoxAreaBackArray[BoxAreaBackArray.length-1][6]=SlideJD0
    BoxAreaBackArray[BoxAreaBackArray.length-1][7]=SlideJD1
    BoxAreaBackArray[BoxAreaBackArray.length-1][8]=JDspanPrev
    BoxAreaBackArray[BoxAreaBackArray.length-1][9]=BoxMinMag
    BoxAreaBackArray[BoxAreaBackArray.length-1][10]=BoxMaxMag
    BoxAreaBackArray[BoxAreaBackArray.length-1][11]=ZoomCenterJD
    BoxAreaBackArray[BoxAreaBackArray.length-1][12]=PlotJDStart
    BoxAreaBackArray[BoxAreaBackArray.length-1][13]=PlotJDEnd
}
