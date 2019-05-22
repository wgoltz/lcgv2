    //https://www.aavso.org/vsx/index.php?view=api.object&ident=sscyg&adopt&att&data=0
    /*
 //---one adopter---
 <VSXObject Name="SS Cyg" AUID="000-BCP-220" RA2000="325.67829" Declination2000="43.58608" VariabilityType="UGSS" Period="0.2751300" MaxMag="7.7 V" MinMag="12.4 V" SpectralType="K5V+pec(UG)" Discoverer="Louisa D. Wells, 1896" Category="Variable">
 <AdoptedBy>
 <Adopter Name="John A. Blackwell" FamilyName="Blackwell" GivenName="John" ObsCode="BKL"/>
 </AdoptedBy>
 <Data Count="564205"/>
 </VSXObject>
 //---more than 1
 <VSXObject Name="V5668 Sgr" AUID="000-BLP-536" RA2000="279.23683" Declination2000="-28.92772" VariabilityType="NA" Epoch="24057103" MaxMag="4.3 V" MinMag="16.2 V" Discoverer="John Seach" Category="Variable">
 <AdoptedBy>
 <Adopter Name="craig" FamilyName="Darroch" GivenName="Craig" ObsCode="DCLA"/>
 <Adopter Name="Barbara G. Harris" FamilyName="Harris" GivenName="Barbara" ObsCode="HBB"/>
 <Adopter Name="Twinklespinalot" FamilyName="Clark" GivenName="Wendy" ObsCode="CWJA"/>
 </AdoptedBy>
 <Data Count="4003"/>
 </VSXObject>
 //---none--
 <VSXObject Name="T CrB" AUID="000-BBW-825" RA2000="239.87567" Declination2000="25.92017" VariabilityType="NR+ELL" Period="227.6" Epoch="24047919" MaxMag="2.0 V" MinMag="10.8 V" SpectralType="M3III+pec(NOVA)" Discoverer="J. Birmingham" Category="Variable">
 <AdoptedBy/>
 <Data Count="123299"/>
 </VSXObject>

 */



var VSXObj
var AUID
var StarName
var AdoptedBy
var TotalData
var DataCount //---all observations for this star--
function getVSXXObj(vsxText)
{
   /*---Reads XML; sets AdoptedBy values and provides Apass data ra/dec, and DataCount---
        Called from:
           loadStarData @ 01_loadStarData.js
           loadAnotherLightCurve @ 08_plotAnotherCurve.js
           getDiffMagStarData @ 21_diffMagnitude.js
           getSampleStarData @ 24_loadSampleStarData.js
  */
    var parser = new DOMParser();
    VSXObj = parser.parseFromString(vsxText, "text/xml")
    VSXObjDoc = VSXObj.documentElement;
    APASSra = parseFloat(VSXObjDoc.getAttribute("RA2000"))
    APASSdec = parseFloat(VSXObjDoc.getAttribute("Declination2000"))

    AdoptedBy = VSXObjDoc.firstChild
    var adopterNames = ""
    var br = "<br>"
   //---<Adopter Name="John A. Blackwell" FamilyName="Blackwell" GivenName="John" ObsCode="BKL"/>
    /*test
      var adoptNode= VSXObj.createElement("Adopter");
    adoptNode.setAttribute("Name","Francis J. Hemsher")
  AdoptedBy.appendChild(adoptNode)
    var adoptNode= VSXObj.createElement("Adopter");
    adoptNode.setAttribute("Name","Paige A. Gragan")
  AdoptedBy.appendChild(adoptNode)
    var adoptNode= VSXObj.createElement("Adopter");
    adoptNode.setAttribute("Name","Dana P. Peelor")
  AdoptedBy.appendChild(adoptNode)
  */


    if(AdoptedBy.childNodes.length>0)
    {
        for(var k = 0; k<AdoptedBy.childNodes.length; k++)
        {
            if(k==0)
            {
                if(!AdoptedBy.childNodes[k].getAttribute("Name")||AdoptedBy.childNodes[k].getAttribute("Name")=="")
                adopterNames= AdoptedBy.childNodes[k].getAttribute("GivenName")+" "+ AdoptedBy.childNodes[k].getAttribute("FamilyName")
                else
                  adopterNames=AdoptedBy.childNodes[k].getAttribute("Name")
             }
            if(k>0)
            {
                 if(!AdoptedBy.childNodes[k].getAttribute("Name")||AdoptedBy.childNodes[k].getAttribute("Name")=="")
                    adopterNames= adopterNames+" &amp; "+ AdoptedBy.childNodes[k].getAttribute("GivenName")+" "+ AdoptedBy.childNodes[k].getAttribute("FamilyName")
                else
                  adopterNames=adopterNames+" &amp; "+AdoptedBy.childNodes[k].getAttribute("Name")
            }
        }
        if(AdoptedBy.childNodes.length>2)
            br = ""
    }
    DataCount = VSXObjDoc.lastChild.getAttribute("Count")
    AUID = VSXObjDoc.getAttribute("AUID")
    if(adopterNames!="")
        adopterDiv.innerHTML = "Adopter:"+br+adopterNames
        else
            adopterDiv.innerHTML = "<span style=color:red>&hearts;</span><a href=javascript:void(window.open('https://www.aavso.org/annual-adopt-variable-star-program','_blank')) style=color:gold>Adopt This Star</a>"
}

