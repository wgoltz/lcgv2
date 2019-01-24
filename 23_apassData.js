


function findApassAtStar()
{
    /*---Count the possible Apass points for a star---
        Called from:
           loadStarData @ 01_loadStarData.js
           loadAnotherLightCurve @ 08_plotAnotherCurve.js
           getDiffMagStarData @ 21_diffMagnitude.js    ?????????????????
    */


    ApassBands=""
    DataAPASS=[]
    CountAPASS=[]

    //---apply original requested time span if needed to cover APASS data---
    if(plotAnotherDateSelect.selectedIndex==0) //--julian---
    {
        if(anotherFromDateValue.value !="All")
        {
            RequestFromJD= +anotherFromDateValue.value
            RequestToJD= +anotherToDateValue.value
        }
        else
        {
            RequestFromJD = 0
            RequestToJD = +anotherToDateValue.value
        }
    }
    else if(plotAnotherDateSelect.selectedIndex==1) //---calendar---
    {
        if(anotherFromDateValue.value !="All")
        {
            var fromCal = anotherFromDateValue.value
            var fromDate = new Date(fromCal)
            RequestFromJD = parseFloat((fromDate / 86400000) -(fromDate.getTimezoneOffset()/1440) + 2440587.5).toFixed(0);
        }
        else
            RequestFromJD =0

            var toCal = anotherToDateValue.value
            var toDate = new Date(toCal)
            RequestToJD= parseFloat((toDate / 86400000) -(toDate.getTimezoneOffset()/1440) + 2440587.5 +.1).toFixed(3);
    }

    var urlV="https://physics.mcmaster.ca/astro/APASS/conesearch_filter_lcg.php?radeg="+APASSra+"&decdeg="+APASSdec+"&raddeg=0.001&filter=V"
    var urlB="https://physics.mcmaster.ca/astro/APASS/conesearch_filter_lcg.php?&radeg="+APASSra+"&decdeg="+APASSdec+"&raddeg=0.001&filter=B"
    var urlSU="https://physics.mcmaster.ca/astro/APASS/conesearch_filter_lcg.php?&radeg="+APASSra+"&decdeg="+APASSdec+"&raddeg=0.001&filter=u"
    var urlSG="https://physics.mcmaster.ca/astro/APASS/conesearch_filter_lcg.php?&radeg="+APASSra+"&decdeg="+APASSdec+"&raddeg=0.001&filter=g"
    var urlSR="https://physics.mcmaster.ca/astro/APASS/conesearch_filter_lcg.php?&radeg="+APASSra+"&decdeg="+APASSdec+"&raddeg=0.001&filter=r"
    var urlSI="https://physics.mcmaster.ca/astro/APASS/conesearch_filter_lcg.php?&radeg="+APASSra+"&decdeg="+APASSdec+"&raddeg=0.001&filter=i"
    var urlSZ="https://physics.mcmaster.ca/astro/APASS/conesearch_filter_lcg.php?&radeg="+APASSra+"&decdeg="+APASSdec+"&raddeg=0.001&filter=z"
    var urlZ2="https://physics.mcmaster.ca/astro/APASS/conesearch_filter_lcg.php?&radeg="+APASSra+"&decdeg="+APASSdec+"&raddeg=0.001&filter=Z"
    //--- NOT YET RECOGNIZED AT SERVER---var urlY="https://physics.mcmaster.ca/APASS/conesearch_filter_lcg.php?&radeg="+APASSra+"&decdeg="+APASSdec+"&raddeg=0.001&filter=Y"

    var allApassBands=['V','B','SU','SG','SR','SI','SZ','Z2']

    var bandCnt=0
    function loadApassAPI(bandCnt)
    {
        var band=allApassBands[bandCnt]

        var apiFile=eval("url"+band)

        var httpApass = new XMLHttpRequest();
        httpApass.onload = callbackApass;
        httpApass.open("GET", apiFile, true);
        httpApass.send()
        function callbackApass()
        {
            var rawApass=httpApass.responseText
           
            var csvApass=apassCSV(rawApass)
            countAPASSresponse(csvApass,band)
            processAPASSresponse(csvApass,band)

            if(bandCnt<allApassBands.length-1)
            {
                bandCnt++
                loadApassAPI(bandCnt)
            }
            else
                finishedApassAPI()
        }
    }

    loadApassAPI(0)  //---START----

    function finishedApassAPI()
    {
        apassDataCheck.checked=false
        if(CountAPASS.length>0)
        {
            foundApassDataCntSpan.innerHTML="<b>("+ CountAPASS.length+")</b>"
            apassDataCheck.disabled=false
            buildJsonObj("APASS")
        }
        else
        {
            foundApassDataCntSpan.innerHTML="<b>(0)</b>"
            apassDataCheck.disabled=true
        }
    }

}

