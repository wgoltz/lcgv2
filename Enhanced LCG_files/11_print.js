/*
This prints the Plot and its symbols, plus the user can
show the data associated with one or more point. This includes a connecting line
from the data box to its symbol. The data boxes can be moved.
*/

function printCancel()
{
    /*--Cancel print request--
        Called from:
            clearPreviousPlot @04_buildPlot.js
            printCancelButton @ index.htm
    */

   //---printCancelButton clicked---
  plotSVG.removeAttribute("onmousedown")
    plotSVG.removeAttribute("onmousemove")
    plotSVG.removeAttribute("onmouseup")

    PrintDataG.selectAll(".dataLine").remove("*")
      PrintDataG.selectAll(".dragTarget").remove("*")
    contribSelectDiv.style.overflow = ""
    contribSelectDiv.style.height = ""
    contribSelectDiv.style.display = "block"
    d3.select("#symbolPlotG").selectAll("polygon")
    .attr("onclick", "dataPacketSelected(evt)")
    hidePointData()
    for(var k = 0; k<DataSVGArray.length; k++)
    {
        var mySymbol = DataSVGArray[k][0]
        mySymbol.removeAttribute("dataPrint")

    }

    DataSVGArray =[]
     printStartDiv.style.visibility='hidden'
    PrintOn = false
    meanBinSliderDiv.style.visibility=''
}

var PrintOn = false
var PrintDataG //---add lines to print data---
var SVGx
var SVGy
//---provide window events for printing---
function printWindowEvent()
{
    //---LCG initially called: provide window events onbeforeprint/onafterprint shown below---
    /*---Auto call on 11_print.js load---
        Called from:
            11_print.js
    */

    var beforePrint = function()
    {
        navTable.style.visibility = "hidden"
        showLegend()
        contribSelectDiv.style.overflow = "hidden"
        contribSelectDiv.style.height = "1px"
        contribSelectDiv.style.display = "none"
          if(MeanActive == true)
             meanCurveCloseButton.style.visibility = "hidden"

        printStartDiv.style.visibility = "hidden"
        printTitleDiv.innerHTML = "AAVSO Light Curve: "+plotTitleDiv.innerHTML

        printTitleDiv.style.visibility = "visible"
       dataSelectDiv.style.visibility = "hidden"
      if(BrowserName!="Firefox")
      {
       if(DateFormat=="Julian")
       printTitleDiv.style.top="100%"
       else
        printTitleDiv.style.top="105%"
      }
      else
      {
        if(DateFormat=="Julian")
       printTitleDiv.style.top="95%"
       else
        printTitleDiv.style.top="97%"

      }

        hidePointData()

        if(BoxAreaSet == true)
        {
            slideLeftButton.style.visibility = "hidden"
            slideRightButton.style.visibility = "hidden"
            SlideRect.style("visibility", "hidden")
            horizLine.style.visibility = "hidden"
        }
       // var printDataDivs = d3.select("#printContainerDiv").selectAll(".printData")[0]
        if(BrowserName!="Firefox")
        {
           printContainerDiv.style.left = 100+"px"

        }


    };

    var afterPrint = function()
    {
        plotSVG.removeAttribute("onmousedown")
        plotSVG.removeAttribute("onmousemove")
        plotSVG.removeAttribute("onmouseup")

         meanBinSliderDiv.style.visibility=''
        printLegendDiv.style.display="none"
        if(MeanActive == false)
        navTable.style.visibility = "visible"
        else
            meanCurveCloseButton.style.visibility = ""


       contribSelectDiv.style.display = "block"
        contribSelectDiv.style.overflow = ""
        contribSelectDiv.style.height = ""
        printTitleDiv.style.visibility = "hidden"
        dataSelectDiv.style.visibility = "visible"
        if(BoxAreaSet == true)
        {
            slideLeftButton.style.visibility = "visible"
            slideRightButton.style.visibility = "visible"
            SlideRect.style("visibility", "visible")
            horizLine.style.visibility = "visible"
        }

        PrintDataG.selectAll(".dataLine").remove("*")
        PrintDataG.selectAll(".dragTarget").remove("*")
        d3.select("#symbolPlotG").selectAll("polygon")
        .attr("onclick", "dataPacketSelected(evt)")
        for(var k = 0; k<DataSVGArray.length; k++)
        {
            var mySymbol = DataSVGArray[k][0]
            mySymbol.removeAttribute("dataPrint")

        }

        DataSVGArray =[]

        PrintOn = false


    };

    if (window.matchMedia)
    {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql)
            {
                if (mql.matches)
                {
                    beforePrint();
                }
                else
                {
                    afterPrint();
                }
            }
        );
    }

    window.onbeforeprint = beforePrint
    window.onafterprint = afterPrint;

}


