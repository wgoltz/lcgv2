var EmptyRequest=false
function emptyRequest()
{      
    /*
        Opens PlotAnotherCurveDiv :
        1) Called from direct url: https://www.aavso.org/LCGv2/
        2) User sends empty ' >> Plot a light curve' at AAVSO main page
            called from testBrowserVersion() @ 13_bowser.js
    */
    EmptyRequest=true

    plotAnotherCurveDiv.style.visibility="visible"
    if(Mobile==false)
    {
         var height = plotAnotherCurveDiv.scrollHeight
          plotAnotherCurveDiv.style.height=height+"px"
    }

    plotAnotherCurveCloseButton.style.visibility="hidden"
    sendAnotherPlotButton.disabled = false
    plotAnotherSpan.innerHTML="Plot a light curve"
    setPlotAnotherCurveTodayDate()

    initPlot()
    anotherStarNameValue.focus()

}