var CountAPASS=[]
function countAPASSresponse(respText,band)
{
    /*---Count apass data---
        Called from:
           findApassAtStar @ 23_apassData.js
    */

    //---filter out bands not selected by user---
    if(AllBands==false)
        var filterBands=","+RequestCheckArray.toString() +","
    else
        var filterBands= ","+['V','B','SU','SG','SR','SI','SZ','Z2'].toString() +","
   var szCnt=0
   var z2Cnt=0
    if(filterBands.indexOf(","+band+",")!=-1)
    {
        var jsonData=cvs2JSON(respText)
         if(jsonData.length>0)
            ApassBands+=band+","
        //---count bands---
        for(var k=0;k<jsonData.length;k++)
        {
            var apass=jsonData[k]
            var hjd=+apass.HJD
            var apassJD=apass2JD(hjd,APASSra,APASSdec)
             if(apassJD>=RequestFromJD&&apassJD<=RequestToJD)
            {
    if(band=="SZ")szCnt++
    if(band=="Z2")z2Cnt++

                apass.by='APASS'
                if(band=="Z2")
                    band="SZ"
                apass.band=band
                apass.JD=apassJD
                apass.time=julian2Date(apassJD)
                apass.fainterThan=0
                apass.mtype="STD"
                apass.starName=StarName
                CountAPASS.push(apass)


             }

        }

    }
    console.log([szCnt,z2Cnt])
}

//==============================================================
var APASSloaded=false
var APASSactive=false
var APASSra  //--provided at loadStarData.js & plotAnotherCurve.js---
var APASSdec //--provided at loadStarData.js & plotAnotherCurve.js---
var ApassBands=""


function apassDataCheckClicked()
{
    clearPreviousPlot()
    TotalData=DataAPASS.concat(Data)
    buildJsonObj("APASS")
    setTimeout(buildApassContrib,4000)
    apassContribDiv.style.visibility="visible"
    setTimeout('apassDataCheck.disabled=true',1500)
    apassDataCheck.checked=true
    foundApassDataCntSpan.innerHTML="<b>("+ DataAPASS.length+")</b>"
    var obsLen=TotalData.length-DataAPASS.length
    starDataCntDiv.innerHTML = numberWithCommas(obsLen+"")+" observations of the "+numberWithCommas(DataCount)+" total observations for this star."
    apassCounterFrame.src="apassCounter.htm"

}


var DataAPASS=[]
function processAPASSresponse(respText,band)
{
    /*---process data---
        Called from:
           apassDataCheckClicked @ 23_apassData.js
    */


    var jsonData=cvs2JSON(respText)
    if(jsonData.length>0)
    {

        ApassBands+=band+","
    }

    //---compute JD vs PlotJDStart/PlotJDEnd---
    for(var k=0;k<jsonData.length;k++)
    {
        var apass=jsonData[k]
        var hjd=+apass.HJD
        var apassJD=apass2JD(hjd,APASSra,APASSdec)

        if(apassJD>=RequestFromJD&&apassJD<=RequestToJD)
        {
            apass.by='APASS'
            if(band=="Z2")
                band="SZ"
            apass.band=band
            apass.JD=apassJD
            apass.time=julian2Date(apassJD)
            apass.fainterThan=0
            apass.mtype="STD"
            apass.starName=StarName
            DataAPASS.push(apass)
         }
    }

}
function buildApassContrib()
{
    /*---Apass listed as a contributor---
        Called from:
           
           apassDataCheckClicked @ 23_apassData.js
    */

    //---remove dups---
    var bands=ApassBands.split(",")
    var bnds=","
    for(var k=0;k<bands.length;k++)
    {
         var band=","+bands[k]+","
        if(bnds.indexOf(band)==-1)
         bnds+=bands[k]+","

    }
         bnds = bnds.replace(/^,|,$/g,'');
         bnds = bnds.replace(/^,|,$/g,'');

    apassBandSpan.innerHTML=bnds
    apassContribDiv.style.visibility="visible"
    apassTotalSpan.innerHTML=DataAPASS.length
    contribCheckAPASS.checked=true
}

function apass2JD(HJD,raDeg,decDeg)
{
    /*---convert heliocentric to JD ---
        Called from:
           countAPASSresponse @ 23_apassData.js
           processAPASSresponse  @ 23_apassData.js
    */
    function degrad(deg)
    {
        return deg/360*2*Math.PI
    }
    //HJD = the heliocentric JD from APASS
    var T = (HJD - 2451545.0) / 36525.0
    var L = 280.4659 + (35999.371964 * T)
    var M = L - 282.9405 - (0.322204 * T)
    var LAM = L + (1.9148 * Math.sin(degrad(M))) + (0.02 * Math.sin(degrad(2*M)))
    var NU = LAM - L + M
    var R = 0.99972 / (1 + 0.01671 * Math.cos(degrad(NU)))
    var LL = Math.cos(degrad(decDeg)) * Math.cos(degrad(raDeg))
    var MM = 0.91748 * Math.cos(degrad(decDeg)) * Math.sin(degrad(raDeg)) + 0.39778 * Math.sin(degrad(decDeg))
    var LTC = 0.005775 * R * (LL * Math.cos(degrad(LAM)) + MM * Math.sin(degrad(LAM)))
    var JD = HJD + LTC
    return JD
}

function apassCSV(rawText)
{
    /*---cleans CSV from tombstone---
        Called from:
           findApassAtStar @ 23_apassData.js
           apassDataCheckClicked @ 23_apassData.js
    */
    var csv=rawText.replace(/, /g,",") //---bogus space artifacts---
    csv = csv.replace(/\n$/, "") //---remove last newline---
    return csv
 }