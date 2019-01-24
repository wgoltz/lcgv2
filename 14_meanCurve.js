//---each new star---
var MeanColorArray =[]
function buildMeanSelect()
{
    /*---Create drop-down menu for mean bands---
        Called from:
           buildJsonObj @ 02_buildData.js
    */
    MeanColorArray =[]
    //---clear previous---
    for(var k = meanBandSelect.options.length-1; k>=0; k--)
        meanBandSelect.removeChild(meanBandSelect.options[k])

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
                    meanBandSelect.appendChild(option)

                    break
            }
        }
    }


}

//---reset on new star---
function resetMean()
{
    /*---Remove previous mean, init bin slider---
        Called from:
           boxButtonClicked @ 05_boxPlot.js
           sendAnotherPlotLoading @ 08_plotAnotherCurve.js
    */
    if(MeanActive==true)
    {
        MeanActive = false

        if(MeanOpen==true)
            closeDiv("meanCurveDiv")

            MeanCurve.attr("d", null)
            MeanPointG.selectAll(".meanPoint").remove()
            for(var k = meanErrorBarG.childNodes.length-1; k>=0; k--)
            meanErrorBarG.removeChild(meanErrorBarG.childNodes.item(k))

            meanBinSliderDiv.innerHTML = ""
            var initValue = 1

            d3.select('#meanBinSliderDiv').call(d3.slider().value(initValue).axis(true).min(.1).max(20).step(.1).on
                ("slide", function(evt, value)
                    {
                        BinValue = value
                        if(BinValue<3)
                            binSizeValue.value = BinValue.toFixed(1)
                            else
                                binSizeValue.value = BinValue.toFixed(0)
                    }
                )
            );
        binSizeValue.value = 1

        BinValue = 1
        MeanBand = null
    }

}

var MeanBand
function meanBandSelected()
{
    /*---Mean drop-down menu selection---
        Called from on change:
            meanBandSelect @ lcgBETA.js
    */
    if(BinValue!=1) //---initial start value
        setMeanBin()

}

var InitMean = false
var MeanG
var MeanCurveG
var MeanCurve
var D3line
var MeanPointG
var MeanErrorBarG
var MeanActive = false
var MeanOpen = false
function initMeanBinSlider()
{
    /*---Create the Mean Bin slider---
        Called from:
           initPlot @ 03_initPlot.js
    */

    var initValue = 1

    d3.select('#meanBinSliderDiv').call(d3.slider().value(initValue).axis(true).min(.1).max(20).step(.1).on
        ("slide", function(evt, value)
            {
                BinValue = value
                if(BinValue<3)
                    binSizeValue.value = BinValue.toFixed(1)
                    else
                        binSizeValue.value = BinValue.toFixed(0)
            }
        )
    );

    InitMean = true

}

var MeanCurveType = 'linear'
function meanCurveTypeSelected()
{
    /*---on change drop-down menu ---
        Called from:
           meanCurveTypeSelect @ index.htm
    */
    MeanCurveType = meanCurveTypeSelect.options[meanCurveTypeSelect.selectedIndex].value
    if(MeanCurveType=="none")
        MeanCurveG.style("display", "none")
        else if(MeanActive==true)
        {
            if(MeanCurveType!="linear")
                MeanCurve.transition().duration(800).attr('d', D3line.interpolate(MeanCurveType).tension(0.65))
            else
                MeanCurve.transition().duration(800).attr('d', D3line.interpolate(MeanCurveType))

            MeanCurveG.style("display", "block")
        }
}
function meanErrorBarCheckClicked()
{
    /*---User request mean error bars display ---
        Called from:
           meanErrorBarCheck @ index.htm
    */
    if(meanErrorBarCheck.checked)
    {
        if(MeanActive==true)
        {
            MeanErrorBarG.style("display", "block")
            addMeanErrorBars()

        }
    }
    else
    {
        MeanErrorBarG.style("display", "none")
    }
}

var BinValue = 1
var AvgSDArray =[]
var MedianCurvePoints =[]

function keyUpMeanBin()
{
    /*---onkeyup over bin value---
        Called from:
           binSizeValue @ index.htm
    */
    var keyUpBin = parseFloat(binSizeValue.value)
    if(keyUpBin>0)
    {
        BinValue = keyUpBin
        setMeanBin()

    }
}