function showLegend()
{
      //---hide all legends---
    for(var k=0;k<BandNameArray.length;k++)
    {
        var band=BandNameArray[k][1]
        if(band=="LT")band="Faint"
        band=band.replace(/-/,"")
        document.getElementById("legend"+band).style.display="none"
        document.getElementById("divLegend"+band).style.display="none"
    }
        for(j = 0; j<BandSymbolJson.length; j++)
        {
            var band = BandSymbolJson[j].band
            var check = document.getElementById("band"+band+"Check")
            if(check.checked==true)
            {
                document.getElementById("legend"+band).style.display=""
                document.getElementById("divLegend"+band).style.display=""
            }
        }

      if(MeanActive == true && PrintOn==false)
        printLegendDiv.style.display="none"
      else
        printLegendDiv.style.display="block"
}
 //---initialize window print events---
printWindowEvent()

function printStart()
{
    /*---printButton clicked---
        Called from:
          printButton @ index.htm
    */
   meanBinSliderDiv.style.visibility='hidden'
    PrintOn = true
    printStartDiv.style.visibility='visible'
    //---add click to print data for each point---
    d3.select("#symbolPlotG").selectAll("polygon")
    .attr("onclick", "printMyData(evt)")

    DataSVGArray =[]
    hidePointData()


}

function printMyData(evt)
{
    /*---Click on a symbol ---
    event set at each symbol polygon
    per printStart @ 11_print.js
    */
    plotSVG.setAttribute("onmousedown","startPrintDataDrag(evt)")
    plotSVG.setAttribute("onmousemove","dragPrintData(evt)")
    plotSVG.setAttribute("onmouseup","endPrintDataDrag(evt)")

    var x = evt.clientX-80;
    var y = evt.clientY +40;

    var target = evt.target.parentNode
    var id = target.getAttribute("id")

    if(target.getAttribute("dataPrint")) //---remove---
    {
        target.removeAttribute("dataPrint")
        var myG = document.getElementById("printData"+id)
        printDataG.removeChild(myG)

        PrintDataG.select("#line_printData"+id).remove()
        for(var k = 0; k<DataSVGArray.length; k++)
        {
            var myId = DataSVGArray[k][3]
            if(myId=="printData"+id)
            {
                DataSVGArray.splice(k, 1)
                break
            }
        }
    }
    else
    {

        target.setAttribute("dataPrint", "true")
            var obsId = target.getAttribute("obsID")
            var xValTop = target.getAttribute("xValTop")
            var xVal = target.getAttribute("xVal")
            var yVal = target.getAttribute("yVal")
            var by = target.getAttribute("by")

            var band = target.getAttribute("band")
            var faint = target.getAttribute("faint")
            var uncert = target.getAttribute("uncert")

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

            if(faint!="0")
                yVal = "&lt;" + yVal

            if(uncert!=0)
                yVal += " ("+uncert+")"

            var bandNme = "Band: "+lngName

            var dy=12
            var textG = PrintDataG.append("g")
            .attr("id","printData"+id)
            .attr("class","dragTarget")

            .attr("pointer-events","all")

            var rect=textG.append("rect")
            .attr("x",x-10)
            .attr("y",y-10)
            .attr("fill","white")
            .attr("stroke","violet")
            .attr("stroke-width","2")
            .attr("rx","10")
            .attr("ry","10")

            var text=textG.append("text")
            .attr("pointer-events","none")
            .attr("x",x)
            .attr("y",y)
            .attr("font-family","arial")
            .attr("fill","black")
            .attr("stroke","none")
            .attr("font-size","12px")
            var tspanId=text.append("tspan")
            .attr("x",x)
            .attr("y",y+dy)
            .text("ID# "+obsId)

            var tspanJD=text.append("tspan")
            .attr("x",x)
            .attr("y",y+2*dy)
            .text("JD: "+xValTop)

            var tspanUTC=text.append("tspan")
            .attr("x",x)
            .attr("y",y+3*dy)
            .text("UTC: "+xVal)

            var tspanMag=text.append("tspan")
            .attr("x",x)
            .attr("y",y+4*dy)
            .text("Mag: "+yVal)

            var tspanBand=text.append("tspan")
            .attr("x",x)
            .attr("y",y+5*dy)
            .text(bandNme)

            var tspanBy=text.append("tspan")
            .attr("x",x)
            .attr("y",y+6*dy)
            .text("by: "+by)


            hidePointData()
           var bb=eval("printData"+id).getBBox()
            var bbw=bb.width
            var bbh=bb.height
            rect.attr("width",bbw+20)
            rect.attr("height",bbh+20)

            var x2 =x+(bbw)/ 2;
            var y2 =y+(bbh)/ 2;

            drawDataSvg(target,x2,y2, "printData"+id);




    }
}

