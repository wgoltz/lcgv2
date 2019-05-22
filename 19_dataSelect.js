function placeBandTitles()
{
    // BandNameArray[2]=["Johnson V","V","rgb(0,255,0)"]
    /*---put titles at dataSelect symbols---
        Called from:
           buildDataSelect @ 19_dataSelect.js
           buildMobileDataSelect @ 19_dataSelect.js
    */

    for(k = 0; k<BandNameArray.length; k++)
    {
        var band = BandNameArray[k][1].replace(/-/, "")
        if(band=="LT")
            band = "Faint"

            var td1 = document.getElementById(band+"TD1")
            td1.title = BandNameArray[k][0]
    }

}

function clearDataSelect()
{
    /*---display="none" on all data symbols---
        Called from:
           buildDataSelect @ 19_dataSelect.js
           buildMobileDataSelect @ 19_dataSelect.js
    */
    var selIdArray =[]
    selIdArray[0] = "Vis"
    selIdArray[1] = "NA"
    selIdArray[2] = "V"
    selIdArray[3] = "B"
    selIdArray[4] = "R"
    selIdArray[5] = "I"
    selIdArray[6] = "Orange"
    selIdArray[7] = "U"
    selIdArray[8] = "CV"
    selIdArray[9] = "CR"
    selIdArray[10] = "BlueVis"
    selIdArray[11] = "GreenVis"
    selIdArray[12] = "RedVis"
    selIdArray[13] = "YellowVis"
    selIdArray[14] = "SZ"
    selIdArray[15] = "TB"
    selIdArray[16] = "H"
    selIdArray[17] = "STU"
    selIdArray[18] = "STV"
    selIdArray[19] = "STB"
    selIdArray[20] = "STY"
    selIdArray[21] = "STHBW"
    selIdArray[22] = "STHBN"
    selIdArray[23] = "SU"
    selIdArray[24] = "SG"
    selIdArray[25] = "SR"
    selIdArray[26] = "SI"
    selIdArray[27] = "TG"
    selIdArray[28] = "TR"
    selIdArray[29] = "J"
    selIdArray[30] = "K"
    selIdArray[31] = "RJ"
    selIdArray[32] = "IJ"
    selIdArray[33] = "MA"
    selIdArray[34] = "MB"
    selIdArray[35] = "MI"
    selIdArray[36] = "Faint"
    selIdArray[37] = "ZS"
    selIdArray[38] = "Y"
    selIdArray[39] = "HA"
    selIdArray[40] = "HAC"
    selIdArray[41] = "CBB"
    //---spectra symbol: future---
    spectraTD.style.display = "none"

    for(var k = 0; k<selIdArray.length; k++)
    {
        var id = selIdArray[k]
        document.getElementById(id+"CntSpan").innerHTML = ""
        document.getElementById("band"+id+"Check").checked = false
        var td1 = document.getElementById(id+"TD1")
        var td2 = document.getElementById(id+"TD2")
        td1.style.display = "none"
        td2.style.display = "none"
    }
}

function buildDataSelect()
{
    /*
    This chooses the band symbol and their checkbox for this plot.
    It displays only those needed that are in the dataHolderDiv

        Called from:
           buildJsonObj @ 02_buildData.js
    */

    placeBandTitles()
    clearDataSelect()
    allSymbolCheck.checked = true
    var totalSymbols = symbolPlotG.childNodes.length
    totalSymbolSpan.innerHTML = totalSymbols
    for(j = 0; j<BandSymbolJson.length; j++)
    {
        var jsonBand = BandSymbolJson[j].band
        var jsonCnt = BandSymbolJson[j].cnt
        jsonBand = jsonBand.replace(/-/, "")
        document.getElementById(jsonBand+"CntSpan").innerHTML = jsonCnt
        document.getElementById("band"+jsonBand+"Check").checked = true
        var td1 = document.getElementById(jsonBand+"TD1")
        var td2 = document.getElementById(jsonBand+"TD2")
        td1.style.display = "block"
        td2.style.display = "block"

    }
    if(FaintCnt>0)
        {
            document.getElementById("FaintCntSpan").innerHTML = FaintCnt
            document.getElementById("bandFaintCheck").checked = true
            var td1 = document.getElementById("FaintTD1")
            var td2 = document.getElementById("FaintTD2")
            td1.style.display = "block"
            td2.style.display = "block"
        }
    dataSelectDiv.style.visibility = "visible"

}

