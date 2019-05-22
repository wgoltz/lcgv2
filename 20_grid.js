var GridG
var GridXG
var GridYG

function initGrid()
{
    /*---Establish base grid---
        Called from:
           buildJsonObj @ 02_buildData.js
           initPlot @ 03_initPlot.js
    */
    //================grid lines=============
    var height = PlotHeight-30
    //---Draw the x Grid lines, dynamic: changes vs Julian/Calendar select---
    GridXG = GridG.append("g")
    .attr("pointer-events", "none")
    .attr("shape-rendering" ,"geometricPrecision")
    .attr("id", "gridXG")
    .attr("class", "gridX")
    .attr("fill", "none")
    .attr("stroke", "lightgrey")
    .attr("stroke-opacity", ".7")
    .attr("stroke-width", "1.5")
    .attr("transform", "translate(0," + (height) + ")")

    if(DateFormat=="Julian")
    GridXG.call(make_x_axisJulian() //---default--
        .tickSize(-height, 0, 0)
        .tickFormat("")
    )
    else if(DateFormat=="Calendar")
        GridXG.call(make_x_axisCalendar()
        .tickSize(-height, 0, 0)
        .tickFormat("")
    )

    // Draw the y Grid lines
    GridYG = GridG.append("g")
    .attr("pointer-events", "none")
    .attr("shape-rendering" ,"geometricPrecision")
    .attr("id", "gridYG")
    .attr("class", "gridY")
    .attr("fill", "none")
    .attr("stroke", "lightgrey")
    .attr("stroke-opacity", ".7")
    .attr("stroke-width", "1.5")
    .call(make_y_axis()
        .tickSize(-XaxisWidth, 0, 0)
        .tickFormat("")
    )

    scalePoints()
    scaleAxes()
}

function gridPrefCheckClicked()
{
    /*---Preferences : grid on/off---
        Called from:
           gridPrefCheck @ index.htm
    */

    if(gridPrefCheck.checked==true)
        GridG.attr("display", "block")
        else
            GridG.attr("display", "none")

}


function make_y_axis()
{
    /*---the y-grid lines ---
        GridYG.call(make_y_axis()

        Called from:
           boxResetButtonClicked @ 05_boxPlot.js
           setBoxArea @ 05_boxPlot.js
           reset_axis_slide @ 07_boxSlide.jg
           changeMagRangeButtonClicked @ 25_magnitudeRange.js
    */
    return d3.svg.axis()
    .scale(YL)
    .orient("left")
}
//=====Julian Date vs Calendar date============
// function for the x grid lines
function make_x_axisJulian()
{
    /*---the x grid lines---
    GridXG.call(make_x_axisJulian())
        Called from:
           julianDateRadioClicked @ 04_buildPlot.js
           reset_axis_slide @ 07_boxSlide.js
           dateExtendPlot @ 09_dateExtend.js
           initGrid @ 20_grid.js
    */
    return d3.svg.axis()
    .scale(XscaleJulian)
    .orient("bottom")
}
// function for the x grid lines
function make_x_axisCalendar()
{
    /*---the x grid lines---
    GridXG.call(make_x_axisCalendar)
        Called from:
           calendarDateRadioClicked @ 04_buildPlot.js
           reset_axis_slide @ 07_boxSlide.js
           dateExtendPlot @ 09_dateExtend.js
           initGrid @ 20_grid.js
    */
    return d3.svg.axis()
    .scale(XscaleCalendar)
    .orient("bottom")
}