function setMeanBin()
{
    /*---create mean points and curve---
        Called from:
            openDiv @ 00_util.js
            keyUpMeanBin @ 14_meanCurve.js
            meanBandSelected @ 14_meanCurve.js
            meanBinSliderDiv @ index.htm
    */
    MeanG.attr("display", "block")
    var meanBand = meanBandSelect.options[meanBandSelect.selectedIndex].value

    MeanBand = meanBand
    var meanObs = SymbolG.selectAll("."+meanBand)[0]

    var meanObsJDMagArray =[]

    for(var k = 0; k<meanObs.length; k++)
    {
        var meanOb = meanObs[k]
        var faint = meanOb.getAttribute("faint")

        if(faint=="0")
        {
            var JD = parseFloat(meanOb.getAttribute("xValTop"))
            var mag = parseFloat(meanOb.getAttribute("yVal"))
            var tf = d3.transform(meanOb.getAttribute("transform"))
            var transX = tf.translate[0]
            var transY = tf.translate[1]
            meanObsJDMagArray.push([JD, mag, transX, transY])
        }
    }

    var points = PlotSVG.selectAll(".Points")[0]

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

    for(var k = 0; k<MeanColorArray.length; k++)
    {
        var bnd = MeanColorArray[k][0]
        if(bnd==meanBand)
        {
            var meanColor = MeanColorArray[k][1]
            break
        }
    }

    var jdSpan = (PlotJDEnd-PlotJDStart)
    var binJD = jdSpan/BinValue

    var bins = Math.ceil(binJD)

    var binOffsetX = XaxisWidth/binJD

    var centerStartX = binOffsetX/2
    var binXArray =[]
    for(var k = 0; k<bins; k++)
    {
        var binX0 = k*binOffsetX
        var binX1 = binX0+binOffsetX
        binXArray.push([binX0, binX1])
    }
    var binYArray =[]
    for(var k = 0; k<binXArray.length; k++)
    {
        var x0 = binXArray[k][0]
        var x1 = binXArray[k][1]
        var yArray =[]
        for(m = 0; m<meanObsJDMagArray.length; m++)
        {
            var ob = meanObsJDMagArray[m]
            var myX = ob[2]
            if(myX>=x0&&myX<=x1)
            {
                yArray.push(ob[3]) //---[JD,mag,transX,transY]---
            }
        }
        binYArray.push(yArray)
    }

    AvgSDArray =[]
    for(var k = 0; k<binYArray.length; k++)
    {
        var yVals = binYArray[k]
        var ys = binYArray[k].length

        if(ys>0)
            AvgSDArray.push([standardDeviation(yVals), median(yVals), k])

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

    MeanPointG.attr("fill", fillColor)
    MeanPointG.selectAll(".meanPoint").remove()

    MeanPointG.selectAll(".meanPoint")
    .data(AvgSDArray)
    .enter().append("circle")
    .attr("class", "meanPoint")
    .attr("avg", function(d)
        {
            return d[0][0]
        }
    )
    .attr("sd", function(d)
        {
            return d[0][1]
        }
    )
    .attr("stroke", strokeColor)
    .attr("stroke-width", strokeWidth)
    .attr("r", "5")
    .attr("cx", function(d)
        {
            return centerStartX+d[2]*binOffsetX
        }
    )
    .attr("cy", function(d)
        {
            return d[1]
        }
    )
    .attr("onmouseover", "showMeanPointData(evt)")
    .attr("onmouseout", "hideMeanPointData(evt)")

    MedianCurvePoints =[]

    for(var k = 0; k<AvgSDArray.length; k++)
    {
        var x = centerStartX+AvgSDArray[k][2]*binOffsetX
        var y = AvgSDArray[k][0][0]
        MedianCurvePoints.push([x, y])
    }

    //--- fill d curveS----
    if(MeanCurveType!="none")
    {
        D3line = d3.svg.line()
        if(MeanCurveType=="linear")
            MeanCurve.datum(MedianCurvePoints)
            .transition().duration(800).attr('d', D3line.interpolate(MeanCurveType))
            .attr("id", "meanCurve")
            .attr("stroke", meanColor)
            .attr("fill", "none")
            .attr("vector-effect", "non-scaling-stroke")
            .attr("stroke-width", "1")
        else
            MeanCurve.datum(MedianCurvePoints)
            .transition().duration(800).attr('d', D3line.interpolate(MeanCurveType).tension(0.65))
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
        if(band==MeanBand)
        {
            pnt.style.display = "block"
            pnt.setAttribute("opacity", '.1')
        }

        else
        {
            pnt.style.display = "none"
            pnt.removeAttribute("opacity")
        }

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

    if(meanErrorBarCheck.checked)
        addMeanErrorBars()

        MeanActive = true
}

function addMeanErrorBars()
{
    /*---Create mean error bars---
        Called from:
           meanErrorBarCheckClicked @ 14_meanCurve.js
           setMeanBin @ 14_meanCurve.js
    */
    //---compute line values:length----
    var meanBarData =[]
    for(var k = 0; k<MedianCurvePoints.length; k++)
    {
        var x = MedianCurvePoints[k][0]
        var y = MedianCurvePoints[k][1]
        var sd = AvgSDArray[k][0][1]
        meanBarData.push([x, y, sd])
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
                if(d[2]<20) return .5; else return 1;
            }
        )
        .attr("marker-start", "url(#startArrow)")
        .attr("marker-end", "url(#endArrow)")
        .attr("x1", function(d)
            {
                return d[0]
            }
        )
        .attr("y1", function(d)
            {
                return d[1]-.5*d[2]
            }
        )
        .attr("x2", function(d)
            {
                return d[0]
            }
        )
        .attr("y2", function(d)
            {
                return d[1]+.5*d[2]
            }
        )

        MeanErrorBarG.style("display", "block")
}

function meanCurveButtonClicked()
{
    /*---show mean curve pane---
        Called from:
          meanCurveButton @ index.htm
    */
    MeanG.style("display", "block")
    openDiv("meanCurveDiv")
}

function standardDeviation(values)
{
    /*---compute standard deviation---
        Called from:
           setMeanBin @ 14_meanCurve.js
    */
    var avg = median(values);

    var squareDiffs = values.map(function(value)
        {
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        }
    );

    var avgSquareDiff = median(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return[avg, stdDev];
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
        }
    );

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