function buildMobileDataSelect()
{
    /*---mobile users band symbols w/o checkbox---
        Called from:
          buildJsonObj @ 02_buildData.js
    */
    allSymbolCheckDiv.style.display = "none"
    placeBandTitles()
    clearDataSelect()
    allSymbolCheck.checked = true
    var totalSymbols = symbolPlotG.childNodes.length
    totalSymbolSpan.innerHTML = totalSymbols
    for(j = 0; j<BandSymbolJson.length; j++)
    {
        var jsonBand = BandSymbolJson[j].band
        var jsonCnt = BandSymbolJson[j].cnt
        jsonBand = jsonBand.replace(/-/, "")
        document.getElementById(jsonBand+"CntSpan").innerHTML = jsonCnt

        document.getElementById("band"+jsonBand+"Check").checked = true
        var td1 = document.getElementById(jsonBand+"TD1")

        var td2 = document.getElementById(jsonBand+"TD2")
        td2.style.display = "block"
        td2.style.visibility = "hidden"

        td1.style.display = "block"

        var symbolG = document.getElementById("g_"+jsonBand)

        symbolG.parentNode.setAttribute("viewBox", "0 0 7.5 7.5")


    }
       if(FaintCnt>0)
        {
            document.getElementById("FaintCntSpan").innerHTML = FaintCnt
            //document.getElementById("bandFaintCheck").checked = true
            var td1 = document.getElementById("FaintTD1")
            var td2 = document.getElementById("FaintTD2")
            td2.style.display = "block"
            td2.style.visibility = "hidden"

            td1.style.display = "block"
            var symbolG = document.getElementById("g_Faint")
            symbolG.parentNode.setAttribute("viewBox", "0 0 7.5 7.5")

        }
    dataSelectDiv.style.visibility = "visible"

}

function slideDiv(myDiv)
{
    /*--- ---
       not used
    */
    var divDoc = document.getElementById(myDiv)
    dataSelectDiv.style.visibility = "visible"

    var divD3 = d3.select("#"+myDiv)

    var width = divDoc.scrollWidth
    if(width>1200)
        dataSelectDiv.style.overflowX = "auto"

}

