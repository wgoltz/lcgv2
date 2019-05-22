function highlightMostRecentOb()
{
    /*---The last observation of this plot: provide innerHTML @ mostRecentSymbolDataDiv ---
        Called from:
           buildPlot @ 04_buildPlot.js
           MostRecentOb = symbolPlotG.lastChild
    */
if(Mobile==false)
{
    var band = MostRecentOb.getAttribute("band")
    var faint = MostRecentOb.getAttribute("faint")
    var uncert = MostRecentOb.getAttribute("uncert")
    var comCode = MostRecentOb.getAttribute("comCode")

    //---e.g. BandNameArray[0]=["Visual","Vis"]
    for(var k = 0; k<BandNameArray.length; k++)
    {
        var nmBand = BandNameArray[k][1]
        if(nmBand==band)
        {
            var longName = BandNameArray[k][0]
            break
        }
    }

    var obsId = "ID# "+MostRecentOb.getAttribute("obsID") +"<br>"
    var xValTop = parseFloat(MostRecentOb.getAttribute("xValTop"))
    var xVal = MostRecentOb.getAttribute("xVal")

    var yVal = MostRecentOb.getAttribute("yVal")
    var by = MostRecentOb.getAttribute("by")
    var comment = MostRecentOb.getAttribute("comment")
    if(comment)
    {
        var reUS = /_/
        comment = "<br>Comment: "+comment.replace(reUS, " ")
    }
    else
        comment = ""

    if(faint!="0")
    {

        yVal = "&lt;" + yVal

    }

    if(uncert!=0)
    {

        yVal += " ("+uncert+")"

    }

    if(comCode!="")
    {

        comCode = "<br>Codes:"+comCode

    }
    else
        comCode = ""

        var bandNme = "<br>Band: "+longName

        mostRecentSymbolDataDiv.innerHTML = obsId+"JD: "+ xValTop+"<br>UTC: "+xVal+"<br>Mag: "+yVal +comCode+bandNme+"<br>by: "+by+comment

        mostRecentDataDiv.style.visibility = "visible"

 }
 else
  mostRecentDataDiv.style.visibility = "hidden"

}

var PrevPoint

function showPointData(evt)
{
    /*---mouse over symbol ---
        Called from:
           symbol polygon @ 17_symbols.js
    */
 if(!DragTarget)
 {
    var reUS = /_/
    if(BoxOn == false)
    {
        var x = evt.clientX;
        var y = evt.clientY;
        var target = evt.target.parentNode
        var id = target.getAttribute("id")

        //  var opacity=parseFloat(target.getAttribute("opacity"))
        //if(opacity!=.025)  //---contribs---
        if(!target.getAttribute("dataPrint"))
        {
            if(PrevPoint) //---reset scale to 10
            {

                var tf = PrevPoint.getAttribute("transform")
                var trans = tf.split("scale")[0]
                PrevPoint.setAttribute("transform", trans+"scale("+SymbolScaleRatio+")")

            }

            PrevPoint = target
            if(DataPacketVis==true)
            {

                if(DataPacketPoint==PrevPoint)
                    pointDataDiv.style.backgroundColor = "white"
                    else
                        pointDataDiv.style.backgroundColor = "linen"
            }

            var band = target.getAttribute("band")
            var faint = target.getAttribute("faint")
            // Additional fields to include would be "uncertainty" (a.k.a magnitude error) which typically is shown immediately following the magnitude, before the band, and "Comment code" (not to be confused with "Comments". FYI. The comment codes are defined here:
            var uncert = target.getAttribute("uncert")
            var comCode = target.getAttribute("comCode")

            var tf = target.getAttribute("transform")
            var trans = tf.split("scale")[0]
            //---BandNameArray[0]=["Visual","Vis"]
            for(var k = 0; k<BandNameArray.length; k++)
            {
                var nmBand = BandNameArray[k][1]
                if(nmBand==band)
                {
                    var lngName = BandNameArray[k][0]
                    break

                }
            }

            var expand = SymbolScaleRatio*1.3

            PrevPoint.setAttribute("transform", trans+"scale("+(expand)+")")

            //var obsId = target.getAttribute("obsId")
            var obsId = "ID# "+target.getAttribute("obsID") +"<br>"
            var xValTop = target.getAttribute("xValTop")
            var xVal = target.getAttribute("xVal")
            var yVal = target.getAttribute("yVal")
            var by = target.getAttribute("by")
            

            if(faint!="0")
            {

                yVal = "&lt;" + yVal

            }

            if(uncert!=0)
            {

                yVal += " ("+uncert+")"

            }

            if(comCode!="")
            {

                comCode = "<br>Codes:"+comCode

            }
            else
                comCode = ""

                var bandNme = "<br>Band: "+lngName

                var scrollY = window.pageYOffset
                if(PrintOn==false)
                obsId = ""
                else
                {
                    pointDataDiv.innerHTML = obsId+"JD: "+ xValTop+"<br>UTC: "+xVal+"<br>Mag: "+yVal +comCode+bandNme+"<br>by: "+by
                    pointDataDiv.style.left = x+10+"px"
                    pointDataDiv.style.top = scrollY+y+20+"px"
                    pointDataDiv.style.visibility = "visible"

                }
        }

    }
    }
    else
    hidePointData()
}

