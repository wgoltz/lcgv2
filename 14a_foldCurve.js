//---each new star---
var FoldArray =[]
function buildFoldSelect()
{
    /*---Create drop-down menu for fold bands---
        Called from:
           buildJsonObj @ 02_buildData.js
    */
    FoldArray =[]
    //---clear previous---
    for(var k = foldSelect.options.length-1; k>=0; k--)
        foldSelect.removeChild(foldSelect.options[k])

    for(var k = 0; k<SymbolClones.length; k++)
    {

        bandId = SymbolClones[k].getAttribute("id").split("band_")[1]
        for(j = 0; j<BandSymbolJson.length; j++)
        {
            var jsonBand = BandSymbolJson[j].band
            var jsonCnt = BandSymbolJson[j].cnt
            if(jsonBand==bandId)
            {

                for(m = 0; m<BandNameArray.length; m++) //---see 19_dataSelect.js--
                {
                    var bnd = BandNameArray[m][1]
                    if(bandId==bnd)
                    {
                        var bandName = BandNameArray[m][0]
                        var bgColor = BandNameArray[m][2]
                        MeanColorArray.push([bnd, bgColor])
                        break
                    }
                }
                var jsonCnt = BandSymbolJson[j].cnt
                var option = document.createElement("option")
                option.style.backgroundColor = bgColor

                if(bgColor=="white")
                    option.style.color = "black"
                option.value = jsonBand
                option.text = bandName+" ("+jsonCnt+")"
                foldSelect.appendChild(option)

                break
            }
        }
    }

//    if (FoldActive)
//        setFoldPeriod()
}

var FoldSlider

function keyUpFoldPeriod()
{
    /*---onkeyup over bin value---
        Called from:
           binSizeValue @ index.htm
    */
    var keyUpPeriod = parseFloat(foldPeriodValue.value)
    if(keyUpPeriod>0)
    {
        FoldPeriodValue = keyUpPeriod
        FoldSlider.value(foldPeriodValue)
        setFoldPeriod()
    }
}

function initFoldSlider()
{
    /*---Create the Mean Bin slider---
        Called from:
           initPlot @ 03_initPlot.js
    */

    foldPeriodValue.value = FoldPeriodValue

    FoldSlider = d3.slider().value(FoldPeriodValue).axis(true).min(.1).max(20).step(.1)
    .on("slide", function(evt, value)
    {
        FoldPeriodValue = value
        if(FoldPeriodValue<3)
            foldPeriodValue.value = FoldPeriodValue.toFixed(1)
        else
            foldPeriodValue.value = FoldPeriodValue.toFixed(0)
    })
    d3.select('#foldSliderDiv').call(foldPeriodSlider)
}

//---reset on new star---
function resetFoldPeriod()
{
    /*---Remove previous mean, init bin slider---
        Called from:
           boxButtonClicked @ 05_boxPlot.js
           sendAnotherPlotLoading @ 08_plotAnotherCurve.js
    */
    if(FoldActive==true)
    {
        FoldActive = false

        if(FoldOpen==true)
            closeDiv("foldPeriodDiv")

        FoldPeriod.attr("d", null)
        FoldPointG.selectAll(".foldPoint").remove()
//        for(var k = meanErrorBarG.childNodes.length-1; k>=0; k--)
//            meanErrorBarG.removeChild(meanErrorBarG.childNodes.item(k))

        foldPeriodSliderDiv.innerHTML = ""

        FoldValue = 1
        initFoldSlider()

        FoldBand = null
    }
//    setFoldPeriod()

}

var FoldBand

function foldBandSelected()
{
    /*---Mean drop-down menu selection---
        Called from on change:
            foldBandSelect @ lcgBETA.js
    */
//    if(!FoldActive)
//    if(FoldValue!=1) //---initial start value
        setFoldPeriod()
}

var FoldG
var FoldPeriodG
var FoldPeriod
var D3line
var FoldPointG
var MeanErrorBarG
var FoldActive = false
var FoldOpen = false

var FoldPeriodType = 'linear'
function foldPeriodTypeSelected()
{
    /*---on change drop-down menu ---
        Called from:
           foldPeriodTypeSelect @ index.htm
    */
    FoldPeriodType = foldPeriodTypeSelect.options[foldPeriodTypeSelect.selectedIndex].value
    if(FoldPeriodType=="none")
        FoldPeriodG.style("display", "none")
    else if(FoldActive==true)
    {
        if(FoldPeriodType!="linear")
            FoldPeriod.transition().duration(800).attr('d', D3line.interpolate(FoldPeriodType).tension(0.65))
        else
            FoldPeriod.transition().duration(800).attr('d', D3line.interpolate(FoldPeriodType))

        FoldPeriodG.style("display", "block")
    }
}


