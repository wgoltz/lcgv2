var ErrorBarData =[] //[value,JD] see buildData.js---
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


    if(errorBarCheck.checked==true)
    {
        resetMean()
        meanCurveButton.disabled = true
        meanCurveDiv.style.visibility = "hidden"
        if(ErrorBarInit==false)
            buildErrorBars()
            else
            {

                for(var k = 0; k<ErrorBarData.length; k++)
                {
                    var bar = document.getElementById("errorBar"+k)
                    var symbolId = "point"+ErrorBarData[k].index
                    var symbol = document.getElementById(symbolId)
                    var uncert = parseFloat(symbol.getAttribute("uncert"))
                    if(uncert>UncertGT)
                    {
                        if(symbol.style.display=="block")
                            bar.style.display = "block"
                            else
                                bar.style.display = "none"

                    }

                }

            }

            ErrorBarActive = true
            ErrorBarG.style("display", "block")

    }
    else
    {

        meanCurveButton.disabled = false

        ErrorBarActive = false
        ErrorBarG.style("display", "none")
    }

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
        if(errorBarCheck.checked==true)
        {
            ErrorBarG.selectAll(".errorBar")
            .data(ErrorBarData)
            .style("display", function(d)
                {
                    if(d.uncert>UncertGT) return "block"; else return "none"
                }
            )

            //---show only symbols with error bar---
            for(var k = 0; k<ErrorBarData.length; k++)
            {
                var bar = document.getElementById("errorBar"+k)

                var symbolId = "point"+ErrorBarData[k].index
                var symbol = document.getElementById(symbolId)
                var uncert = parseFloat(symbol.getAttribute("uncert"))
                if(uncert>UncertGT)
                {
                    if(symbol.style.display=="block")
                        bar.style.display = "block"
                        else
                            bar.style.display = "none"
                }
                else
                {
                    bar.style.display = "none"
                }

            }

        }
    }

}

var UncertGT = 0
function buildErrorBars()
{
    /*---Create the Error Bars---
        Called from:
           errorBarCheckClicked @ 10_errorBar.js
    */

    var height = PlotHeight-30
    var max = getMaxMag(Data)
    var min = getMinMag(Data)
    var magXFactor = height/(max-min)

    ErrorBars = ErrorBarG.selectAll(".errorBar")
    .data(ErrorBarData)
    .enter().append("line")
    .style("display", function(d)
        {
            if(d.uncert>UncertGT) return "block"; else return "none"
        }
    )
    .attr("id", function(d, i)
        {
            return "errorBar"+i
        }
    )
    .attr("class", "errorBar)")
    .attr("stroke-width", function(d)
        {
            if(d.uncert<.05) return .4; else return .8
        }
    )
    .attr("pointer-events", "none)")
    .attr("marker-start", "url(#startArrow)")
    .attr("marker-end", "url(#endArrow)")
    .attr("x1", 0)
    .attr("y1", function(d)
        {
            return -d.uncert*magXFactor
        }
    )
    .attr("x2", 0)
    .attr("y2", function(d)
        {
            return d.uncert*magXFactor
        }
    )

    //---show only symbols with error bar---
    for(var k = 0; k<ErrorBarData.length; k++)
    {
        var bar = document.getElementById("errorBar"+k)

        var symbolId = "point"+ErrorBarData[k].index
        var symbol = document.getElementById(symbolId)
        var uncert = parseFloat(symbol.getAttribute("uncert"))
        if(uncert>UncertGT)
        {
            if(!symbol.style.display||symbol.style.display=="block")
                bar.style.display = "block"
                else
                    bar.style.display = "none"
        }
        else
        {
            bar.style.display = "none"
        }

    }
    ErrorBars.attr("transform", function (d)
        {
            return "translate("+XscaleJulian(d.JD)+" "+YL(d.mag)+")"
        }
    )

    ErrorBarInit = true

    ErrorBarActive = true
    ErrorBarG.style("display", "block")
   
}

function resetErrorBar()
{

    errorBarCheck.checked = false
    ErrorBarG.style("display", "none")
    ErrorBarG.selectAll(".errorBar").remove()
    ErrorBarInit = false
    ErrorBarActive = false
    for(var k = errorBarG.childNodes.length-1; k>=0; k--)
        errorBarG.removeChild(errorBarG.childNodes.item(k))

}