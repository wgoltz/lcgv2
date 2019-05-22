//---mode=selected plot, previewPlot, previewAddPlot---
var Data =[]
var Points
var DateFormat = "Julian"
var XaxisWidth
var XaxisCalendar
var XscaleCalendar
var XaxisJulian
var XscaleJulian
var XaxisTop
var XaxisTopG
var XscaleTop
var YL
var YR
var YleftG
var YaxisLeft
var YaxisRight
var PointsG
var SymbolG
var SymbolScaleRatio = 10

//-------------------var DrawX //---the Box---
//----------------var BoxRect //--the Box---

function clearPreviousPlot()
{
    /*---clears the current plot's elements, resets Globals---
        Called from:
           buildJsonObj @ 02_buildData.js
           apassDataCheckClicked @ 23_apassData.js
    */
    if(EmptyRequest==false&&MainRequest==false)
    {
        APASSloaded = false
        APASSactive = false
        apassDataCheck.checked = false
        //apassDataCheck.disabled = false
        apassContribDiv.style.visibility="hidden"
        foundApassDataCntSpan.innerHTML = ""
        PrevContribHighlight = null
        meanCurveButton.disabled = false
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
        horizLine.style.display = "none"
        SlideCoverRect.style("display", "none")
        SlideRect.attr("width", "0")

        slideLeftButton.setAttribute("opacity", "0")
        slideLeftButton.setAttribute("pointer-events", "none")
        slideRightButton.setAttribute("opacity", "0")
        slideRightButton.setAttribute("pointer-events", "none")

        boxButton.disabled=false
        boxResetButton.disabled=true
        boxButton.style.borderStyle = "outset"
        PlotSVG.attr("onmousedown", null)
        .attr("onmousemove", null)
        .attr("onmouseup", null)
        PointsG.attr("onmousedown", null)
        .attr("onmousemove", null)
        .attr("onmouseup", null)

        hidePointData()
        BoxAreaSet = false
        BoxActive = false

        if(PrintOn==true)
        {
            printCancel()
            PrintOn = false
        }

        ContribArray =[]
        Contribs = ","   //---included start comma 10/09/2017---
        ObjJSON =[]
       
        BandStng = "" //---build band data select---
        BandSymbolJson =[] //---data select---
        errorBarCheck.checked = false

        ContribCntSorted=false
        sortContribSelect.selectedIndex=0 // alphabetic

//        ErrorBarG.selectAll("*").remove()
//        if(document.getElementById("errorBarG"))
//            for(var k = errorBarG.childNodes.length-1; k>=0; k--)
//                errorBarG.removeChild(errorBarG.childNodes.item(k))

        ErrorBarActive = false
        ErrorBarInit = false

        PlotSVG.selectAll(".Points").remove()
        PlotG.selectAll("*").remove()
        mostRecentDataDiv.style.visibility = "hidden"
        PrevContribHighlight=null
        PrevContribBGcolor=null
        ContribHighlightArray=[]

// clear history
        BoxAreaBackArray=[]
        ContribCheckArray = null
   }
   else
       navTable.style.visibility="visible"
}