var FoldValue = 1
var AvgSDArray =[]
var MedianCurvePoints =[]

function setFoldPeriod()
{
    /*---create mean points and curve---
        Called from:
            openDiv @ 00_util.js
            keyUpMeanBin @ 14_meanCurve.js
            foldBandSelected @ 14_meanCurve.js
            foldPeriodSliderDiv @ index.htm
    */
    FoldG.attr("display", "block")
    var foldBand = foldBandSelect.options[foldBandSelect.selectedIndex].value

    FoldBand = foldBand
    var foldObs = SymbolG.selectAll("."+foldBand)[0]
     var points = PlotSVG.selectAll(".Points")[0]

    var foldObsJDMagArray =[]

    // select points with contrib selected and band selected
    for(var k = 0; k<foldObs.length; k++)
    {
        var foldOb = foldObs[k]
        var faint = foldOb.getAttribute("faint")
        var pnt = points[k]
        if(pnt.style.display=="block" && faint=="0")
        {
            var JD = parseFloat(foldOb.getAttribute("xValTop"))
            var mag = parseFloat(foldOb.getAttribute("yVal"))
            var tf = d3.transform(foldOb.getAttribute("transform"))
            var transX = tf.translate[0]
            var transY = tf.translate[1]
            foldObsJDMagArray.push([JD, mag, transX, transY])
        }
    }

//    if(document.getElementById("bandFaintCheck"))
//    if(bandFaintCheck.checked==false)
//    {
//        for(var k = 0; k<points.length; k++)
//        {
//            var pnt = points[k]
//            var faint = pnt.getAttribute("faint")
//            if(faint!="0")
//                pnt.style.display = "none"
//        }
//    }

    // get band display color
    for(var k = 0; k<MeanColorArray.length; k++)
    {
        var bnd = MeanColorArray[k][0]
        if(bnd==foldBand)
        {
            var meanColor = MeanColorArray[k][1]
            break
        }
    }

    var jdSpan = (PlotJDEnd-PlotJDStart)
    var binJD = jdSpan/FoldValue

    var bins = Math.ceil(binJD)

    var binOffsetX = XaxisWidth/binJD

    // the following loop requires points sorted by jd
    var binYArray =[], binXArray =[]
    var yArray = null, xArray = null
    for(var k=0, m=0; k < bins; k++)
    {
        var x0 = k*binOffsetX
        var x1 = x0+binOffsetX

        for (; m<foldObsJDMagArray.length; m++)
        {
            var ob = foldObsJDMagArray[m]
            var myX = ob[2]

            if(myX<x0)
                continue // next obs

            if(myX>x1)
                break // next bin

            if(yArray==null)
            {
                yArray = []
                xArray = []
            }

            yArray.push(ob[3])
            xArray.push(ob[2])
        }

        if(yArray != null)
        {
            binYArray.push(yArray) // mag's (in screen coords)
            binXArray.push(xArray)
        }
        else
        {
            binYArray.push([])
            binXArray.push([])
        }

        yArray = null
        xArray = null
    }

    AvgSDArray =[]
    for(var k = 0; k<bins; k++)
    {
        var yVals = binYArray[k]
        var xVals = binXArray[k]
        var ys = binYArray[k].length

        if(ys>0)
            AvgSDArray.push([standardDeviation(yVals), average(xVals)])

    }

    if(meanColor=="black") //---Vis---
    {
        var fillColor = "white"
        var strokeColor = "black"
        var strokeWidth = "1"
    }
    else
    {
        var strokeColor = "none"
        var strokeWidth = "0"
        var fillColor = meanColor
    }

    FoldPointG.attr("fill", fillColor)
    FoldPointG.selectAll(".foldPoint").remove()

    FoldPointG.selectAll(".foldPoint")
    .data(AvgSDArray)
    .enter().append("circle")
    .attr("class", "foldPoint")
    .attr("avg", function(d)
    {
        return d[0][0]
    })
    .attr("sd", function(d)
    {
        return d[0][1]
    })
    .attr("serr", function(d)
    {
        var numpoints = d[0][2]
        if(numpoints>3)
            return d[0][1]/Math.sqrt(numpoints - 1.5)
        return 0
    })
    .attr("npoints", function(d)
    {
        return d[0][2]
    })
    .attr("stroke", strokeColor)
    .attr("stroke-width", strokeWidth)
    .attr("r", "5")
    .attr("cx", function(d)
    {
        return d[1]
    })
    .attr("cy", function(d)
    {
        return d[0][0]
    })
    .attr("onmouseover", "showMeanPointData(evt)")
    .attr("onmouseout", "hideMeanPointData(evt)")

    MedianCurvePoints =[]

    for(var k = 0; k<AvgSDArray.length; k++)
    {
        var x = AvgSDArray[k][1]
        var y = AvgSDArray[k][0][0]
        MedianCurvePoints.push([x, y])
    }

    //--- fill d curveS----
    if(FoldPeriodType!="none")
    {
        D3line = d3.svg.line()
        if(FoldPeriodType=="linear")
            FoldPeriod.datum(MedianCurvePoints)
            .transition().duration(800).attr('d', D3line.interpolate(FoldPeriodType))
            .attr("id", "meanCurve")
            .attr("stroke", meanColor)
            .attr("fill", "none")
            .attr("vector-effect", "non-scaling-stroke")
            .attr("stroke-width", "1")
        else
            FoldPeriod.datum(MedianCurvePoints)
            .transition().duration(800).attr('d', D3line.interpolate(FoldPeriodType).tension(0.65))
            .attr("id", "meanCurve")
            .attr("stroke", meanColor)
            .attr("fill", "none")
            .attr("vector-effect", "non-scaling-stroke")
            .attr("stroke-width", "1")
    }

    var points = PlotSVG.selectAll(".Points")[0]
    for(var k = 0; k<points.length; k++)
    {
        var pnt = points[k]
        var band = pnt.getAttribute("band")
        if(band==FoldBand)
            if (pnt.style.display=="block")
                pnt.setAttribute("opacity", '.1')
            else
                pnt.removeAttribute("opacity")
    }
//    if(document.getElementById("bandFaintCheck"))
//        if(bandFaintCheck.checked==false)
//    {
//        for(var k = 0; k<points.length; k++)
//        {
//            var pnt = points[k]
//            var faint = pnt.getAttribute("faint")
//            if(faint!="0")
//                pnt.style.display = "none"
//        }
//    }

    if(meanErrorBarCheck.checked)
        addMeanErrorBars()

    FoldActive = true
}

