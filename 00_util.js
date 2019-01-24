//---real numbers---
function numberWithCommas(realNum)
{
    /*---Real number converted to string showing commas: e.g. 234950000 > 234,950,000 ---
       called from:
            findJDstartEnd @ 02_buildData.js
    */

    return (realNum + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c)
        {
            return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".")? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,"): b) + c;
        }
    );
}

function julian2Date(JD)
{
    /*---returns calendar format string: YYYY/MM/DD hh:mm:ss---
        called from:
            buildJsonObj @ 02_buildData.js
            findJDstartEnd @ 02_buildData.js
            slideToggle @ 07_boxSlide.js
            slideDrag @ 07_boxSlide.js
            countAPASSresponse @ 23_apassData.js
            processAPASSresponse @ 23_apassData.js
    */

    var X = parseFloat(JD)+0.5;
    var Z = Math.floor(X); //Get day without time
    var F = X - Z; //Get time
    var Y = Math.floor((Z-1867216.25)/36524.25);
    var A = Z+1+Y-Math.floor(Y/4);
    var B = A+1524;
    var C = Math.floor((B-122.1)/365.25);
    var D = Math.floor(365.25*C);
    var G = Math.floor((B-D)/30.6001);
    //must get number less than or equal to 12)
    var month = (G<13.5)? (G-1): (G-13);
    //if Month is January or February, or the rest of year
    var year = (month<2.5)? (C-4715): (C-4716);
    //month -= 1; //Handle JavaScript month format
    var UT = B-D-Math.floor(30.6001*G)+F;
    var day = Math.floor(UT);
    //Determine time
    UT -= Math.floor(UT);
    UT *= 24;
    var hour = Math.floor(UT);
    UT -= Math.floor(UT);
    UT *= 60;
    var minute = Math.floor(UT);
    UT -= Math.floor(UT);
    UT *= 60;
    var second = Math.round(UT);
    month = month+""
    if(month.length==1)
        month = "0"+month
        day = day+""
        if(day.length==1)
        day = "0"+day
        hour = hour+""
        if(hour.length==1)
        hour = "0"+hour
        minute = minute+""
        if(minute.length==1)
        minute = "0"+minute
        second = second+""
        if(second.length==1)
        second = "0"+second
        //--- time format="YYYY/MM/DD hh:mm:ss"
        return year+"/"+month+"/"+day+" "+hour+":"+minute+":"+second

};
function openDiv(myDiv)
{
    /*---opens and displays a DIV w/transition---
        called from:
            printStart @ 11_print.js
            dataPacketSelected @ 12_symbolDataPacket.js
            meanCurveButtonClicked @ 14_meanCurve.js
            buildContribSelect @ 16_contributors.js
            plotAnotherButton @ index.htm
            prefButton @ index.htm
            boxHelpButton @ index.htm
            contribHelpButton @ index.htm
    */

    var divDoc = document.getElementById(myDiv)

    var divD3 = d3.select("#"+myDiv)
    if(myDiv=="meanCurveDiv")
    {
        if(MeanActive==true)
        {
            setMeanBin()
        }
        dataSelectDiv.style.visibility = "hidden"
        navTable.style.visibility = "hidden"
        MeanOpen = true
        MeanG.style("display", "block")
        if(MostRecentOb)
            closeDiv("mostRecentDataDiv")
    }
    else
    {
        var height = divDoc.scrollHeight
        if(myDiv!="contribSelectDiv" && height>1000)
        {
            height = 1000
            divD3.style("overflow-y", "scroll")
        }
            if(myDiv=="contribSelectDiv" || myDiv=="symbolDataPacketDiv" )
                divD3.transition().duration(500).style("height", height+"px")
        if(myDiv=="plotAnotherCurveDiv")
        {
            sendAnotherMsgDiv.innerHTML=""
            if(plotAnotherCurveDiv.style.height=="1px")
                var height = plotAnotherCurveDiv.scrollHeight+10
            else
                var height = plotAnotherCurveDiv.scrollHeight

            plotLastDaysCheck.checked=false
            sendAnotherMsgDiv.innerHTML = ""
            sendAnotherPlotButton.disabled = false
            mtypeSelect.selectedIndex = 0
            if(AnotherCurveBeginInit==false)
                setPlotAnotherCurveTodayDate()
            if(AllBands==false)
                userBandRequestDiv.style.visibility='visible'

        }
          if(divDoc.style.visibility=="hidden")
          divD3.transition().duration(500).style("height", height+"px")
    }
     divDoc.style.visibility = "visible"
}
function closeDiv(myDiv)
{
    /*---closes/hides a DIV w/transition---
        called from:
            openDiv @ 00_util.js
            buildJsonObj @ 02_buildData.js
            printCancel @ 11_print.js
            resetMean @ 14_meanCurve.js
            closeMostRecentDivButton @ index.htm
            boxHelpCloseButton @ index.htm
            contribHelpCloseButton @ index.htm
            symbolDataPacketCloseButton @ index.htm
            meanCurveCloseButton @ index.htm
            preferenceCloseButton @ index.htm
            plotAnotherCurveCloseButton @ index.htm
    */
    var divD3 = d3.select("#"+myDiv)
        if(myDiv=="plotAnotherCurveDiv")
        {
                userBandRequestDiv.style.visibility='hidden'
                  //---reset pane/preferences---
                  myStarNameSelect.selectedIndex=0
                 // anotherStarNameValue.value=""
                  anotherFromDateValue.style.background="linen"
                  /*
                    //---uncheck all preferred bands--
                    var unCheckArray=["Vis","Faint","B","V","R","I","U","J","H","K","CV","CR","TB","TG","TR","SU","SG","SR",
                    "SI","SZ","RJ","IJ","STU","STV","STB","STY","STHBW","STHBN","MA","MB","MI","NA","Blue","Green","Yellow","Orange",
                    "Red","ZS","Y","HA","HAC"]
                    for(var k=0;k<unCheckArray.length;k++)
                    {
                        var bnd=unCheckArray[k]
                        document.getElementById("request"+bnd+"Check").checked=false
                    }
                    userBandAllCheck.checked=true
                    */
        }


    if(myDiv=="meanCurveDiv")
    {
      
        dataSelectDiv.style.visibility = "visible"
        navTable.style.visibility = "visible"
        MeanOpen = false
        MeanG.style("display", "none")
        divD3.style("visibility", "hidden")
        var points = PlotSVG.selectAll(".Points")[0]
        for(var k = 0; k<points.length; k++)
        {
            var pnt = points[k]
            pnt.removeAttribute("opacity")
            var myBand = pnt.getAttribute("band")
            if(eval("band"+myBand+"Check.checked"))
                pnt.style.display = "block"
                else
                    pnt.style.display = "none"
        }
        if(document.getElementById("bandFaintCheck"))
         if(bandFaintCheck.checked==false)
        {
            for(var k = 0; k<points.length; k++)
            {
                var pnt = points[k]
                var faint = pnt.getAttribute("faint")
                if(faint!="0")
                    pnt.style.display = "none"
            }
        }
    }
    else
    {
        divD3.style("overflow", "hidden")
        divD3.style("overflow-y", "hidden")
        divD3.transition().duration(500).style("height", 1+"px")
        .each("end", function()
            {
                divD3.style("visibility", "hidden")
                divD3.style("overflow", "hidden")
            }
        )
        if(myDiv=="symbolDataPacketDiv")
        {
            DataPacketVis = false
            pointDataDiv.style.backgroundColor = "linen"
            DataPacketPoint = null
            dataPacketRect.style.display="none"
        }
    }
}