function delimToArray(strData, strDelimiter)
{
    /*--builds array for JSON---
       Called from:
        delim2JSON @ 08_plotAnotherCurve.js
    */



// Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi"
    );
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData =[[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData))
    {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter))
        {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2])
        {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"), "\"");
        }
        else
        {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}
function delim2JSON(delimText, delim)
{
   /*---Build JSON object from delimited text ---
        Called from:
            loadStarData @ 01_loadStarData.js
            loadAnotherLightCurve @ 08_plotAnotherCurve.js
            getDiffMagStarData @ 21_diffMagnitude.js
   */
    var array = delimToArray(delimText, delim);
    var objArray =[];
    for (var i = 1; i < array.length; i++)
    {
        objArray[i - 1] =
        {
        };

        for (var k = 0; k < array[0].length && k < array[i].length; k++)
        {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }
    return objArray;
}
function cvsToArray(strData, strDelimiter)
{
    /* ---creates an array from CSV data to JSON ---
        Called from:
           cvs2JSON @ 08_plotAnotherCurve.js
    */

    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi"
    );
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData =[[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData))
    {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter))
        {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2])
        {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"), "\"");
        }
        else
        {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}
function cvs2JSON(csvText)
{
    /*---uses CSV data for JSON---
        Called from:
           countAPASSresponse @ 23_apassData.js
           processAPASSresponse @ 23_apassData.js
           getSampleStarData @ 24_loadSampleStarData.js
    */

    var array = cvsToArray(csvText);
    var objArray =[];
    for (var i = 1; i < array.length; i++)
    {
        objArray[i - 1] =
        {
        };

        for (var k = 0; k < array[0].length && k < array[i].length; k++)
        {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }
    return objArray;
}

function userTimeout() //---200 seconds---
{    //---not used---
    loadingStarH.innerHTML = "Sorry, our server is experiencing high volumes...<br>Please be patient for a few moments. Thanks"
    setTimeout(userExit, 200000)
}
function userExit()
{    //---not used---
    loadingStarH.innerHTML = "<span style='color:red'>We apologize. Our server is currently unavailable...<br>Please try again later. Thank You</span>"
}

//---on open div---
var MostRecentJD
var ShowMostRecentOb = true
var MostRecentOb

var AnotherCurveBeginInit = false
//--allows user to change same date---
var InitJDto
var InitJDfrom

function setPlotAnotherCurveTodayDate()
{
    /*---init date, on div open = current minus 730 days ---
        Called from:
           openDiv @ 00_util.js
    */

    if(AnotherCurveBeginInit==false)
    {
        var lastYearMS = 730 * 24 * 60 * 60 * 1000
        var dateMS = new Date().getTime()

        var lastYrDate = new Date(dateMS-lastYearMS)
        var lastYrJD = (lastYrDate / 86400000) -(lastYrDate.getTimezoneOffset()/1440) + 2440587.5;
        anotherFromDateValue.value = lastYrJD.toFixed(0)
        InitJDfrom  = lastYrJD.toFixed(0)

        var j = new JulianDate();
        var nowJD = j.julian()
        MostRecentJD = nowJD.toFixed(3)
        anotherToDateValue.value = MostRecentJD
         InitJDto = MostRecentJD
         hiddenFromJD.value=InitJDfrom
         hiddenToJD.value=InitJDto
        AnotherCurveBeginInit = true
    }
  PrevAllToDate=anotherToDateValue.value
PrevAllFromDate=anotherFromDateValue.value

}
//--following initial---
function plotAnotherDateSelected()
{
    /*---on change @ plotAnotherDateSelect ---
        Called from:
          plotAnotherDateSelect  @ index.htm
    */
    anotherFromDateValue.style.background=""
    anotherToDateValue.style.background=""
    sendAnotherMsgDiv.innerHTML=""
    plotLastDaysCheck.checked=false
    if(plotAnotherDateSelect.selectedIndex==0)
    {
       if(hiddenFromJD.value==InitJDfrom&&hiddenToJD.value==InitJDto)
       {
            var lastYearMS = 730 * 24 * 60 * 60 * 1000
            var dateMS = new Date().getTime()

            var lastYrDate = new Date(dateMS-lastYearMS)
            var lastYrJD = (lastYrDate / 86400000) -(lastYrDate.getTimezoneOffset()/1440) + 2440587.5;
            var j = new JulianDate();
            var nowJD = j.julian()
            MostRecentJD = nowJD.toFixed(3)
            anotherFromDateValue.value=lastYrJD.toFixed(0)
            anotherToDateValue.value = MostRecentJD
        }
        else
        {
            anotherFromDateValue.value=hiddenFromJD.value
            anotherToDateValue.value = hiddenToJD.value
        }

    }
    else  //---Calendar Date---
    {
       if(hiddenFromJD.value==InitJDfrom&&hiddenToJD.value==InitJDto)
       {

            var dateMS = new Date().getTime()

            var lastYearMS = 730 * 24 * 60 * 60 * 1000
            var today = new Date(dateMS)
            var formatDate = d3.time.format.utc("%Y/%m/%d %H:%M:%S")
            var lastYrDate = new Date(dateMS-lastYearMS)
            //--- minus720 days---
            anotherFromDateValue.value = formatDate(lastYrDate)
            //---now---
            var now = new Date()
            anotherToDateValue.value = formatDate(now)
            var j = new JulianDate();
            var nowJD = j.julian()
            MostRecentJD = nowJD.toFixed(3)
        }
        else
        {
            anotherFromDateValue.value=julian2Date(+hiddenFromJD.value)
            anotherToDateValue.value = julian2Date(+hiddenToJD.value)

        }

    }
 PrevAllToDate=anotherToDateValue.value
PrevAllFromDate=anotherFromDateValue.value
plotAllDaysCheck.checked=false;
}
function plotLastDaysChecked()
{
    plotAllDaysCheck.checked=false;
    anotherToDateValue.value=PrevAllToDate
    anotherFromDateValue.value=PrevAllFromDate
    anotherToDateValue.style.background="linen"
    anotherFromDateValue.style.background="linen"
    if(plotLastDaysCheck.checked&&plotLastDaysValue.value!="")
    {
      if(+plotLastDaysValue.value>0)
      {
          anotherToDateValue.style.background="lime"
          anotherFromDateValue.style.background="lime"
            var lastDays=+plotLastDaysValue.value
                if(plotAnotherDateSelect.selectedIndex==0) //--julian---
                {
                        var lastDaysMS = lastDays * 24 * 60 * 60 * 1000
                        var dateMS = new Date().getTime()

                        var lastDaysDate = new Date(dateMS-lastDaysMS)
                        var lastDaysJD = (lastDaysDate / 86400000) -(lastDaysDate.getTimezoneOffset()/1440) + 2440587.5;

                        var j = new JulianDate();
                        var nowJD = j.julian()
                        MostRecentJD = nowJD.toFixed(3)
                        anotherFromDateValue.value=lastDaysJD.toFixed(0)
                        anotherToDateValue.value = MostRecentJD

                }
                else  //---Calendar Date---
                {
                        var dateMS = new Date().getTime()

                        var lastDaysMS = lastDays * 24 * 60 * 60 * 1000
                        var today = new Date(dateMS)
                        var formatDate = d3.time.format.utc("%Y/%m/%d %H:%M:%S")
                        var lastDaysDate = new Date(dateMS-lastDaysMS)
                        //--- minus days---
                        anotherFromDateValue.value = formatDate(lastDaysDate)
                        //---now---
                        var now = new Date()
                        anotherToDateValue.value = formatDate(now)

                }
                PrevAllToDate=anotherToDateValue.value
                PrevAllFromDate=anotherFromDateValue.value


      }
    }
    if(!plotLastDaysCheck.checked)
    {
        anotherToDateValue.style.background="linen"
        anotherFromDateValue.style.background="linen"
    }
}
var PrevAllToDate
var PrevAllFromDate
function plotAllDaysChecked()
{
   if(plotAllDaysCheck.checked)
   {
       if(plotAnotherDateSelect.selectedIndex==0)
        anotherToDateValue.value=MostRecentJD
        else
        anotherToDateValue.value=PrevAllToDate
        anotherFromDateValue.value="All"
        anotherToDateValue.style.background="tan"
        anotherFromDateValue.style.background="tan"
        plotLastDaysCheck.checked=false;
    }
    else
    {
        anotherToDateValue.value=PrevAllToDate
        anotherFromDateValue.value=PrevAllFromDate
        anotherToDateValue.style.background="linen"
        anotherFromDateValue.style.background="linen"
    }
}
function plotDaysKeyup()
{
    //---onkeyup event at plotLastDaysValue---
      plotLastDaysCheck.checked=false;
      anotherFromDateValue.style.background='linen';
      anotherToDateValue.style.background='linen';
}
function sendAnotherPlotLoading()
{

    /*---Send button clicked---
        Called from:
            sendAnotherPlotButton @ index.htm
    */
    if(EmptyRequest==false)
        resetMean()

    sendAnotherMsgDiv.innerHTML = "<center>loading...</center>"

    spinner.style.webkitAnimationPlayState = 'running';
    spinner.style.AnimationPlayState = 'running';
    spinner.style.visibility = "visible"
    setTimeout(sendAnotherPlot, 200)
    cancelDownloadButton.disabled = false

}

function sendAnotherPlot()
{
    /*---time delayed---
        Called from:
            sendAnotherPlotLoading @ 08_plotAnotherCurve.js
    */
    //---error resets---
    var now = new Date()
    var inputError=false
    var errorMsg=""

    anotherFromDateValue.style.background=""
    anotherToDateValue.style.background=""
  if(!plotAllDaysCheck.checked)
  {
    if(plotAnotherDateSelect.selectedIndex==0)
    {
        var fromJD = parseFloat(anotherFromDateValue.value)
        var toJD = parseFloat(anotherToDateValue.value)
         var j = new JulianDate();
        var nowJD = j.julian()
        if(isNaN(fromJD)||isNaN(toJD))
           inputError=true
        if(fromJD<0||toJD<=0)
           inputError=true
       if(fromJD>toJD)
          inputError=true
       if(inputError==true)
           errorMsg="<center>Julian Date Error</center>"
    }
    else //---calendar date---
    {

     //---**error checking**---

        var formatDate = d3.time.format.utc("%Y/%m/%d %H:%M:%S")
        nowCal = formatDate(now)
        splitNow=nowCal.split("/")
        var nowYear=+splitNow[0]

        var splitFromCal=anotherFromDateValue.value.split(" ")[0].split("/")

        var fromYear=+splitFromCal[0]
        var fromMonth=+splitFromCal[1]
        var fromDay=+splitFromCal[2]
        var splitToCal=anotherToDateValue.value.split(" ")[0].split("/")

        var toYear=+splitToCal[0]
        var toMonth=+splitToCal[1]
        var toDay=+splitToCal[2]
         if(fromYear>nowYear || toYear>nowYear)
            inputError=true

         if(fromYear<=1800 || toYear<=1800)
            inputError=true

         if(isNaN(fromYear)||isNaN(fromMonth)||isNaN(fromDay)||isNaN(toYear)||isNaN(toMonth)||isNaN(toMonth))
            inputError=true

         if(fromMonth>12||toMonth>12||fromDay>31||toDay>31||fromMonth<=0||toMonth<=0||fromDay<=0||toDay<=0)
            inputError=true

        if(inputError==true)
        {
            errorMsg="<center>Calendar Date Error</center>"
        }
        else
         {
            var fromCal = anotherFromDateValue.value
            var toCal = anotherToDateValue.value
            var fromDate = new Date(fromCal)
            var fromJD = parseFloat((fromDate / 86400000) -(fromDate.getTimezoneOffset()/1440) + 2440587.5).toFixed(0);
            var toDate = new Date(toCal)
            var toJD = parseFloat((toDate / 86400000) -(toDate.getTimezoneOffset()/1440) + 2440587.5 +.1).toFixed(3);


         }
    }
  }


    if(inputError==true)
    {
        sendAnotherMsgDiv.innerHTML=errorMsg
        anotherFromDateValue.style.background="red"
        anotherToDateValue.style.background="red"
        spinner.style.webkitAnimationPlayState = 'paused';
        spinner.style.AnimationPlayState = 'paused';
        spinner.style.visibility = "hidden"
    }
    else
    {
        if(toJD==MostRecentJD)
            ShowMostRecentOb = true
        else
            ShowMostRecentOb = false

        if(anotherStarNameValue.value!="")
        {
                if(plotAnotherDateSelect.selectedIndex==0) //---julian
                {
                    DateFormat = "Julian"
                    julianDateRadio.checked = true
                }
                else //--calendar---
                {
                    DateFormat = "Calendar"
                    calendarDateRadio.checked = true
                }
                    if(!plotAllDaysCheck.checked)
                        loadAnotherLightCurve(fromJD, toJD)
                    else
                        loadAnotherLightCurve("All", MostRecentJD)

                    //---cookie update---
                    CookieStarName=anotherStarNameValue.value
                    CookieUserID=UserID
                    if(!plotAllDaysCheck.checked)
                        CookieJDSpan=(toJD-fromJD).toFixed(2)
                     else
                        CookieJDSpan="All"
                    AllBands=userBandAllCheck.checked
                    if(RequestCheckArray.length==0)
                    {
                        AllBands=true
                        CookieBands=""
                    }
                    else
                        CookieBands=RequestCheckArray.toString()

                    CookieAllBands=AllBands
                    CookieDateFormat=DateFormat
                    if(mtypeSelect.selectedIndex==1)
                        CookieMagnitude="Differential"
                    else
                        CookieMagnitude="Standardized"

                    CookieJDStart=fromJD
                    var j = new JulianDate();
                    var nowJD = j.julian()

                   if(nowJD==toJD)
                        CookieJDEnd="Current"
                   else
                        CookieJDEnd=toJD
        }
        else
        {
            sendAnotherMsgDiv.innerHTML = "<center>Include a star name.</center>"
            spinner.style.webkitAnimationPlayState = 'paused';
            spinner.style.AnimationPlayState = 'paused';
            spinner.style.visibility = "hidden"
            cancelDownloadButton.disabled = true
            sendAnotherPlotButton.disabled = false
        }
     }
    //var height = plotAnotherCurveDiv.scrollHeight+5
    //plotAnotherCurveDiv.style.height=height+"px"

}
//---displayed in title(Calendar format)---
var RequestFromJD
var RequestToJD
var RequestInitDateFormat
function loadAnotherLightCurve(fromJD, toJD)
{
    /*---get the data for this request via API ---
        Called from:
           sendAnotherPlot @ 08_plotAnotherCurve.js
    */
    DataAPASS=[]
      ApassBands=""

    CountAPASS=[]

    userBandRequestDiv.style.visibility='hidden'
     //---displayed in title(converted to Calendar format)---
    if(fromJD!="All")
    {
    RequestFromJD=fromJD
    RequestToJD=toJD


    }

    ShowMostRecentOb=false
     mostRecentDataDiv.style.visibility = "hidden"


    var starName = anotherStarNameValue.value
    starName=starName.replace(/\+/g,"%2B")
    if(mtypeSelect.selectedIndex==1) //---diff magnitude---
    {
        if(fromJD!="All")
            var url = "https://www.aavso.org/vsx/index.php?view=api.delim&ident="+starName+"&fromjd="+fromJD+"&tojd="+toJD+"&where=mtype%3D1&delimiter=@@@"
        else
            var url = "https://www.aavso.org/vsx/index.php?view=api.delim&ident="+starName+"&tojd="+MostRecentJD+"&where=mtype%3D1&delimiter=@@@"
          d3.select("#yAxisText").text("Differential Magnitude")

    }
    else if(mtypeSelect.selectedIndex==0)
    {

         if(fromJD!="All")
        var url = "https://www.aavso.org/vsx/index.php?view=api.delim&ident="+starName+"&fromjd="+fromJD+"&tojd="+toJD+"&delimiter=@@@"
        else
         var url = "https://www.aavso.org/vsx/index.php?view=api.delim&ident="+starName+"&tojd="+MostRecentJD+"&delimiter=@@@"

        d3.select("#yAxisText").text("Magnitude")

        var ss = window.sessionStorage
        //---set this to be used if DIFF mag is available and requested---
        ss.setItem("diffMagfromJD", fromJD)
        ss.setItem("diffMagToJD", toJD)

    }

    //---Interactive Link-----
                var params =window.location.search;

                if(params!="")
                {

                    DateFormat= params.split("&")[0].split("DateFormat=")[0]
                    if(DateFormat=="Julian")
                        julianDateRadio.checked=true
                    else
                        julianDateRadio.checked=true

                    var RequestedBands=params.split("&")[1].split("RequestedBands=")[0]
                    if(RequestedBands=="")
                        AllBands=true
                    else
                    {
                        AllBands=false
                        var bands=RequestedBands.split(",")
                        for(var k=0;k<bands.length;k++)
                            RequestCheckArray.push(bands[k])
                    }

                    params=params.split("&")[1]


                }

            LinkDataURL="https://www.aavso.org/LCGv2/static.htm?DateFormat="+DateFormat+"&RequestedBands="+RequestCheckArray.toString()+"&Grid=true&"+ url.split("https://www.aavso.org/vsx/index.php?")[1]

            linkValue.value=LinkDataURL

            LinkActiveDataURL="https://www.aavso.org/LCGv2/index.htm?DateFormat="+DateFormat+"&RequestedBands="+RequestCheckArray.toString()+"&"+ url.split("https://www.aavso.org/vsx/index.php?")[1]
            linkInteractiveValue.value=LinkActiveDataURL



    var http = new XMLHttpRequest();
    http.open("GET", url, true);

    http.onreadystatechange = function()
    {

        //Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200)
        {
            var delimText = http.responseText
            //console.log("delimText "+delimText)
            if(delimText.indexOf("DB Error")==-1)
            {
                delimText = delimText.replace(/\r\n$/, "") //---removed last\r\n---
                //===get vsxObj=============

                var httpVSX = new XMLHttpRequest();

                var url = "https://www.aavso.org/vsx/index.php?view=api.object&ident="+starName+"&adopt&att&data=0"

                httpVSX.open("GET", url, true);

                httpVSX.onreadystatechange = function()
                {
                    //Call a function when the state changes.
                    if(httpVSX.readyState == 4 && httpVSX.status == 200)
                    {

                        var vsxText = httpVSX.responseText

                        if(delimText.length>300)
                        {

                                    getVSXXObj(vsxText)



                                     if(AllBands==true)
                                        TotalData = delim2JSON(delimText, "@@@")
                                     else
                                     {
                                        var returnedData=delim2JSON(delimText, "@@@")
                                        TotalData=userBandRequest(returnedData)
                                     }

                                   // if(TotalData.length<30000)
                                   // {

                                        if(TotalData.length>1) //returned data does not have bands selected---
                                        {
                                            calendarDateRadio.disabled = false
                                            RequestInitDateFormat=DateFormat
                                            userBandRequestDiv.style.visibility='hidden'
                                            contribSelectDiv.style.height = "1px"
                                            StarName = TotalData[0].starName


                                  


                                            buildJsonObj(false)
                                           setTimeout(findApassAtStar,5000) //---include when https in effect @ tombstone---
                                            var ss = window.sessionStorage
                                            ss.removeItem("diffMagSession")
                                           if(EmptyRequest==true)
                                            {
                                                contribSelectDiv.style.visibility="visible"
                                                plotAnotherCurveCloseButton.style.visibility=""
                                                plotAnotherSpan.innerHTML="Plot Another Curve"
                                                bgImg.style.display="none"
                                                EmptyRequest=false
                                            }
                                            if(params=="") //---do not add/update cookies---
                                            updateStarNameCookie(CookieStarName)
                                        }
                                        else if(TotalData.length==0)
                                        sendAnotherMsgDiv.innerHTML = "<center>Selected Bands not found.</center>"
                                        else if(TotalData.length==1)
                                        sendAnotherMsgDiv.innerHTML = "<center>Single observation: cannot plot.</center>"


                        }


                        //---stop load spinner---
                        spinner.style.webkitAnimationPlayState = 'paused';
                        spinner.style.AnimationPlayState = 'paused';
                        spinner.style.visibility = "hidden"
                        //---reset pane/preferences---
                          myStarNameSelect.selectedIndex=0
                           if(delimText.length<=300)
                                sendAnotherMsgDiv.innerHTML = "<center>No Data Found</center>"
                            else if(TotalData.length>1)
                            {
                                 sendAnotherMsgDiv.innerHTML=""
                                 //---25a_timelineRange.js===
                                 setRequestedDate(fromJD,toJD)

                            }

                    }
                    sendAnotherPlotButton.disabled = false
                }


                httpVSX.send()

            }
            else
            {
                sendAnotherMsgDiv.innerHTML = "<center>Database temporarily out of service</center>"
                //---stop load spinner---
                spinner.style.webkitAnimationPlayState = 'paused';
                spinner.style.AnimationPlayState = 'paused';
                spinner.style.visibility = "hidden"
            }

        }

    }
    http.send()

}

function cancelDownloadButtonClicked()
{
    /*---on click: User can stop the request ---
        Called from:
          cancelDownloadButton @ index.htm---
    */

    if(window.stop !== undefined)
    {
        window.stop();
    }
    else if(document.execCommand !== undefined) //---IE---
    {
        document.execCommand("Stop", false);
    }

    spinner.style.webkitAnimationPlayState = 'paused';
    spinner.style.AnimationPlayState = 'paused';
    spinner.style.visibility = "hidden"
    sendAnotherMsgDiv.innerHTML = "<center>Cancelled</center>"
    cancelDownloadButton.disabled = true
    sendAnotherPlotButton.disabled = false
}
