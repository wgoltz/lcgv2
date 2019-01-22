/* dataPacket
Name
JD
Fainterthan Magnitude (Uncertainty)
Band
Obstype ******not yet in csv file----
Comp Star 1
CMag
Comp Star 2
KMag
Airmass
Charts
Software
Transformed (when this field is zero, just leave it out)
Comments
Digitizer
ADS Reference
Observer Code
Affiliation
Credit
*/
//---on click on symbol---
var DataPacketVis = false //---controls symbol point data display; see: pointDataDisplay.js---
var DataPacketPoint
function dataPacketSelected(evt)
{
    /*---Click on symbol---
        Event set on each symbol polygon via:
           addSymbolPolygons @ 17_symbols.js
    */
   var target=evt.target
   var tf=target.parentNode.getAttribute("transform")
   dataPacketRect.setAttribute("transform",tf) //---scale 10)
   dataPacketRect.style.display="block"
    if(BoxOn == false)
    {
        discrepancyCommentValue.value = ""
        discrepancyMemberId.value = ""

       console.log("dataPacketSelected UserID="+UserID)
        if(UserID!="null"&&UserID!="undefined"&&UserID) //---CookieUserID or member logged in at AAVSO site---
        {


            sendZapperButton.disabled=false
            discrepancyMemberId.value=UserID
            discrepancyCommentValue.disabled=false
            loggedInSpan.style.visibility="hidden"
        }
        else
        {
             console.log("Zapper Disabled - override")
            sendZapperButton.disabled=false
            discrepancyMemberId.value=""
            discrepancyCommentValue.disabled=false
            loggedInSpan.style.visibility="hidden"

            /*
            sendZapperButton.disabled=true
            discrepancyMemberId.value=""
            discrepancyCommentValue.disabled=true
            loggedInSpan.style.visibility="visible"
            */
        }

        var symbol = evt.target.parentNode

        DataPacketPoint = symbol
        var dataLoc = parseInt(symbol.getAttribute("dataLoc"), 10)

        var myData = Data[dataLoc]

        var starName = myData.starName

        var jd = myData.JD
        var band = myData.band
        var mag = myData.mag
        var uncert = myData.uncert
        var obsCode = myData.by
        if(obsCode!="APASS")
        {

            var fainterThan = myData.fainterThan
            var obsID = myData.obsID
            var obsType = myData.obsType
            var compStar1 = myData.compStar1
            var compStar2 = myData.compStar2
            var cmag = myData.cmag
            var kmag = myData.kmag
            var airmass = myData.airmass
            var charts = myData.charts
            var software = myData.software
            var transformed = myData.transformed
            var comment = myData.comment
             if(comment.indexOf("\"")!=-1)
                comment.replace(/\"/g, "\"")
            var digitizer = myData.digitizer
            var adsRef = myData.adsRef
            var obsAffil = myData.obsAffil
            var credit = myData.credit
            var mtype = myData.mtype
            var commCode = myData.comCode


            if(fainterThan=="1")
            {

                mag = "< "+mag

            }

            dataIdDiv.innerHTML = obsID
            dataObstypeDiv.innerHTML = obsType
            dataCompStar1Div.innerHTML = compStar1
            dataCompStar2Div.innerHTML = compStar2
            dataCMagDiv.innerHTML = cmag
            dataKMagDiv.innerHTML = kmag
            dataAirmassDiv.innerHTML = airmass
            dataChartsDiv.innerHTML = charts
            dataSoftwareDiv.innerHTML = software
            dataTransformedDiv.innerHTML = transformed
            dataCommentsDiv.innerHTML = comment
            dataDigitizerDiv.innerHTML = digitizer
            dataADSDiv.innerHTML = adsRef

            dataAffiliationDiv.innerHTML = obsAffil
            dataCreditDiv.innerHTML = credit
            dataMtypeDiv.innerHTML = mtype
            dataComCodeDiv.innerHTML = commCode
        }
        else
        {
            dataIdDiv.innerHTML = "APASS"
            sendZapperButton.disabled = true

            dataObstypeDiv.innerHTML = "N.A."
            dataCompStar1Div.innerHTML = "N.A."
            dataCompStar2Div.innerHTML = "N.A."
            dataCMagDiv.innerHTML = "N.A."
            dataKMagDiv.innerHTML = "N.A."
            dataAirmassDiv.innerHTML = "N.A."
            dataChartsDiv.innerHTML = "N.A."
            dataSoftwareDiv.innerHTML = "N.A."
            dataTransformedDiv.innerHTML = "N.A."
            dataCommentsDiv.innerHTML = "N.A."
            dataDigitizerDiv.innerHTML = "N.A."
            dataADSDiv.innerHTML = "N.A."

            dataAffiliationDiv.innerHTML = "N.A."
            dataCreditDiv.innerHTML = "N.A."
            dataMtypeDiv.innerHTML = "N.A."
            dataComCodeDiv.innerHTML = "N.A."
        }

        dataObserverCodeDiv.innerHTML = obsCode
        dataNameDiv.innerHTML = starName
        dataJDDiv.innerHTML = jd
        dataUTCDiv.innerHTML = julian2Date(jd)
        dataMagDiv.innerHTML = mag
        dataUncertDiv.innerHTML = uncert
        dataBandDiv.innerHTML = band

        symbolDataPacketDiv.style.height = "1px"
        openDiv("symbolDataPacketDiv")
        DataPacketVis = true
        pointDataDiv.style.backgroundColor = "white"


        return false
    }

}