//---needed for APASS data---
function getMaxJD(data) {
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
function getMinJD(data) {
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

function getMaxMag(data)
{
    var maxMag;
    for (var i = 0; i<data.length; i++)
    {
        if (!maxMag || data[i].mag > maxMag)
        {
            maxMag = data[i].mag;
        }
    }
    return maxMag
}
function getMinMag(data)
{
    var minMag;
    for (var i = 0; i<data.length; i++)
    {
        if (!minMag || data[i].mag < minMag)
        {
            minMag = data[i].mag;
        }
    }
    return minMag
}

//--used in cross-browser positioning---
var PlotTransY = 25
var MagMax //---size box y--
var MagMin //---size box y--


function buildPlot()
{
    /*---Creates the plot for this star and time line---
        Called from:
           buildJsonObj @ 02_buildData.js
           initPlot @ 03_initPlot.js
    */

    //======data==================
    Data = ObjJSON.slice(0) //----copy ObjJSON via 02_buildData.js---

    var formatDate = d3.time.format.utc("%Y/%m/%d %H:%M:%S")

    Data.forEach(function(d, i)
    {
        d.time = formatDate.parse(d.time);
    })

    TrimmedData = [].concat(Data)
    I0 = 0
    I1 = TrimmedData.length - 1

    var minDateIndex=getMinJD(Data)[1]
    var maxDateIndex=getMaxJD(Data)[1]

    var minDate = Data[minDateIndex].time;
    var maxDate = Data[maxDateIndex].time;

    if(mtypeSelect.selectedIndex==1)
        var yAxisUnits = "Differential Magnitude"
    else
        var yAxisUnits = "Magnitude" //---left y axis--

    XaxisWidth = PlotWidth-130
    var height = PlotHeight-30

    GridG = PlotG.append("g")
    .attr("id", "gridG")
    .attr("shape-rendering" ,"geometricPrecision")

    var newG = PlotG.append("g")
    .attr("id", "axisPlotG")
    .attr("shape-rendering" ,"geometricPrecision")

    XscaleCalendar = d3.time.scale.utc()
    .range([0, XaxisWidth])
    .domain([minDate, maxDate])

    XaxisCalendar = d3.svg.axis()
    .scale(XscaleCalendar)
    .orient("top")
//    .tickFormat(timeTickFormat)

    XscaleJulian = d3.scale.linear()
    .range([0, XaxisWidth+.5]) //---added .5 to assure tick visibility--
    .domain([PlotJDStart,PlotJDEnd])

    XaxisJulian = d3.svg.axis()
    .scale(XscaleJulian)
    .orient("top")

    XscaleTop = d3.scale.linear()
    .range([0, XaxisWidth]);

    XaxisTop = d3.svg.axis()
    .scale(XscaleJulian)//--default---
    .orient("bottom")
    .tickFormat("")

    YL = d3.scale.linear() //---left values---
    .range([height, 0]);

    YaxisLeft = d3.svg.axis().scale(YL)
    .orient("right")

    YR = d3.scale.linear() //---right---
    .range([height, 0]);

    YaxisRight = d3.svg.axis().scale(YR)
    .orient("left")
    .tickFormat("")

    var max = getMaxMag(Data)
    var min = getMinMag(Data)
    MagMax = max
    MagMin = min
    YL.domain([max, min])
    YR.domain([max, min])
    magRangeMaxValue.value = max
    magRangeMinValue.value = min
    resetMagRangeButton.disabled = true

    //---XAxis(Calendar) Bottom---------
    XaxisCalendarG = newG.append("g")
    .attr("id", "xaxisCalendarG")
    .style("visibility", "hidden")
    .attr("stroke-width", "1")
    .attr("fill", "none")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x axis calendar")
    .attr("shape-rendering" ,"geometricPrecision")
    .call(XaxisCalendar)

    //---XAxis(Julian) Bottom---------
    XaxisJulianG = newG.append("g")
    .style("visibility", "hidden")
    .attr("id", "xaxisJulianG")
    .attr("stroke-width", "1")
    .attr("shape-rendering" ,"geometricPrecision")
    .attr("fill", "none")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x axis julian")
    .call(XaxisJulian)

    //---XAxis Top---------
    XaxisTopG = newG.append("g")
    .attr("pointer-events", "none")
    .attr("shape-rendering" ,"geometricPrecision")
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("fill", "none")
    .attr("class", "x axis top")
    .call(XaxisTop)

    YleftG = newG.append("g")
    .attr("class", "y axis left")
    .attr("shape-rendering" ,"geometricPrecision")
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("fill", "none")
    .call(YaxisLeft)
    .selectAll("text")
    .attr("class", "y-axis-font")
    .attr("dx", "-4em")
    .attr("stroke", "none")
    .attr("fill", "black")
    .attr("font-size", "15px")

    newG.append("text")
    .attr("id", "yAxisText")
    .attr("transform", "translate(-80 200)rotate(-90)")
    .attr("font-family", "arial")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("font-family", "arial")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("stroke", "none")
    .text(yAxisUnits);

    PlotSVG.append("text")
    .attr("id", "xAxisName")
    .attr("pointer-events", "none")
    .attr("font-family", "arial")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .attr("font-family", "arial")
    .attr("x", "50%")
    .style("text-anchor", "middle")
    .style("stroke", "none")

    //---right y axis-----------------
    newG.append("g")
    .attr("class", "y axis right")
    .attr("transform", "translate("+XaxisWidth+" 0)")
    .attr("stroke", "black")
    .attr("stroke-width", ".5")
    .attr("shape-rendering" ,"geometricPrecision")
    .attr("fill", "none")
    .call(YaxisRight)

    //----a parent svg element to hold symbols----
    var pntSVG = PlotG.append("svg")
    .attr("overflow", "visible")
    .attr("id", "pointSVG")

    pntSVG.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("x", -5)
    .attr("y", -5)
    .attr("width", PlotWidth-115)
    .attr("height", PlotHeight-20)

    PointsG = pntSVG.append("g")
    .attr("clip-path", "url(#clip)")

    SymbolG = PointsG.append("g")
    .attr("id", "symbolPlotG")
    .attr("stroke", "black")

    Points = SymbolG.selectAll(".Points")
    .data(Data)
    .enter().append("g")
    .attr("id", function (d)
    {
        return "point"+d.index
    })
    .attr("dataLoc", function (d, i)
    {
        return i
    })
    .attr("class", function (d)
    {
        var classes = "Points "+d.band+" "+d.by+" selected trimmed"
        if(d.fainterThan==1)
            classes += " faint showFaint"
        return classes
    })
    .attr("by", function (d)
    {
        return d.by
    })
    .attr("obsID", function (d)
    {
        return d.obsID
    })
    .attr("band", function (d)
    {
        return d.band
    })
    .attr("uncert", function (d)
    {
        return d.uncert
    })
    .attr("comCode", function (d)
    {
        return d.comCode
    })
    .attr("faint", function (d)
    {
        return d.fainterThan
    })
    .attr("comment", function (d)
    {
        var comment=d.comment
        if(comment.indexOf("\"")!=-1)
            comment.replace(/\"/g, "\"")
        return comment
    })
    .attr("xValTop", function (d, i)
    {
        return d.JD;
    })
    .attr("xVal", function (d, i)
    {
        return d.calDate;
    })
    .attr("yVal", function (d)
    {
        return d.mag;
    })
    .attr("stroke-width", function(d)
    {
        if(d.band=="Vis")
            return .1
        else
            return .025
    })

    //---above symbols---
    ErrorBarG = PlotG.append("g") //---uncert---
    .attr("id", "errorBarG")
    .attr("clip-path", "url(#clip)")
    .style("display", "none")
    .attr("pointer-events", "none")
    .attr("stroke", "#9370DB")

    SpectraG = PlotG.append("g") //---spectra circles---
    .attr("id", "spectraG")


    addSymbolPolygons() //---add the symbol's polygons to each g--- see: symbols.js---

    if(Mobile==false && ShowMostRecentOb==true)
    {
        MostRecentOb = symbolPlotG.lastChild
        highlightMostRecentOb()
    }
    else if(Mobile==false)
    {
        mostRecentDataDiv.style.visibility = "hidden"
    }
    else
    {
        navTable.style.visibility="hidden"
    }

    //---add lines and circles to print data see:print.js---
    PrintDataG = PlotSVG.append("g")
    .attr("id", "printDataG")
    .attr("stroke", "violet")
    .attr("fill", "none")
    .attr("pointer-events", "none")
    .attr("transform", "translate("+PlotOffsetX+" "+PlotOffsetY+")")
    
    //---add svg G containers---
    MeanG = PlotG.append("g")
    .attr("id", "meanG")
    .attr("clip-path", "url(#clip)")
    .style("display", "none")

    MeanCurveG = MeanG.append("g")
    .attr("id", "meanCurveG")

    MeanCurve = MeanCurveG.append("path")
    .attr("id", "meanCurve")

    MeanPointG = MeanG.append("g")
    .attr("id", "meanPointG")

    MeanErrorBarG = MeanG.append("g")
    .attr("id", "meanErrorBarG")
    .attr("clip-path", "url(#clip)")
    .style("display", "none")
    .attr("pointer-events", "none")
    .attr("stroke", "#9370DB")
    .attr("fill", "none")

    if(InitBoxSlide==false)
    {
        initBox()
        initBoxSlide()
    }

    PointsG.append("rect")
    .attr("id", "dataPacketRect")
    .attr("stroke", "darkorange")
    .attr("stroke-width", ".1")
    .attr("fill", "none")
    .attr("point-events", "hidden")
    .attr("width", "1")
    .attr("height", "1")
    .attr("x", "-.5")
    .attr("y", "-.5")
    .style("display", "none")
}



//============Date Format Selection=============
//---on radio click---
function julianDateRadioClicked()
{
    if(RequestInitDateFormat=="Julian" && hiddenFromJD.value!="All")
    {
        requestedDateCheck.disabled=false
        requestedTR.style.opacity="1"
    }

    DateFormat = "Julian"

    scaleAxes(scaleAxesType.Days)

    xaxisJulianG.style.visibility = "visible"
    xaxisCalendarG.style.visibility = "hidden"

    d3.select("#xAxisName").text("Julian Days")
    .attr("y", 560)
}

function calendarDateRadioClicked()
{
    requestedDateCheck.disabled=true
    requestedTR.style.opacity=".3"
    if(BoxAreaSet==false)
        if(requestedDateCheck.checked==true)
        {
            requestedTR.style.opacity=".3"
            requestedDateCheck.checked=false
            requestedDateChecked()
        }

    DateFormat = "Calendar"

    scaleAxes(scaleAxesType.Days)

    xaxisJulianG.style.visibility = "hidden"
    xaxisCalendarG.style.visibility = "visible"

    d3.select("#xAxisName").text("U.T.C. Calendar Date")
    .attr("y", 570)
}