function addMeanErrorBars()
{
    /*---Create mean error bars---
        Called from:
           foldPeriodBarCheckClicked @ 14_meanCurve.js
           setFoldPeriod @ 14_meanCurve.js
    */
    //---compute line values:length----
    var meanBarData =[]
    for(var k = 0; k<MedianCurvePoints.length; k++)
    {
        var x = MedianCurvePoints[k][0]
        var y = MedianCurvePoints[k][1]
        var sd = AvgSDArray[k][0][1]
        var npoints = AvgSDArray[k][0][2]
        meanBarData.push([x, y, sd, npoints])
    }

    for(var k = meanErrorBarG.childNodes.length-1; k>=0; k--)
        meanErrorBarG.removeChild(meanErrorBarG.childNodes.item(k))

        MeanErrorBarG.selectAll(".meanErrorBar")
        .data(meanBarData)
        .enter().append("line")
        .attr("class", "meanErrorBar)")
        .attr("pointer-events", "none)")
        .attr("stroke-width", function(d)
        {
// ?               if(d[2]<20) return .5; else return 1;
            if(d[3]>10) return .5; else return 1;

        })
        .attr("marker-start", "url(#startArrow)")
        .attr("marker-end", "url(#endArrow)")
        .attr("x1", function(d)
        {
                return d[0]
        })
        .attr("y1", function(d)
        {
//                return d[1]-.5*d[2]
            return d[1]-d[2]
        })
        .attr("x2", function(d)
        {
                return d[0]
        })
        .attr("y2", function(d)
        {
//                return d[1]+.5*d[2]
            return d[1]+d[2]
        })

        MeanErrorBarG.style("display", "block")
}

function meanCurveButtonClicked()
{
    /*---show mean curve pane---
        Called from:
          meanCurveButton @ index.htm
    */
    FoldG.style("display", "block")
    openDiv("foldPeriodDiv")

    setFoldPeriod()
}

function standardDeviation(values)
{
    /*---compute standard deviation---
        Called from:
           setFoldPeriod @ 14_meanCurve.js
    */
//    var avg = median(values);
    var avg = average(values);

    var squareDiffs = values.map(function(value)
    {
        var diff = value - avg;
        return diff * diff;
    })

//    var avgSquareDiff = median(squareDiffs);
    var avgSquareDiff = average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);

    return[avg, stdDev, values.length];
}

function average(data)
{
    /*---Not used---

    */
    var sum = data.reduce(function(sum, value)
    {
        return sum + value;
    }
    , 0);

    var avg = sum / data.length;
    return avg;
}

function median(values)
{
    /*---return median values ---
        Called from:
           standardDeviation @ 14_meanCurve.js
    */

    values.sort(function(a, b)
    {
        return a - b;
    });

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}
/*
var list1 = [3, 8, 9, 1, 5, 7, 9, 21];
console.log(median(list1));
console.log(average(list1));
*/
