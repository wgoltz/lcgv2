/*
This builds a JSON object from the data for the requested star's observations.
The JSON object is then used to build the associated Plot
*/

/*  ---delimited header----
JD
mag
uncert
band
by
comCode
compStar1
compStar2
charts
comment
transformed
airmass
val
cmag
kmag
starName
obsAffil
mtype
adsRef
digitizer
credit
obsID
fainterThan
obsType
software
obsName
obsCountry
*/
var ObjJSON =[]
var BandStng = "" //---build band data select---
var BandSymbolJson =[] //---data select---
var FaintCnt = 0 //---data select---
var ContribArray =[]
var Contribs=""
var LoadError=false
function buildJsonObj(init)
{
    /*---Creates a JSON object including all observations---
        Called from:
           loadStarData @ 01_loadStarData.js
           loadAnotherLightCurve @ 08_plotAnotherCurve.js
    */

    FaintCnt = 0
    BandSymbolJson =[]
//    ErrorBarData =[]
    ContribArray =[]
    Contribs = ","
    ObjJSON =[]
    BandStng = ","
      //---if not current bands force it to unknown band---rev. 2/01/2018---
    var knownBandArray=["Vis","B","V","R","I","U","J","H","K","CV","CR","TB","TG","TR","SU","SG","SR",
     "SI","SZ","RJ","IJ","STU","STV","STB","STY","STHBW","STHBN","MA","MB","MI","NA","Blue","Green","Yellow","Orange",
     "Red","ZS","Y","HA","HAC","CBB"]
     var knownBandsString=","+knownBandArray.toString()+","


    PlotData = TotalData.slice(0)
    //---standard/differential magnitude---
    var diff = mtypeSelect.selectedIndex //--- 0=standard/default 1=DIFF  ---

    var plotObsCode=plotObsCodeValue.value  //---show only this observer's obs ---rev 2/25/2018
    var PlotObsCodes=[]
    if(plotObsCode!="")
    {
        var codes=plotObsCode.split(",")
        for(k=0;k<codes.length;k++)
        {
            code=codes[k].replace(/ /,"")
            code=code.toUpperCase()  //===12/18/2008 lower case accepted==
            PlotObsCodes.push(code)
        }
        sortContribSelect.style.visibility="hidden"
        plotObsCodeTD.style.visibility="hidden"
    }
    else
    {
        plotObsCodeTD.style.visibility="visible"
        sortContribSelect.style.visibility="visible"
    }


    if(PlotData.length<=1)
    {
        return false
    }
// LoadError set by loadStarData if it fails
    if(init!=true && init!="APASS" && ! LoadError)
        clearPreviousPlot()

    LoadError = false

    //---counters---
    var bandCnt = 0
    var jsonCnt = 0
    var diffMagCnt = 0
    var uncert0 = 0
    var uncert005 = 0
    var uncertpnt1 = 0
    var uncertpnt5 = 0
    var uncert1 = 0

    for(var k = 0; k<PlotData.length; k++)
    {
        var ob = PlotData[k]

        //---rev 2/25/18 ---
        var obsCode=true
        if(PlotObsCodes.length>0)
        {
            var obscodez=","+PlotObsCodes.toString()+","
            if(obscodez.indexOf(ob.by)==-1)
                obsCode=false
        }

        if(obsCode)
        {

            var mtype = ob.mtype
            if(mtype=="DIFF")
                diffMagCnt++

            if(((mtype=="DIFF" && diff==1)||(mtype=="STD" && diff==0)||(mtype=="" && diff==0)))
                if(ob.JD!=""&&ob.val!="T")   //---T is discrepent---
                {
                    var band = ob.band
                    var re = /\./   //--(Vis.)---
                    band = ob.band.replace(re, "")

                    if(ob.band=="N/A") //---remove slash---
                    {
                        band = "NA"
                    }
                    //---if not current bands, force it to unknown band---rev. 2/01/2018
                    if(knownBandsString.indexOf(","+band+",")==-1)
                        band="NA"

                    var fainterThan = ob.fainterThan //--- 0,1---

                    var starName = ob.starName
                    var by = ob.by
                    var jd = +ob.JD   //---string to real number---
                    var mag = +ob.mag //---string to real number---
                    var uncert = +ob.uncert //---string to real number---


                    if(by!="APASS")  //---not APASS and other data sets---
                    {
                        var val = ob.val
                        var obsCntry = ob.obsCountry
                        var obsName = ob.obsName
                        var comment = ob.comment

                        comment=comment.replace(/\|/g," ")
                        var comCode = ob.comCode
                        var compStar1 = ob.compStar1
                        var compStar2 = ob.compStar2
                        var charts = ob.charts
                        var transformed = ob.transformed
                        var airmass = ob.airmass
                        var cmag = +ob.cmag
                        var kmag = +ob.kmag
                        var obsAffil = ob.obsAffil
                        var adsRef = ob.adsRef
                        var digitizer = ob.digitizer
                        var obsType = ob.obsType
                        var software = ob.software
                        var credit = ob.credit
                        var obsID = +ob.obsID
                    }
                    else //----when adding other data sets: Apass, etc.----
                    {
                        var val = ""
                        var obsCntry = ""
                        var obsName = ""
                        var comment = ""
                        var comCode = ""
                        var compStar1 = ""
                        var compStar2 = ""
                        var charts = ""
                        var transformed = ""
                        var airmass = ""
                        var cmag = ""
                        var kmag = ""
                        var obsAffil = ""
                        var adsRef = ""
                        var digitizer = ""
                        var obsType = ""
                        var software = ""
                        var credit = ""
                        var obsID = ""
                        ob.val=""
                        ob.obsCountry=""
                        ob.obsName=""
                        ob.comment=""
                        ob.comCode=""
                        ob.compStar1=""
                        ob.compStar2=""
                        ob.charts=""
                        ob.transformed=""
                        ob.airmass=""
                        ob.cmag=""
                        ob.kmag=""
                        ob.obsAffil=""
                        ob.adsRef=""
                        ob.digitizer=""
                        ob.obsType=""
                        ob.software=""
                        ob.credit=""
                        obsID=""
                    }

                    if(uncert>0)
                        uncert0++
                    if(uncert>.005)
                        uncert005++
                    if(uncert>.1)
                        uncertpnt1++
                    if(uncert>.5)
                        uncertpnt5++
                    if(uncert>1)
                        uncert1++

                    if(fainterThan!='0')
                    {
                        FaintCnt++
                    }
                    if(by!="APASS")//---or other databases---
                    {
                        ContribArray.push([by, obsName, obsCntry, obsAffil, "@"+band+"@"])

                        if(by!="" && by!=" "&& Contribs.toString().indexOf(by)==-1)
                        {
                            Contribs +=by+","
                        }
                    }


                    if(BandStng.indexOf(","+band+",")==-1)
                    {
                        BandStng += ","+band+","
                        BandSymbolJson[bandCnt++] = { band: band, cnt: 1 }
                    }
                    else
                    {
                        for(var j = 0; j<BandSymbolJson.length; j++)
                        {
                            var jsonBand = BandSymbolJson[j].band
                            if(jsonBand==band)
                            {
                                BandSymbolJson[j].cnt = BandSymbolJson[j].cnt+1
                                break
                            }
                        }
                    }

                    ObjJSON.push( { index: jsonCnt, fainterThan: fainterThan, band: band, by: by, obsName: obsName, obsCountry: obsCntry, calDate: julian2Date(jd), JD: jd, time: julian2Date(jd), mag: mag, val: val, comment: comment, uncert: uncert, comCode: comCode, compStar1: compStar1, compStar2: compStar2, charts: charts, transformed: transformed, airmass: airmass, cmag: cmag, kmag: kmag, starName: starName, obsAffil: obsAffil, adsRef: adsRef, digitizer: digitizer, obsType: obsType, software: software, credit: credit, mtype: mtype, obsID: obsID })
//                    if(uncert>0)
//                    {
//                        ErrorBarData.push( { index: jsonCnt, JD: jd, mag: mag, uncert: uncert })
//                    }
                    jsonCnt++
                }
        }
    }


    if(jsonCnt<=1)
    {
        return false
    }


/*
//----test axis timelines----
 var copyJSON=[]
for(var k=0;k<ObjJSON.length;k++)
{
      var obj=ObjJSON[k]
         var JD = +obj.JD   //---string to real number---
        var mag = +obj.mag
        var time=julian2Date(JD)

   var add={mag:mag,JD:JD,time:time}
    copyJSON.push(add)
}
console.log(JSON.stringify(copyJSON))
*/

    findJDstartEnd(ObjJSON,DataCount)

    if(init==true)
        initPlot()
//    else if(init==false||init=="APASS")
    else if(init==false)
    {
        if(MainRequest==false)
            PlotG.selectAll("*").remove()

        buildPlot()
        initGrid()
    }
    else if(init=="APASS")
        return false

    if(Mobile==false)
    {
        setTimeout(buildDataSelect, 1000)

//        if(TotalData.length<20000)
//        {
            data20000Div.style.visibility='hidden'
            contribSelectDiv.style.display=""
            prefButton.style.visibility=""
            boxButton.style.visibility=""
            boxResetButton.style.visibility=""
            boxHelpButton.style.visibility=""
            meanCurveButton.style.visibility=""
            printButton.style.visibility=""

            buildMeanSelect()
            setTimeout(buildContribSelect, 2000)


//        }
//        else
//        {
//            contribSelectDiv.style.display="none"
//            prefButton.style.visibility="hidden"
//            boxButton.style.visibility="hidden"
//            boxResetButton.style.visibility="hidden"
//            boxHelpButton.style.visibility="hidden"
//            meanCurveButton.style.visibility="hidden"
//            printButton.style.visibility="hidden"
//            data20000Div.style.visibility='visible'

//        }


    }
    else
        setTimeout(buildMobileDataSelect, 1000)

    closeDiv("plotAnotherCurveDiv")
    sendAnotherMsgDiv.innerHTML = ""
    //apassDataCheck.disabled=true
    errorBarSelect.options[1].text = "> 0.00 ("+uncert0+")"
    errorBarSelect.options[2].text = "> 0.05 ("+uncert005+")"
    errorBarSelect.options[3].text = "> 0.10 ("+uncertpnt1+")"
    errorBarSelect.options[4].text = "> 0.50 ("+uncertpnt5+")"
    errorBarSelect.options[5].text = "> 1.00 ("+uncert1+")"

    return true
}

