var CookieAllBands
var CookieStarName
var CookieBands
var CookieUserID
var CookieJDSpan
var CookieDateFormat
var CookieMagnitude
var CookieJDStart
var CookieJDEnd
var CookieAPASS

function rememberThisStar(CookieStarName)
{
    var utcMS=new Date().getTime()
    var delim="@@@"
    var myCookie=utcMS+delim+CookieStarName+delim+CookieUserID+delim+CookieJDSpan+delim+CookieDateFormat+delim+CookieAllBands+delim+CookieBands+delim+CookieMagnitude+delim+CookieJDStart+delim+CookieJDEnd
    setCookie("StarName"+utcMS,myCookie,180)
    writeMyStarNameSelect()

}

 function findStarNameCookie(starName)
 {
      var starName=starName.toLowerCase()
      var starName=starName.replace(/ /g,"")

	pCOOKIES = new Array();
	pCOOKIES = document.cookie.split('; ');
      var starCookieFound=false
	for(bb = 0; bb < pCOOKIES.length; bb++)
    {
          console.log()
		NmeVal  = new Array(pCOOKIES[bb]);
		NmeVal  = pCOOKIES[bb].split('=');
		if(NmeVal[0]){
           var cookieName=NmeVal[0]
           var cookieValue=unescape(NmeVal[1])
           if(cookieName.indexOf("StarName")!=-1)
           {

               starNameCookie=cookieValue.split("@@@")[1].toLowerCase().replace(/ /g,"")
    		   if(starNameCookie==starName)
               {
                  starCookieFound=cookieValue
                    break
               }
           }
		}
	}
    return starCookieFound
 }

function writeMyStarNameSelect()
{
    pCOOKIES = new Array();
	pCOOKIES = document.cookie.split('; ');
    //---clear select---
    options=myStarNameSelect.options
    for(j=options.length-1;j>0;j--)
       myStarNameSelect.removeChild(options[j])
     var nameAlphaArray=[]
	for(bb = 0; bb < pCOOKIES.length; bb++)
    {
		NmeVal  = new Array();
		NmeVal  = pCOOKIES[bb].split('=');
		if(NmeVal[0]){
           var cookieName=NmeVal[0]
           var cookieValue=unescape(NmeVal[1])
           if(cookieName.indexOf("StarName")!=-1)
           {
                nameAlphaArray.push(cookieValue.split("@@@")[1] )
           }
		}
	}

    nameAlphaArray.sort()
    for(var k=0;k<nameAlphaArray.length;k++)
    {
        var option=document.createElement("OPTION")
        option.text=nameAlphaArray[k]
        myStarNameSelect.appendChild(option)
    }

    var option=document.createElement("OPTION")
    option.text=".....Clear History....."
    myStarNameSelect.appendChild(option)

    if(nameAlphaArray.length>0)
        myStarNameTR.style.visibility="inherit"
     var height = plotAnotherCurveDiv.scrollHeight+20
      plotAnotherCurveDiv.style.height=height+"px"

}
 //---when star plotted---
function updateStarNameCookie(starName)
{
    var starName=starName.toLowerCase()
    var starName=starName.replace(/ /g,"")
	pCOOKIES = new Array();
	pCOOKIES = document.cookie.split('; ');

	for(bb = 0; bb < pCOOKIES.length; bb++)
    {
		NmeVal  = new Array();
		NmeVal  = pCOOKIES[bb].split('=');
		if(NmeVal[0]){
           var cookieName=NmeVal[0]
           var cookieValue=unescape(NmeVal[1])
           if(cookieName.indexOf("StarName")!=-1)
           {
               starNameCookie=cookieValue.split("@@@")[1].toLowerCase().replace(/ /g,"")
    		   if(starNameCookie==starName)
               {
                  //---negate old cookie---
                  setCookie(cookieName,"",-1)
                    break
               }
           }
		}
	}
    var utcMS=new Date().getTime()
    var delim="@@@"
    var myCookie=utcMS+delim+CookieStarName+delim+CookieUserID+delim+CookieJDSpan+delim+CookieDateFormat+delim+CookieAllBands+delim+CookieBands+delim+CookieMagnitude+delim+CookieJDStart+delim+CookieJDEnd
    setCookie("StarName"+utcMS,myCookie,180)
    writeMyStarNameSelect()
}

