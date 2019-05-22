//var ErrorBarData =[] //[value,JD] see buildData.js---
var ErrorBarG
var ErrorBars
var ErrorBarInit = false
var ErrorBarActive = false

function errorBarCheckClicked()
{
    /*---Preferences: Build/Show error bars---
        Called from:
           errorBarCheck @ index.htm
    */

    ErrorBarActive = errorBarCheck.checked

    if(ErrorBarInit==false)
        buildErrorBars()

    displayPoints()
}

function errorBarSelected()
{
    /*---Preferences: onChange = show only error bars > UncertGT(span) ---
        Called from:
            errorBarSelect @ index.htm
    */
    if(errorBarSelect.selectedIndex>0)
    {
        UncertGT = parseFloat(errorBarSelect.options[errorBarSelect.selectedIndex].value)

        if(ErrorBarActive)
            displayPoints()
    }
}


var UncertGT = 0

function buildErrorBars()
{
    /*---Create the Error Bars---
        Called from:
           errorBarCheckClicked @ 10_errorBar.js
    */

    ErrorBars = ErrorBarG.selectAll(".errorBar")
    .data(Data)
    .enter().append("line")
    .attr("id", function(d, i)
    {
        return "errorBar"+i
    })
    .attr("class", "errorBar")
    .attr("stroke-width", function(d)
    {
        return (d.uncert<.05) ? .4 : .8
    })
    .attr("pointer-events", "none)")
    .attr("marker-start", "url(#startArrow)")
    .attr("marker-end", "url(#endArrow)")
    .attr("x1", 0)
    .attr("x2", 0)

    ErrorBarInit = true 
}