//=====add lines to data==============
var NS="http://www.w3.org/2000/svg"
var DataSVGArray =[] //---drag/drop data---
function drawDataSvg(symbol,  x2,y2, dataGId)
{
    /*---Attach line from clicked symbol to data---
        Called from:
           printMyData @ 11_print.js
    */
    var tf = d3.transform(symbol.getAttribute("transform"))
    var transX = tf.translate[0]
    var transY = tf.translate[1]

    var x1 = transX
    var y1 = transY
    var myG=document.getElementById(dataGId)
     myG.setAttribute("style","cursor:move")
    var line = document.createElementNS(NS,"line")
    line.setAttribute("id", "line_"+dataGId)
    line.setAttribute("class", "dataLine")
    line.setAttribute("stroke-width", 2)
    line.setAttribute("x1", x1)
    line.setAttribute("y1", y1)
    line.setAttribute("x2", x2)
    line.setAttribute("y2", y2)

    printDataG.insertBefore(line,myG)

    DataSVGArray.push([symbol, x1, y1, dataGId]) //---drag/drop line x2,y2 change---

}
//--- on drag print data ---
function changeDataLine(dataGId, transX, transY)
{
    /*---Attached line end-point tracks moving data div---
        Called from:
          drag(evt) @ 11_print.js
    */

    var line = document.getElementById("line_"+dataGId)
    for(var k = 0; k<DataSVGArray.length; k++)
    {
        var myId = DataSVGArray[k][3]
        if(myId==dataGId)
        {
            var symbol = DataSVGArray[k][0]
            var x1 = DataSVGArray[k][1]
            var y1 = DataSVGArray[k][2]

            //---start line for data---
            var bb=document.getElementById(dataGId).getBBox()
          var bbw=bb.width
          var bbh=bb.height

            if(BrowserName!="Internet Explorer")
            {
                line.setAttribute("x2", transX+x1+.5*bbw)
                line.setAttribute("y2",transY+y1+.5*bbh+80)
            }
            else
            {
                line.setAttribute("x2", transX+x1+bbw)
                line.setAttribute("y2",transY+y1+bbh+80)
            }

            break
        }
    }

}


//==================drag data box==================
var TransformRequestObjDrag
var TransListDrag
var DragTarget=null;
var Dragging = false;
var OffsetX = 0;
var OffsetY = 0;
//---mouse down over element---
function startPrintDataDrag(evt)
{
    hidePointData()
	if(!Dragging) //---prevents dragging conflicts on other draggable elements---
	{
		if(evt.target.parentNode.getAttribute("class")=="dragTarget")
		{
			DragTarget = evt.target.parentNode;

			//---reference point to its respective viewport--
			var pnt = DragTarget.ownerSVGElement.createSVGPoint();
			pnt.x = evt.clientX;
			pnt.y = evt.clientY;
			//---elements transformed and/or in different(svg) viewports---
			var sCTM = DragTarget.getScreenCTM();
			var Pnt = pnt.matrixTransform(sCTM.inverse());

			TransformRequestObjDrag = DragTarget.ownerSVGElement.createSVGTransform()
			//---attach new or existing transform to element, init its transform list---
			var myTransListAnim=DragTarget.transform
			TransListDrag=myTransListAnim.baseVal

			OffsetX = Pnt.x
			OffsetY = Pnt.y

			Dragging=true;
		}
	}
}
//---mouse move---
function dragPrintData(evt)
{
	if(Dragging)
	{
        var pnt = DragTarget.ownerSVGElement.createSVGPoint();
        pnt.x = evt.clientX;
        pnt.y = evt.clientY;
        //---elements in different(svg) viewports, and/or transformed ---
        var sCTM = DragTarget.getScreenCTM();
        var Pnt = pnt.matrixTransform(sCTM.inverse());
        Pnt.x -= OffsetX;
        Pnt.y -= OffsetY;

        TransformRequestObjDrag.setTranslate(Pnt.x,Pnt.y)
        TransListDrag.appendItem(TransformRequestObjDrag)
        TransListDrag.consolidate()
        var dataGid=DragTarget.getAttribute("id")
        var tf=d3.transform(DragTarget.getAttribute("transform"))
        var transX=tf.translate[0]
        var transY=tf.translate[1]
        changeDataLine(dataGid, transX, transY)

	}
}
//--mouse up---
function endPrintDataDrag()
{
	Dragging = false ;

    DragTarget=null
}
