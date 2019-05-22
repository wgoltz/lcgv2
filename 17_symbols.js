var SymbolClones =[]
var SymbolSVG
function createSymbolClones()
{
    /*---clones symbols---
        Called from:
           initPlot @ 03_initPlot.js
    */

    SymbolSVG = d3.select("#symbolSVG") //---svg symbol holder in web page---
    for(var k = 0; k<symbolSVG.childNodes.length; k++)
    {
        var elem = symbolSVG.childNodes.item(k)
        if(elem.nodeName=="g")
            SymbolClones.push(elem)

    }
}

function fillColorFromBandName(band, pgon)
{
    for(var k=0;k<BandNameArray.length;k++)
    {
        var bandName = BandNameArray[k]
        if(band == bandName[1])
        {
            pgon.setAttribute("fill", bandName[2])
            break
        }
    }
}

function addSymbolPolygons()
{
    /*---place polygons in each symbol <g>---
        Called from:
           buildPlot @ 04_buildPlot.js
         
    */

    var symbolGs = symbolPlotG.childNodes

    for(var k = 0; k<symbolGs.length; k++)
    {
        var symbolG = symbolGs[k]
        var bandName = symbolG.getAttribute("band")

        var faint = (symbolG.getAttribute("faint")=="1")

        var myG = (faint) ? symbolSVG.getElementById("band_Faint") : symbolSVG.getElementById("band_" + bandName)

        symbolG.setAttribute("fill", myG.getAttribute("fill"))

        var polygon = myG.firstChild

        var clonedPolygon = polygon.cloneNode("true")
        if(faint)
        {
            symbolG.setAttribute("faintParent", bandName)
            fillColorFromBandName(bandName, clonedPolygon)
        }

        clonedPolygon.setAttribute("onmouseover", "showPointData(evt)")
        clonedPolygon.setAttribute("onclick", "dataPacketSelected(evt)")
        symbolG.appendChild(clonedPolygon)

        if(myG.childNodes.length==2)
        {
            var cloneTop = myG.lastChild.cloneNode("true")
            cloneTop.setAttribute("onmouseover", "showPointData(evt)")
            cloneTop.setAttribute("onclick", "dataPacketSelected(evt)")

            symbolG.appendChild(cloneTop) //---fill=white--

        }

    }

}


