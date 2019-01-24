var AllBands=true
function userBandAllChecked()
{
   //---radio button---
   userBandRequestDiv.style.visibility='hidden'
   AllBands=true
   
}

function userBandSelectChecked()
{
   //---radio button---
   userBandRequestDiv.style.visibility='visible'
   AllBands=false
    
}
var RequestCheckArray=[]
function requestAllChecked()
{
    if(requestAllCheck.checked==true)
    {
     RequestCheckArray=["Vis","B","V","R","I","U","J","H","K","CV","CR","TB","TG","TR","SU","SG","SR",
     "SI","SZ","RJ","IJ","STU","STV","STB","STY","STHBW","STHBN","MA","MB","MI","NA","Blue","Green","Yellow","Orange",
     "Red","ZS","Y","HA","HAC","CBB"]
     for(var k=0;k<RequestCheckArray.length;k++)
     {
       var bnd=RequestCheckArray[k]
       document.getElementById("request"+bnd+"Check").checked=true
     }
    }
    else
    {
     for(var k=0;k<RequestCheckArray.length;k++)
     {
       var bnd=RequestCheckArray[k]
       document.getElementById("request"+bnd+"Check").checked=false
     }

      RequestCheckArray=[]
    }
}

function requestBandChecked(BND)
{
     var bandCheck=document.getElementById("request"+BND+"Check")
     if(bandCheck.checked==true)
     {
        RequestCheckArray.push(BND)
     }
     else
     {
       for(var k=0;k<RequestCheckArray.length;k++)
       {
           var bnd=RequestCheckArray[k]
           if(bnd==BND)
           {
               RequestCheckArray.splice(k,1)
               break;
           }
       }
     }
}
//---process load star data request--
function userBandRequest(returnedData)  //---01_loadStarData.js---
{
    var userBandData=[]
       for(var k = 0; k<returnedData.length; k++)
        {
            var ob = returnedData[k]
             var band = ob.band
                var re = /\./   //--(Vis.)---
                var band = ob.band.replace(re, "")
                if(ob.band=="N/A") //---remove slash---
                {
                    band = "NA"
                }
            if(RequestCheckArray.indexOf(band)!=-1)
            {
               userBandData.push(ob)

            }


        }

        return userBandData
}
function cookieBandRequest(returnedData)  //---08a_rememberStar.js---
{
    var cookieBandData=[]
       for(var k = 0; k<returnedData.length; k++)
        {
            var ob = returnedData[k]
             var band = ob.band
                var re = /\./   //--(Vis.)---
                var band = ob.band.replace(re, "")
                if(ob.band=="N/A") //---remove slash---
                {
                    band = "NA"
                }
            if(RequestCheckArray.indexOf(band)!=-1)
            {
               cookieBandData.push(ob)

            }


        }

        return cookieBandData
}