//=========================USER DATA OPTIONS========================
//---added bg color for band select---
/*
        <g id="band_Vis" bandNum="0" fill="none"   stroke="black" stroke-width=".1" name="Circle"><polygon pointer-events="visible" points="0.5,5.16573e-008 0.47553,-0.154508 0.40451,-0.293893 0.293893,-0.40451 0.154509,-0.475527 5.16573e-008,-0.5 -0.154508,-0.475527 -0.293893,-0.40451 -0.40451,-0.293893 -0.475527,-0.154508 -0.5,5.16573e-008 -0.475527,0.154509 -0.40451,0.293893 -0.293893,0.40451 -0.154508,0.47553 5.16573e-008,0.5 0.154509,0.47553 0.293893,0.40451 0.40451,0.293893 0.47553,0.154509" /></g>
        <g id="band_B" bandNum="3" fill="rgb(0,0,255)"   stroke="black" stroke-width=".025" name="Star6"><polygon points="0.216506,0.125 0.5,2.98023e-008 0.216506,-0.125 0.25,-0.433013 2.98023e-008,-0.25 -0.25,-0.433013 -0.216506,-0.125 -0.5,2.98023e-008 -0.216506,0.125 -0.25,0.433013 2.98023e-008,0.25 0.25,0.433013" /></g>
        <g id="band_V" bandNum="2" fill="rgb(0,255,0)"   stroke="black" stroke-width=".025" name="Pgon4"><polygon points="0.5,0.5 0.5,-0.5 -0.5,-0.5 -0.5,0.5" /></g>
        <g id="band_R" bandNum="4" fill="rgb(255,0,0)"   stroke="black" stroke-width=".025" name="Pgon4d"><polygon points="0.5,-1.47025e-007 -1.47025e-007,-0.5 -0.5,-1.47025e-007 -1.47025e-007,0.5" /></g>
        <g id="band_I" bandNum="5" fill="violet"   stroke="black" stroke-width=".025" name="Pgon6"><polygon points="0.5,5.96047e-008 0.25,-0.433013 -0.25,-0.433013 -0.5,5.96047e-008 -0.25,0.433013 0.25,0.433013" /></g>
        <g id="band_U" bandNum="7" fill="rgb(0,255,255)"   stroke="black" stroke-width=".025" name="EllipseHoriz"><polygon points="0.5,5.16573e-008 0.47553,-0.0772543 0.40451,-0.146946 0.293893,-0.202254 0.154509,-0.237764 5.16573e-008,-0.25 -0.154508,-0.237764 -0.293893,-0.202254 -0.40451,-0.146946 -0.475527,-0.0772543 -0.5,5.16573e-008 -0.475527,0.0772543 -0.40451,0.146946 -0.293893,0.202254 -0.154508,0.237764 5.16573e-008,0.25 0.154509,0.237764 0.293893,0.202254 0.40451,0.146946 0.47553,0.0772543" /></g>
        <g id="band_J" bandNum="28" fill="rgb(255,0,255)"   stroke="black" stroke-width=".025" name="RhombVert"><polygon points="-2.1855e-007,-0.5 -0.288675,-2.1855e-007 -2.1855e-007,0.5 0.288675,-2.1855e-007" /></g>
        <g id="band_H" bandNum="27" fill="rgb(128,128,128)"   stroke="black" stroke-width=".025" name="RhombHoriz"><polygon points="-2.1855e-007,-0.288675 -0.5,-2.1855e-007 -2.1855e-007,0.288675 0.5,-2.1855e-007" /></g>
        <g id="band_K" bandNum="26" fill="rgb(255,128,255)"   stroke="black" stroke-width=".025" name="Pgon4vRhombHoriz"><polygon points="0.5,-1.47025e-007 -1.47025e-007,-0.5 -0.5,-1.47025e-007 -1.47025e-007,0.5" /><polygon fill="white" points="-1.47025e-007,-0.282843 -0.489897,-1.47025e-007 -1.47025e-007,0.282843 0.489897,-1.47025e-007" /></g>
        <g id="band_CV" bandNum="8" fill="rgb(0,192,0)"   stroke="black" stroke-width=".025" name="Pgon4Star6"><polygon points="0.48077,0.48077 0.48077,-0.48077 -0.48077,-0.48077 -0.48077,0.48077" /><polygon fill="white" points="0.216506,0.125 0.5,3.57627e-008 0.216506,-0.125 0.25,-0.433013 3.57627e-008,-0.25 -0.25,-0.433013 -0.216506,-0.125 -0.5,3.57627e-008 -0.216506,0.125 -0.25,0.433013 3.57627e-008,0.25 0.25,0.433013" /></g>
        <g id="band_CR" bandNum="9" fill="rgb(192,0,0)"   stroke="black" stroke-width=".025" name="Pgon4vStar6"><polygon points="0.5,-1.47025e-007 -1.47025e-007,-0.5 -0.5,-1.47025e-007 -1.47025e-007,0.5" /><polygon fill="white" points="0.171464,0.0989947 0.39598,-1.47025e-007 0.171464,-0.098995 0.19799,-0.34293 -1.47025e-007,-0.19799 -0.19799,-0.34293 -0.171464,-0.098995 -0.39598,-1.47025e-007 -0.171464,0.0989947 -0.19799,0.34293 -1.47025e-007,0.19799 0.19799,0.34293" /></g>
        <g id="band_TB" bandNum="50" fill="rgb(0,0,64)"   stroke="black" stroke-width=".025" name="CircleStar6"><polygon points="0.5,-4.5697e-008 0.475527,-0.154509 0.40451,-0.293893 0.293893,-0.40451 0.154508,-0.47553 -4.5697e-008,-0.5 -0.154509,-0.47553 -0.293893,-0.40451 -0.40451,-0.293893 -0.47553,-0.154509 -0.5,-4.5697e-008 -0.47553,0.154508 -0.40451,0.293893 -0.293893,0.40451 -0.154509,0.475527 -4.5697e-008,0.5 0.154508,0.475527 0.293893,0.40451 0.40451,0.293893 0.475527,0.154508" /><polygon fill="white" points="0.20773,0.119933 0.479733,-4.5697e-008 0.20773,-0.119933 0.239866,-0.41546 -4.5697e-008,-0.239866 -0.239866,-0.41546 -0.20773,-0.119933 -0.479733,-4.5697e-008 -0.20773,0.119933 -0.239866,0.41546 -4.5697e-008,0.239866 0.239866,0.41546" /></g>
        <g id="band_TG" bandNum="51" fill="rgb(0,64,0)"   stroke="black" stroke-width=".025" name="CirclePgon4"><polygon points="0.5,-6.15913e-008 0.475527,-0.154509 0.40451,-0.293893 0.293893,-0.40451 0.154508,-0.475527 -6.15913e-008,-0.5 -0.154509,-0.475527 -0.293893,-0.40451 -0.40451,-0.293893 -0.475527,-0.154509 -0.5,-6.15913e-008 -0.475527,0.154508 -0.40451,0.293893 -0.293893,0.40451 -0.154509,0.475527 -6.15913e-008,0.5 0.154508,0.475527 0.293893,0.40451 0.40451,0.293893 0.475527,0.154508" /><polygon fill="white" points="0.312869,0.312869 0.312869,-0.312869 -0.312869,-0.312869 -0.312869,0.312869" /></g>
        <g id="band_TR" bandNum="52" fill="rgb(64,0,0)"   stroke="black" stroke-width=".025" name="CirclePgon4d"><polygon points="0.5,5.16573e-008 0.47553,-0.154508 0.40451,-0.293893 0.293893,-0.40451 0.154509,-0.475527 5.16573e-008,-0.5 -0.154508,-0.475527 -0.293893,-0.40451 -0.40451,-0.293893 -0.475527,-0.154508 -0.5,5.16573e-008 -0.475527,0.154509 -0.40451,0.293893 -0.293893,0.40451 -0.154508,0.47553 5.16573e-008,0.5 0.154509,0.47553 0.293893,0.40451 0.40451,0.293893 0.47553,0.154509" /><polygon fill="white" points="0.442463,5.16573e-008 5.16573e-008,-0.442463 -0.442463,5.16573e-008 5.16573e-008,0.442463" /></g>
        <g id="band_SU" bandNum="40" fill="rgb(192,192,0)"   stroke="black" stroke-width=".025" name="CircleRhombVert"><polygon points="0.5,5.16573e-008 0.47553,-0.154508 0.40451,-0.293893 0.293893,-0.40451 0.154509,-0.475527 5.16573e-008,-0.5 -0.154508,-0.475527 -0.293893,-0.40451 -0.40451,-0.293893 -0.475527,-0.154508 -0.5,5.16573e-008 -0.475527,0.154509 -0.40451,0.293893 -0.293893,0.40451 -0.154508,0.47553 5.16573e-008,0.5 0.154509,0.47553 0.293893,0.40451 0.40451,0.293893 0.47553,0.154509" /><polygon fill="white" points="5.16573e-008,-0.451587 -0.260724,5.16573e-008 5.16573e-008,0.451587 0.260724,5.16573e-008" /></g>
        <g id="band_SG" bandNum="41" fill="rgb(0,64,64)"   stroke="black" stroke-width=".025" name="CirclePgon3r"><polygon points="0.5,5.16573e-008 0.47553,-0.154508 0.40451,-0.293893 0.293893,-0.40451 0.154509,-0.475527 5.16573e-008,-0.5 -0.154508,-0.475527 -0.293893,-0.40451 -0.40451,-0.293893 -0.475527,-0.154508 -0.5,5.16573e-008 -0.475527,0.154509 -0.40451,0.293893 -0.293893,0.40451 -0.154508,0.47553 5.16573e-008,0.5 0.154509,0.47553 0.293893,0.40451 0.40451,0.293893 0.47553,0.154509" /><polygon fill="white" points="0.421483,5.16573e-008 -0.210741,-0.365013 -0.210741,0.365013" /></g>
        <g id="band_SR" bandNum="42" fill="rgb(128,64,0)"   stroke="black" stroke-width=".025" name="CirclePgon3t"><polygon points="0.5,5.16573e-008 0.47553,-0.154508 0.40451,-0.293893 0.293893,-0.40451 0.154509,-0.475527 5.16573e-008,-0.5 -0.154508,-0.475527 -0.293893,-0.40451 -0.40451,-0.293893 -0.475527,-0.154508 -0.5,5.16573e-008 -0.475527,0.154509 -0.40451,0.293893 -0.293893,0.40451 -0.154508,0.47553 5.16573e-008,0.5 0.154509,0.47553 0.293893,0.40451 0.40451,0.293893 0.47553,0.154509" /><polygon fill="white" points="0.365013,0.210741 5.16573e-008,-0.42148 -0.365013,0.210741" /></g>
        <g id="band_SI" bandNum="43" fill="rgb(192,64,0)"   stroke="black" stroke-width=".025" name="CirclePgon3l"><polygon points="0.5,5.16573e-008 0.47553,-0.154508 0.40451,-0.293893 0.293893,-0.40451 0.154509,-0.475527 5.16573e-008,-0.5 -0.154508,-0.475527 -0.293893,-0.40451 -0.40451,-0.293893 -0.475527,-0.154508 -0.5,5.16573e-008 -0.475527,0.154509 -0.40451,0.293893 -0.293893,0.40451 -0.154508,0.47553 5.16573e-008,0.5 0.154509,0.47553 0.293893,0.40451 0.40451,0.293893 0.47553,0.154509" /><polygon fill="white" points="0.210741,0.365013 0.210741,-0.365013 -0.42148,5.16573e-008" /></g>
        <g id="band_SZ" bandNum="29" fill="rgb(255,192,0)"   stroke="black" stroke-width=".025" name="CirclePgon3b"><polygon points="0.5,5.16573e-008 0.47553,-0.154508 0.40451,-0.293893 0.293893,-0.40451 0.154509,-0.475527 5.16573e-008,-0.5 -0.154508,-0.475527 -0.293893,-0.40451 -0.40451,-0.293893 -0.475527,-0.154508 -0.5,5.16573e-008 -0.475527,0.154509 -0.40451,0.293893 -0.293893,0.40451 -0.154508,0.47553 5.16573e-008,0.5 0.154509,0.47553 0.293893,0.40451 0.40451,0.293893 0.47553,0.154509" /><polygon fill="white" points="5.16573e-008,0.421483 0.365013,-0.210741 -0.365013,-0.210741" /></g>
        <g id="band_RJ" bandNum="10" fill="rgb(192,0,64)"   stroke="black" stroke-width=".025" name="Pgon6Circle"><polygon points="0.5,5.96047e-008 0.25,-0.433013 -0.25,-0.433013 -0.5,5.96047e-008 -0.25,0.433013 0.25,0.433013" /><polygon fill="white" points="0.319623,5.96047e-008 0.303979,-0.0987687 0.25858,-0.187869 0.187869,-0.25858 0.0987687,-0.303979 5.96047e-008,-0.319623 -0.0987687,-0.303979 -0.187869,-0.25858 -0.25858,-0.187869 -0.303979,-0.0987687 -0.319623,5.96047e-008 -0.303979,0.0987687 -0.25858,0.187869 -0.187869,0.25858 -0.0987687,0.303979 5.96047e-008,0.319623 0.0987687,0.303979 0.187869,0.25858 0.25858,0.187869 0.303979,0.0987687" /></g>
        <g id="band_IJ" bandNum="11" fill="rgb(192,64,128)"   stroke="black" stroke-width=".025" name="Pgon4dCircle"><polygon points="0.5,-1.49012e-008 -1.49012e-008,-0.5 -0.5,-1.49012e-008 -1.49012e-008,0.5" /><polygon fill="white" points="0.282509,-1.49012e-008 0.268682,-0.0873 0.228555,-0.166055 0.166055,-0.228555 0.0873,-0.268682 -1.49012e-008,-0.282509 -0.0873,-0.268682 -0.166055,-0.228555 -0.228555,-0.166055 -0.268682,-0.0873 -0.282509,-1.49012e-008 -0.268682,0.0873 -0.228555,0.166055 -0.166055,0.228555 -0.0873,0.268682 -1.49012e-008,0.282509 0.0873,0.268682 0.166055,0.228555 0.228555,0.166055 0.268682,0.0873" /></g>
        <g id="band_STU" bandNum="30" fill="rgb(0,192,255)"   stroke="black" stroke-width=".025" name="Pgon3l"><polygon points="0.433013,-0.5 -0.433013,-1.90734e-008 0.433013,0.5" /></g>
        <g id="band_STV" bandNum="31" fill="rgb(0,255,192)"   stroke="black" stroke-width=".025" name="Pgon3u"><polygon points="0.5,0.433013 1.19209e-007,-0.433013 -0.5,0.433013" /></g>
        <g id="band_STB" bandNum="32" fill="rgb(0,0,192)"   stroke="black" stroke-width=".025" name="Pgon3d"><polygon points="-1.50204e-007,0.433013 0.5,-0.433013 -0.5,-0.433013" /></g>
        <g id="band_STY" bandNum="33" fill="rgb(192,255,0)"   stroke="black" stroke-width=".025" name="Pgon3r"><polygon points="0.433013,1.19209e-007 -0.433013,-0.5 -0.433013,0.5" /></g>
        <g id="band_STHBW" bandNum="34" fill="rgb(0,128,255)"   stroke="black" stroke-width=".025" name="CircleEllipseVert"><polygon points="0.5,-9.23873e-008 0.475527,-0.154509 0.40451,-0.293893 0.293893,-0.40451 0.154508,-0.47553 -9.23873e-008,-0.5 -0.154509,-0.47553 -0.293893,-0.40451 -0.40451,-0.293893 -0.47553,-0.154509 -0.5,-9.23873e-008 -0.47553,0.154508 -0.40451,0.293893 -0.293893,0.40451 -0.154509,0.475527 -9.23873e-008,0.5 0.154508,0.475527 0.293893,0.40451 0.40451,0.293893 0.475527,0.154508" /><polygon fill="white" points="0.1875,-9.23873e-008 0.178323,-0.115881 0.151691,-0.22042 0.11021,-0.303382 0.0579407,-0.356647 -9.23873e-008,-0.375 -0.0579407,-0.356647 -0.11021,-0.303382 -0.151691,-0.22042 -0.178323,-0.115881 -0.1875,-9.23873e-008 -0.178323,0.115881 -0.151691,0.220419 -0.11021,0.303381 -0.0579407,0.356647 -9.23873e-008,0.375 0.0579407,0.356647 0.11021,0.303381 0.151691,0.220419 0.178323,0.115881" /></g>
        <g id="band_STHBN" bandNum="35" fill="rgb(0,128,192)"   stroke="black" stroke-width=".025" name="Pgon6Star6"><polygon points="0.5,0 0.25,-0.433013 -0.25,-0.433013 -0.5,0 -0.25,0.433013 0.25,0.433013" /><polygon fill="white" points="0.216506,0.125 0.5,0 0.216506,-0.125 0.25,-0.433013 0,-0.25 -0.25,-0.433013 -0.216506,-0.125 -0.5,0 -0.216506,0.125 -0.25,0.433013 0,0.25 0.25,0.433013" /></g>
        <g id="band_MA" bandNum="55"  fill="rgb(128,64,255)"   stroke="black" stroke-width=".025" name="Star4"><polygon points="0.176777,0.176777 0.5,2.98023e-008 0.176777,-0.176777 2.98023e-008,-0.5 -0.176777,-0.176777 -0.5,2.98023e-008 -0.176777,0.176777 2.98023e-008,0.5" /></g>
        <g id="band_MB" bandNum="56" fill="rgb(128,664,128)"   stroke="black" stroke-width=".025" name="Star10"><polygon points="0.146946,0.202254 0.40451,0.293893 0.237764,0.0772543 0.5,2.98023e-008 0.237764,-0.0772543 0.40451,-0.293893 0.146946,-0.202254 0.154509,-0.475527 2.98023e-008,-0.25 -0.154508,-0.475527 -0.146946,-0.202254 -0.40451,-0.293893 -0.237764,-0.0772543 -0.5,2.98023e-008 -0.237764,0.0772543 -0.40451,0.293893 -0.146946,0.202254 -0.154508,0.475527 2.98023e-008,0.25 0.154509,0.475527" /></g>
        <g id="band_MI" bandNum="57" fill="rgb(128,0,192)"   stroke="black" stroke-width=".025" name="Star15"><polygon points="0.102244,0.235138 0.295511,0.41223 0.18681,0.173697 0.435397,0.25687 0.239074,0.083173 0.5,0.0580453 0.25,-0.0207829 0.478147,-0.149866 0.217699,-0.120195 0.37362,-0.330915 0.147756,-0.197875 0.204488,-0.453797 0.0522643,-0.240391 -3.67563e-008,-0.49726 -0.0522643,-0.240391 -0.204489,-0.453797 -0.147756,-0.197875 -0.37362,-0.330915 -0.217699,-0.120195 -0.478147,-0.149866 -0.25,-0.0207829 -0.5,0.0580453 -0.239074,0.083173 -0.435397,0.25687 -0.18681,0.173697 -0.295512,0.41223 -0.102244,0.235138 -0.104528,0.49726 -3.67563e-008,0.25687 0.104528,0.49726" /></g>
        <g id="band_NA" bandNum="1" fill="rgb(255,255,0)"   stroke="black" stroke-width=".025" name="EllipseVert"><polygon points="0.25,5.16573e-008 0.237764,-0.154508 0.202254,-0.293893 0.146946,-0.40451 0.0772543,-0.475527 5.16573e-008,-0.5 -0.0772543,-0.475527 -0.146946,-0.40451 -0.202254,-0.293893 -0.237764,-0.154508 -0.25,5.16573e-008 -0.237764,0.154509 -0.202254,0.293893 -0.146946,0.40451 -0.0772543,0.47553 5.16573e-008,0.5 0.0772543,0.47553 0.146946,0.40451 0.202254,0.293893 0.237764,0.154509" /></g>
        <g id="band_Blue-Vis" bandNum="21" fill="rgb(0,0,128)"   stroke="black" stroke-width=".025" name="circle"><circle  r='8' /></g>
        <g id="band_Green-Vis" bandNum="22" fill="rgb(0,128,0)"   stroke="black" stroke-width=".025" name="circle"><circle r='8' /></g>
        <g id="band_Yellow-Vis" bandNum="24" fill="rgb(255,255,128)"   stroke="black" stroke-width=".025" name="circle"><circle  r='8' /></g>
        <g id="band_Orange" bandNum="6" fill="rgb(255,128,0)"   stroke="black" stroke-width=".025" name="circle"><circle  r='8' /></g>
        <g id="band_Red-Vis" bandNum="23" fill="rgb(128,0,0)"   stroke="black" stroke-width=".025" name="circle"><circle  r='8' /></g>
        <g id="band_ZS" bandNum="xx" fill="rgb(255,64,32)"   stroke="black" stroke-width=".025" name="CircleEllipseHoriz"><polygon points="0.5,5.16573e-008 0.47553,-0.154508 0.40451,-0.293893 0.293893,-0.40451 0.154509,-0.475527 5.16573e-008,-0.5 -0.154508,-0.475527 -0.293893,-0.40451 -0.40451,-0.293893 -0.475527,-0.154508 -0.5,5.16573e-008 -0.475527,0.154509 -0.40451,0.293893 -0.293893,0.40451 -0.154508,0.47553 5.16573e-008,0.5 0.154509,0.47553 0.293893,0.40451 0.40451,0.293893 0.47553,0.154509" /><polygon fill="white" points="0.4,5.16573e-008 0.380423,-0.0618033 0.323607,-0.117557 0.235114,-0.161803 0.123607,-0.190211 5.16573e-008,-0.2 -0.123607,-0.190211 -0.235114,-0.161803 -0.323607,-0.117557 -0.380423,-0.0618033 -0.4,5.16573e-008 -0.380423,0.0618033 -0.323607,0.117557 -0.235114,0.161803 -0.123607,0.190211 5.16573e-008,0.2 0.123607,0.190211 0.235114,0.161803 0.323607,0.117557 0.380423,0.0618033" /></g>
        <g id="band_Y" bandNum="xx" fill="rgb(96,0,0)"   stroke="black" stroke-width=".025" name="Pgon4Circle"><polygon points="0.5,0.5 0.5,-0.5 -0.5,-0.5 -0.5,0.5" /><polygon fill="white" points="0.383547,5.96047e-008 0.364777,-0.118523 0.310296,-0.225443 0.225443,-0.310296 0.118523,-0.364777 5.96047e-008,-0.383547 -0.118523,-0.364777 -0.225443,-0.310296 -0.310296,-0.225443 -0.364777,-0.118523 -0.383547,5.96047e-008 -0.364777,0.118523 -0.310296,0.225443 -0.225443,0.310296 -0.118523,0.364777 5.96047e-008,0.383547 0.118523,0.364777 0.225443,0.310296 0.310296,0.225443 0.364777,0.118523" /></g>
        <g id="band_HA" bandNum="xx" fill="rgb(192,32,0)"   stroke="black" stroke-width=".025" name="Pgon8Star4"><polygon points="0.5,-5.2154e-008 0.353553,-0.353553 -5.2154e-008,-0.5 -0.353553,-0.353553 -0.5,-5.2154e-008 -0.353553,0.353553 -5.2154e-008,0.5 0.353553,0.353553" /><polygon fill="white" points="0.162359,0.162359 0.45922,-5.2154e-008 0.162359,-0.162359 -5.2154e-008,-0.45922 -0.162359,-0.162359 -0.45922,-5.2154e-008 -0.162359,0.162359 -5.2154e-008,0.45922" /></g>
        <g id="band_HAC" bandNum="xx" fill="rgb(160,32,32)"   stroke="black" stroke-width=".025" name="CircleRhombHoriz"><polygon points="0.5,5.16573e-008 0.47553,-0.154508 0.40451,-0.293893 0.293893,-0.40451 0.154509,-0.475527 5.16573e-008,-0.5 -0.154508,-0.475527 -0.293893,-0.40451 -0.40451,-0.293893 -0.475527,-0.154508 -0.5,5.16573e-008 -0.475527,0.154509 -0.40451,0.293893 -0.293893,0.40451 -0.154508,0.47553 5.16573e-008,0.5 0.154509,0.47553 0.293893,0.40451 0.40451,0.293893 0.47553,0.154509" /><polygon fill="white" points="5.16573e-008,-0.260724 -0.451587,5.16573e-008 5.16573e-008,0.260724 0.451587,5.16573e-008" /></g>
*/
var BandNameArray =[]
BandNameArray[0] =["Visual", "Vis", "black"]
BandNameArray[1] =["Unknown", "NA", "rgb(255,255,0)"]
BandNameArray[2] =["Johnson V", "V", "rgb(0,255,0)"]
BandNameArray[3] =["Johnson B", "B", "rgb(0,0,255)"]
BandNameArray[4] =["Cousins R", "R", "rgb(255,0,0)"]
BandNameArray[5] =["Cousins I", "I", "violet"]
BandNameArray[6] =["Orange (Liller)", "Orange", "rgb(255,128,0)"]
BandNameArray[7] =["Johnson U", "U", "rgb(0,255,255)"]
BandNameArray[8] =["Unfiltered V Zeropoint", "CV", "rgb(0,192,0)"]
BandNameArray[9] =["Unfiltered Red Zeropoint", "CR", "rgb(192,0,0)"]
BandNameArray[10] =["Blue", "Blue-Vis", "rgb(0,0,128)"]
BandNameArray[11] =["Green", "Green-Vis", "rgb(0,128,0)"]
BandNameArray[12] =["Red", "Red-Vis", "rgb(128,0,0)"]
BandNameArray[13] =["Yellow", "Yellow-Vis", "rgb(255,255,128)"]
BandNameArray[14] =["Sloan z", "SZ", "rgb(255,192,0)"]
BandNameArray[15] =["Tri-Color Blue", "TB", "rgb(0,0,64)"]
BandNameArray[16] =["H NIR 1.6micron", "H", "rgb(128,128,128)"]
BandNameArray[17] =["Stromgren u", "STU", "rgb(0,192,255)"]
BandNameArray[18] =["Stromgren v", "STV", "rgb(0,255,192)"]
BandNameArray[19] =["Stromgren b", "STB", "rgb(0,0,192)"]
BandNameArray[20] =["Stromgren y", "STY", "rgb(192,255,0)"]
BandNameArray[21] =["Stromgren Hbw", "STHBW", "rgb(0,128,255)"]
BandNameArray[22] =["Stromgren Hbn", "STHBN", "rgb(0,128,192)"]
BandNameArray[23] =["Sloan u", "SU", "rgb(192,192,0)"]
BandNameArray[24] =["Sloan g", "SG", "rgb(0,64,64)"]
BandNameArray[25] =["Sloan r", "SR", "rgb(128,64,0)"]
BandNameArray[26] =["Sloan i", "SI", "rgb(192,64,0)"]
BandNameArray[27] =["Tri-Color Green", "TG", "rgb(0,64,0)"]
BandNameArray[28] =["Tri-Color Red", "TR", "rgb(64,0,0)"]
BandNameArray[29] =["J NIR 1.2micron", "J", "rgb(255,0,255)"]
BandNameArray[30] =["K NIR 2.2micron", "K", "rgb(255,128,255)"]
BandNameArray[31] =["Johnson R", "RJ", "rgb(192,0,64)"]
BandNameArray[32] =["Johnson I", "IJ", "rgb(192,64,128)"]
BandNameArray[33] =["Optec Wing A", "MA", "rgb(128,64,255)"]
BandNameArray[34] =["Optec Wing B", "MB", "rgb(128,664,128)"]
BandNameArray[35] =["Optec Wing C", "MI", "rgb(128,0,192)"]
BandNameArray[36] =["Fainter-than", "LT", "black"]
BandNameArray[37] =["PanSTARRS Z-short", "ZS", "rgb(255,64,32)"]
BandNameArray[38] =["PanSTARRS Y", "Y", "rgb(96,0,0)"]
BandNameArray[39] =["Halpha", "HA", "rgb(192,32,0)"]
BandNameArray[40] =["Halpha-continuum", "HAC", "rgb(160,32,32)"]
BandNameArray[41] =["Clear Blue Blocking", "CBB", "rgb(255, 220, 32)"] //---new 2/01/2018---

