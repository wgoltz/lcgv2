
var UserID //---the Observer's id code needed by dataPacketSelected @ 12_symbolDataPacket.js---
function getCallingForm()
{
    /*---called when LCG (onload) requested, via AAVSO web page---
        Called from:
            getBrowserVersion @ 13_bowser.js
    */

    if(sessionStorage.getItem('username'))
    {   //---Has the member logged in?---
        UserID=sessionStorage.getItem('username') //--value used for 'Report Discrepancy' ---
        console.log("sessionStorage.getItem('username') ="+UserID)
    }
    if(sessionStorage.getItem('lastObservationStar'))
    {   //---User wants to view the light curve for the 'Last Observation Received'---
        StarName = sessionStorage.getItem('lastObservationStar')
         CookieStarName=StarName
        StarName=StarName.replace(/\+/g,"%2B")
        sessionStorage.removeItem('lastObservationStar');
        ShowMostRecentOb=true
        plotAnotherCurveDiv.style.visibility="hidden"
        loadStarData()
    }

    else if(sessionStorage.getItem('requestStar'))
    {
        //---User wants to view a light curve for 'Pick a Star'---
        StarName = sessionStorage.getItem('requestStar')
        if(StarName)
        {
            CookieStarName=StarName
            StarName=StarName.replace(/\+/g,"%2B")
            sessionStorage.removeItem('requestStar');
            plotAnotherCurveDiv.style.visibility="hidden"
            loadStarData()
        }
    }
   else
       emptyRequest()
}
/* delimited header

//---current API---
JD,
mag,
uncert,
band,
by,
comCode,
compStar1,
compStar2,
charts,
comment,
transformed,
airmass,
val,
cmag,
kmag,
starName,
obsAffil,
mtype,
adsRef,
digitizer,
credit,
obsID,
fainterThan,
obsType,
software,
obsName,
obsCountry
*/


 var MainRequest=false //---call from main AAVSO page---
 var LinkDataURL
 var LinkActiveDataURL
