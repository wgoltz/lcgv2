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
         var faintParent=bandName


        var faint = symbolG.getAttribute("faint")
       if(faint=="1")
       bandName="Faint"



            var myG = symbolSVG.getElementById("band_"+bandName)

            var fillBot = myG.getAttribute("fill") //--first pgon--
            symbolG.setAttribute("fill", fillBot)

            var botPgon = myG.firstChild

                var cloneBot = botPgon.cloneNode("true")
              if(faint=="1") //---faint color---
                 {
                   symbolG.setAttribute("faintParent",faintParent)
                   setFaintColor(faintParent,cloneBot)//---19_dataSelect.js---
                 }

                cloneBot.setAttribute("onmouseover", "showPointData(evt)")
                cloneBot.setAttribute("onclick", "dataPacketSelected(evt)")
                symbolG.appendChild(cloneBot)



         if(myG.childNodes.length==2)
        {
            var cloneTop = myG.lastChild.cloneNode("true")
            cloneTop.setAttribute("onmouseover", "showPointData(evt)")
            cloneTop.setAttribute("onclick", "dataPacketSelected(evt)")

            symbolG.appendChild(cloneTop) //---fill=white--

        }

    }

}