function hidePointData()
{
    /*---mouse out at symbol---
        Called from:
            symbol polygon @ 17_symbols.js
    */
    pointDataDiv.style.visibility = "hidden"
    if(PrevPoint)
    {
        var tf = PrevPoint.getAttribute("transform")
        var trans = tf.split("scale")[0]
        PrevPoint.setAttribute("transform", trans+"scale("+SymbolScaleRatio+")")
    }
    PrevPoint = null

}

function showMeanPointData(evt)
{
    /*---mouse over mean point---
        Called from:
          mean point  @ 14_meanCurve.js
    */
    var x = evt.clientX;
    var y = evt.clientY;
    var target = evt.target
    var sd = parseFloat(target.getAttribute("sd"))
    var avg = parseFloat(target.getAttribute("avg"))
    var npoints = target.getAttribute("npoints")
    var serr = parseFloat(target.getAttribute("serr"))
//    var max = getMaxMag(Data)
//    var min = getMinMag(Data)
    var max = BoxMaxMag
    var min = BoxMinMag
    var magSpan = max-min
    var height = PlotHeight-30
    var magPerX = magSpan/height
    var sdMag = sd*magPerX
    var avgMag = min+avg*magPerX
    var serrMag = serr*magPerX

//        pointDataDiv.innerHTML = "mean = "+avgMag.toFixed(2)+"<br>standard deviation = "+sdMag.toFixed(2)+"<br>number = "+npoints
    if(npoints > 3)
        pointDataDiv.innerHTML = "mean = "+avgMag.toFixed(2)+" / "+serrMag.toFixed(2)
    else
        pointDataDiv.innerHTML = "mean = "+avgMag.toFixed(1)+" ("+npoints+" points)"

    var scrollY = window.pageYOffset
    pointDataDiv.style.left = x+10+"px"
    pointDataDiv.style.top = scrollY+y+20+"px"
    pointDataDiv.style.visibility = "visible"

}

function hideMeanPointData(evt)
{
    /*---mouse out mean point---
        Called from:
          mean point  @ 14_meanCurve.js
    */

    pointDataDiv.style.visibility = "hidden"

}

function showSpectra(evt)
{
    /*---mouse over spectra symbol(sample)--
        Called from:
          addSampleSpectra  @ 22_spectra.js
    */

    var x = evt.clientX;
    var y = evt.clientY;
    var target = evt.target

    pointDataDiv.innerHTML = "Spectra <br>JD: (Julian Date)  <br>UTC: (Calendar Date)<br>Comment: Lorem ipsum dolor sit amet..."
    var scrollY = window.pageYOffset
    pointDataDiv.style.left = x+10+"px"
    pointDataDiv.style.top = scrollY+y+20+"px"
    pointDataDiv.style.visibility = "visible"

}

function hideSpectra()
{
    /*---mouse out spectra symbol(sample)--
        Called from:
          addSampleSpectra  @ 22_spectra.js
    */

    pointDataDiv.style.visibility = "hidden"

}