function allSymbolCheckClicked()
{
    var checkit = allSymbolCheck.checked

    for(j = 0; j<BandSymbolJson.length; j++)
    {
        var band = BandSymbolJson[j].band
        var checkButton = document.getElementById("band"+band+"Check")
        checkButton.checked = checkBand(band, checkit)
    }

    // fall through to faint check
    document.getElementById("bandFaintCheck").checked = checkit
    bandFaintChecked()
}

var SelectedBandContribArray =[]

function setContribNameHighlight(contrib, band, hightlight)
{
    if(hightlight)
        highlightContribName(contrib, band)
    else
        lowlightContribName(contrib, band)
}

function highlightContribName(contrib, band)
{
    /*---highlignt contributor name on selected band check---
        Called from:
          each  band+"band"+Checked @ 19_dataSelect.js
    */
    var contribNameCell = document.getElementById("name"+contrib)
    if(contribNameCell)
    {
        contribNameCell.style.opacity = "1"
        SelectedBandContribArray.push([band, contrib])
    }   
}

function lowlightContribName(contrib, band)
{
    /*---remove highlight contributor name on selected band check---
        Called from:
            each  band+"band"+Checked @ 19_dataSelect.js
    */

//    if(contribSelectDiv.style.display!="none") //--contribs not displayed on 20,000+ data points---
    for(var m = SelectedBandContribArray.length-1; m>=0; m--)
    {
        var selectedBandContrib = SelectedBandContribArray[m]
        var bandContrib = selectedBandContrib[0]
        var byContrib = selectedBandContrib[1]
        if(bandContrib==band && byContrib == contrib)
        {
            SelectedBandContribArray.splice(m, 1)
            var contribNameCell = document.getElementById("name"+byContrib)
            contribNameCell.style.opacity = ".25"
        }
    }
}