function loadStarData()
{
    /*---User requests either 'Last Observation' or 'Pick a Star'---
        called from:
            getCallingForm() @ 01_loadStarData.js---
    */

    //---created via #spinner at lcg.css---
    spinner.style.webkitAnimationPlayState = 'running';
    spinner.style.AnimationPlayState = 'running';
    spinner.style.visibility = "visible"
  if(CookieStarName && findStarNameCookie(CookieStarName))
  {

                /*
                var delim="@@@"
               var myCookieValue=utcMS+delim+CookieStarName+delim+CookieUserID+delim+CookieJDSpan+delim+CookieDateFormat+delim+CookieAllBands+delim+CookieBands+delim+CookieMagnitude
                 split(delim):
                [0]=utcMS
                [1]=CookieStarName
                [2]=CookieUserID
                [3]=CookieJDSpan
                [4]=CookieDateFormat
                [5]=CookieAllBands
                [6]=CookieBands
                [7]=CookieMagnitude
                [8]CookieJDStart
                [9]CookieJDEnd

             */
        anotherStarNameValue.value=CookieStarName
        var cookieValue=findStarNameCookie(CookieStarName)
        AllBands=eval(cookieValue.split("@@@")[5])  //--true/false---
        var bandSplit=cookieValue.split("@@@")[6].split(",")
        RequestCheckArray=[]
        for(var k=0;k<bandSplit.length;k++)
            RequestCheckArray.push(bandSplit[k])
        var userId=cookieValue.split("@@@")[2]

        if(userId!="undefind")
        UserID=userId
        DateFormat=cookieValue.split("@@@")[4]
        if(DateFormat=="Julian")  julianDateRadio.checked=true
        else if(DateFormat=="Calendar") calendarDateRadio.checked=true

      //---used saved Star timeline---
        //--current date/time---
        var date = new Date()
        var toJD = (date / 86400000) -(date.getTimezoneOffset()/1440) + 2440587.5 ;
       var cookieJDspan=+cookieValue.split("@@@")[3]
       var fromJD=toJD-cookieJDspan
  }
  else
  {
    //---minus 730 days from present--
    var lastYearMS = 730 * 24 * 60 * 60 * 1000
    var dateMS = new Date().getTime()
    var lastYrDate = new Date(dateMS-lastYearMS)
    var fromJD = (lastYrDate / 86400000) -(lastYrDate.getTimezoneOffset()/1440) + 2440587.5;
    //--current date/time---
    var date = new Date()
    var toJD = (date / 86400000) -(date.getTimezoneOffset()/1440) + 2440587.5 ;
    //---add to cookies--
    CookieUserID=UserID
    CookieJDSpan=(toJD-fromJD).toFixed(2)
    CookieJDStart=fromJD.toFixed(0)
    CookieJDEnd=toJD
    CookieDateFormat="Julian"
    CookieAllBands="true"
    CookieBands=""
    rememberThisStar(CookieStarName)
  }

    //---required for APASS---
anotherFromDateValue.value=fromJD
anotherToDateValue.value=toJD


        var url = "https://www.aavso.org/vsx/index.php?view=api.delim&ident="+StarName+"&fromjd="+fromJD+"&tojd="+toJD+"&delimiter=@@@"

            LinkDataURL="https://www.aavso.org/LCGv2/static.htm?DateFormat=Julian&RequestedBands=&Grid=true&"+ url.split("https://www.aavso.org/vsx/index.php?")[1]

            linkValue.value=LinkDataURL

            LinkActiveDataURL="https://www.aavso.org/LCGv2/index.htm?DateFormat=Julian&RequestedBands=&Grid=true&"+ url.split("https://www.aavso.org/vsx/index.php?")[1]
            linkInteractiveValue.value=LinkActiveDataURL


/*

    LinkDataURL="https://www.aavso.org/LCGv2/static.htm?"+ url.split("https://www.aavso.org/vsx/index.php?")[1]
    linkValue.value=LinkDataURL
    LinkActiveDataURL="https://www.aavso.org/LCGv2/index.htm?"+ url.split("https://www.aavso.org/vsx/index.php?")[1]
    linkInteractiveValue.value=LinkActiveDataURL
*/
    var http = new XMLHttpRequest();
    http.onload = callbackData
    http.open("GET", url, true);
    http.send()
    function callbackData()
    {
        //---delimited format (@@@)---
        var delimText = http.responseText
        if(delimText.indexOf("DB Error")==-1)
        {
            delimText = delimText.replace(/\r\n$/, "") //---bogus:newline removed last\r\n---
            var url = "https://www.aavso.org/vsx/index.php?view=api.object&ident="+StarName+"&adopt&att&data=0"
             var httpVSX = new XMLHttpRequest();
            httpVSX.onload = callbackVSX
            httpVSX.open("GET", url, true);
            httpVSX.send()
            function callbackVSX()
            {
                //---XML format---
                var vsxText = httpVSX.responseText
                var success

                if(success = (delimText.length>300))
                {
                    getVSXXObj(vsxText)
                    MainRequest=true
                    if(AllBands==true)
                        TotalData = delim2JSON(delimText, "@@@")
                    else
                    {
                        var returnedData=delim2JSON(delimText, "@@@")
                        TotalData=userBandRequest(returnedData)
                    }

                    initPlot()

                    if (success = buildJsonObj(false))
                    {
                        bgImg.style.display = "none"
                        navTable.style.visibility = "visible"
                        MainRequest=false
                        setTimeout(initBox,1000)
                        setTimeout(findApassAtStar,5000)
                    }
                }
                if (! success)
                {
                    loadingStarH.innerHTML = "Data not found for this star"
                    LoadError = "<center>Data not found for this star</center>"
                }
                spinner.style.webkitAnimationPlayState = 'paused';
                spinner.style.AnimationPlayState = 'paused';
                spinner.style.visibility = "hidden"
            }
        }
        else
        {
            spinner.style.webkitAnimationPlayState = 'paused';
            spinner.style.AnimationPlayState = 'paused';
            spinner.style.visibility = "hidden"
            loadingStarH.innerHTML = "***Database Error***"
            LoadError = "<center>***Database Error***</center>"
        }
    }
}
//---called from 13_bowser.js---