function myStarNameSelected()
{
    if(myStarNameSelect.selectedIndex!=0)
    {
        sendAnotherMsgDiv.innerHTML=""
        anotherFromDateValue.style.background=""
        anotherToDateValue.style.background=""
        plotLastDaysCheck.checked=false;
        plotAllDaysCheck.checked=false;
        var nameSelected=myStarNameSelect.options[myStarNameSelect.selectedIndex].text
        if(nameSelected!=".....Clear History.....")
        {
            anotherStarNameValue.value=nameSelected
            //---set: bands,timeline,dateFormat---
            var starCookieFound=findStarNameCookie(nameSelected)
            if(starCookieFound)
            {

                /*
                var delim="@@@"
               var myCookieValue=utcMS+delim+CookieStarName+delim+CookieUserID+delim+CookieJDSpan+delim+CookieDateFormat+delim+CookieAllBands+delim+CookieBands
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
                [10]CookieAPASS
             */

                var allBands=eval(starCookieFound.split("@@@")[5])  //--true/false---
                if(allBands==true)
                {
                  userBandRequestDiv.style.visibility="hidden"
                  userBandAllCheck.checked=true
                }
                else
                {
                    userBandSelectCheck.checked=true
                    userBandRequestDiv.style.visibility="visible"
                    var bandSplit=starCookieFound.split("@@@")[6].split(",")

                    RequestCheckArray=[]
                    for(var k=0;k<bandSplit.length;k++) //---has leading comma??--
                    if(bandSplit[k]!="")
                        RequestCheckArray.push(bandSplit[k])
                     for(var k=0;k<RequestCheckArray.length;k++)
                     {
                       var bnd=RequestCheckArray[k]
                       document.getElementById("request"+bnd+"Check").checked=true
                     }
                }
                var cookieJDSpan=starCookieFound.split("@@@")[3]
                var cookieJDStart=starCookieFound.split("@@@")[8]
                var cookieJDEnd=starCookieFound.split("@@@")[9]

                    var j = new JulianDate();
                    var toJD = j.julian()
                    if(cookieJDSpan!="All")
                    {
                        cookieJDSpan=+starCookieFound.split("@@@")[3]
                        if(!cookieJDEnd || cookieJDEnd=="Current")
                            var fromJD=(toJD-cookieJDSpan).toFixed(0)
                         else
                         {
                             var fromJD=+cookieJDStart
                             toJD=+cookieJDEnd
                         }

                    }
                    else
                    {
                        var fromJD="All"
                        plotAllDaysCheck.checked=true
                        anotherToDateValue.style.background="tan"
                        anotherFromDateValue.style.background="tan"
                    }

                    hiddenFromJD.value=fromJD
                    hiddenToJD.value=toJD
                var dateFormat=starCookieFound.split("@@@")[4]
                if(dateFormat=="Julian")
                {

                    plotAnotherDateSelect.selectedIndex=0
                    anotherFromDateValue.value=fromJD
                    anotherToDateValue.value=toJD.toFixed(3)

                }
               else if(dateFormat=="Calendar")
                {
                   plotAnotherDateSelect.selectedIndex=1

                    anotherToDateValue.value = julian2Date(toJD)
                    if(fromJD!="All")
                    anotherFromDateValue.value=julian2Date(fromJD)
                    else
                      anotherFromDateValue.value="All"
                }

             var userId=starCookieFound.split("@@@")[2]
                if(userId!="undefind")
                UserID=userId
          console.log("09_starCookieFound.split('@@@')[2] = "+UserID)
                var mag=starCookieFound.split("@@@")[7]
                if(mag!="undefind")
                {
                    if(mag=="Standardized")
                     mtypeSelect.selectedIndex=0
                     else if(mag=="Differential")
                       mtypeSelect.selectedIndex=1
                }
            }
        }
        else
        {
            options=myStarNameSelect.options
            for(j=options.length-1;j>0;j--)
                myStarNameSelect.removeChild(options[j])
            myStarNameTR.style.visibility="hidden"
            deleteAllCookies()

        }

    }
}

 function setCookie(c_name,value,exdays)
 {
	 var exdate=new Date();
	 exdate.setDate(exdate.getDate() + exdays);
	 var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	 document.cookie=c_name + "=" + c_value;
 }

function getCookie(c_name)
{
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1)
	{
	 	c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1)
	{
	 	c_value = null;
	}
	else
	{
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1)
		{
		 	c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}
function printCookies(){

	cStr = "";
	pCOOKIES = new Array();
	pCOOKIES = document.cookie.split('; ');
  //alert(pCOOKIES.length)
	for(bb = 0; bb < pCOOKIES.length; bb++){
		NmeVal  = new Array();

		NmeVal  = pCOOKIES[bb].split('=');
		if(NmeVal[0]){
		    console.log(NmeVal[0] + '=' + unescape(NmeVal[1]) );
		}
	}
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