var PlotJDStart
var PlotJDEnd

function findJDstartEnd(ObjJSON,DataCount)
{
    /*---Determines the start/end Julian Date for the plot---
    (---must use this because APASS skews this value---)
        Called from:
            buildJsonObj @ 02_buildData.js
    */

    function getMaxJD(ObjJSON) {
        var maxJD;
        for (var i=0 ; i<ObjJSON.length ; i++) {
            if (!maxJD || ObjJSON[i].JD > maxJD)
            {
                maxJD= ObjJSON[i].JD;
             }
        }
        return maxJD
    }
    function getMinJD(ObjJSON) {
        var minJD;
        for (var i=0 ; i<ObjJSON.length ; i++) {
            if (!minJD || ObjJSON[i].JD < minJD)
            {
                minJD= ObjJSON[i].JD;
             }
        }
        return minJD
    }

    PlotJDStart = getMinJD(ObjJSON)
    PlotJDEnd = getMaxJD(ObjJSON)

     if(RequestFromJD) //---init =false---
     {
        var startDate = julian2Date(RequestFromJD).split(" ")[0]
        var endDate = julian2Date(RequestToJD).split(" ")[0]
     }
     else
     {
        var startDate = julian2Date(PlotJDStart).split(" ")[0]
        var endDate = julian2Date(PlotJDEnd).split(" ")[0]
     }
   
        if(!StarName)
        var starName = anotherStarNameValue.value
        else
        starName=StarName
       if(plotAllDaysCheck.checked==false)
            plotTitleDiv.innerHTML ="<b>"+starName+"</b>&nbsp;&nbsp;<span style='font-size:80%'>"+startDate+" <i>to</i> "+endDate+"</span>"
        else
            plotTitleDiv.innerHTML ="<b>"+starName+"</b> (All Observations)"

 var dataCnt=ObjJSON.length
 starDataCntDiv.innerHTML = numberWithCommas(dataCnt+"")+" observations of the "+numberWithCommas(DataCount)+" total observations for this star."

}