function loadInterActiveData()
{
    plotAnotherCurveDiv.style.visibility="hidden"
    spinner.style.webkitAnimationPlayState = 'running';
    spinner.style.AnimationPlayState = 'running';
    spinner.style.visibility = "visible"

    var params =window.location.search;
    var url="https://www.aavso.org/vsx/index.php?view="+params.split("view=")[1]

      DateFormat= params.split("&")[0].replace(/\?DateFormat=/,"")

    if(DateFormat=="Julian")
        julianDateRadio.checked=true
    else
        calendarDateRadio.checked=true

    var RequestedBands=params.split("&")[1].replace(/RequestedBands=/,"")

    if(RequestedBands=="")
        AllBands=true
    else
    {
        AllBands=false
        var bands=RequestedBands.split(",")
        for(var k=0;k<bands.length;k++)
            RequestCheckArray.push(bands[k])
    }

    LinkDataURL="https://www.aavso.org/LCGv2/static.htm?DateFormat="+DateFormat+"&RequestedBands="+RequestCheckArray.toString()+"&Grid=true&"+ url.split("https://www.aavso.org/vsx/index.php?")[1]
    linkValue.value=LinkDataURL

    LinkActiveDataURL="https://www.aavso.org/LCGv2/index.htm?DateFormat="+DateFormat+"&RequestedBands="+RequestCheckArray.toString()+"&"+ url.split("https://www.aavso.org/vsx/index.php?")[1]
    linkInteractiveValue.value=LinkActiveDataURL

    var http = new XMLHttpRequest();
    http.onload = callbackData
    http.open("GET", url, true);
    http.send()
    function callbackData()
    {
        //---delimited format (@@@)---
        var delimText = http.responseText

        LoadError = !(delimText.indexOf("DB Error")==-1)
        if(! LoadError)
        {

                StarName=params.split("&")[3].replace(/ident=/,"").replace(/\%20/g,"")
                delimText = delimText.replace(/\r\n$/, "") //---bogus:newline removed last\r\n---
                var url = "https://www.aavso.org/vsx/index.php?view=api.object&ident="+StarName+"&adopt&att&data=0"

                var httpVSX = new XMLHttpRequest();
                httpVSX.onload = callbackVSX
                httpVSX.open("GET", url, true);
                httpVSX.send()
            function callbackVSX()
            {
                //---XML format---
                var vsxText = httpVSX.responseText
                var success

                if(success = (delimText.length>300))
                {
                    getVSXXObj(vsxText)
                    MainRequest=true
                    EmptyRequest=false

                    if(AllBands==true)
                        TotalData = delim2JSON(delimText, "@@@")
                    else
                    {
                        var returnedData=delim2JSON(delimText, "@@@")
                        TotalData=userBandRequest(returnedData)
                    }

                    if (success = buildJsonObj(true))
                    {
                        buildPlot()
                        initGrid()

                        bgImg.style.display = "none"
                        navTable.style.visibility = "visible"
                        MainRequest=false
                        setTimeout(findApassAtStar,5000)
                    }
                }
                LoadError = ! success
                if (LoadError)
                {
                    loadingStarH.innerHTML = "Data not found for this star"
                }
                spinner.style.webkitAnimationPlayState = 'paused';
                spinner.style.AnimationPlayState = 'paused';
                spinner.style.visibility = "hidden"
            }
        }
        else
        {
            spinner.style.webkitAnimationPlayState = 'paused';
            spinner.style.AnimationPlayState = 'paused';
            spinner.style.visibility = "hidden"
            loadingStarH.innerHTML = "***Database Error***"
        }

    }

}