function refreshContribName()
{
    /*---symbol:unchecked - return opacity to 1 for all checked bands---
        Called from:
            each  band+"band"+Checked @ 19_dataSelect.js
    */
    for(var m = 0; m<SelectedBandContribArray.length; m++)
    {
        var byContrib = SelectedBandContribArray[m][1]
        if(byContrib!="APASS")
        {
            var contribNameCell = document.getElementById("name"+byContrib)
            contribNameCell.style.opacity = "1"
        }
    }
}

function checkBand(band, checkit)
{
    for(var j=0;j<ContribHighlightArray.length;j++)
    {
        var hiLiteSymbol=ContribHighlightArray[j]
        hiLiteSymbol.setAttribute("display", (checkit) ? "block" : "none")
    }

    if(contribAllCheck.checked)
    {
        SymbolG.selectAll(".Points."+band)
        .classed("selected", checkit)
    }
    else
    {
        for(k = 0; k < ContribChecked.length; k++)
        {
            var contrib = ContribChecked[k]
            SymbolG.selectAll(".Points."+band+"."+contrib)
            .classed("selected", checkit)
        }
    }

    if(! checkit)
    {
        allSymbolCheck.checked = false
        refreshContribName()
    }

    if(MeanActive)
        setMeanBin()

    return checkit
}

function bandChecked(band)
{
    var checkButton = document.getElementById("band"+band+"Check")
    checkBand(band, checkButton.checked)

    displayPoints()

    return checkButton.checked
}

function bandFaintChecked()
{
    /*---checkbox: hide/show these band symbols---
        Called from:
           bandFaintCheck @ index.htm
    */

    var showFaint = document.getElementById("bandFaintCheck").checked

    SymbolG.selectAll(".Points.faint")
    .classed("showFaint", showFaint)

    displayPoints()
}


