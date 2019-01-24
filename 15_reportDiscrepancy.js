 /*
 https://www.aavso.org/vsx/index.php?view=api.zapperlog
POST arguments are: auid, name, unique_id, editor, edtitdate and editorcomments.

Here are the field definitions:
- auid and name are both referring to the star
- unique_id is the id of the data point
- editor is the username of the person logged into the website. As mentioned above, we should be able to fetch their username from the website login. In the meantime, for testing purposes, maybe you can set this field to "LCG_user" for now.
- editdate is simply the current date (in JD format)
- editorcomments is a 100 character optional field that would come from the comments box.

 */

function sendZapper()
{   //---sendZapperButton clicked---
    /*---Send report to AAVSO---
        Called from:
            sendZapperButton @ index.htm
    */
    var http = new XMLHttpRequest();
    var url = "https://www.aavso.org/vsx/index.php?view=api.zapperlog";
    var auid=AUID
    var name=dataNameDiv.innerHTML
    var unique_id=dataIdDiv.innerHTML
    var editor="LCG_user:"+discrepancyMemberId.value
    var date=new Date()
    var nowJD = (date / 86400000) -(date.getTimezoneOffset()/1440) + 2440587.5;
    var editdate=nowJD.toFixed(4)
    var editorcomments=discrepancyCommentValue.value

        var params = "auid="+auid+"&name="+name+"&unique_id="+unique_id+"&editor="+editor+"&editdate="+editdate+"&editorcomments="+editorcomments
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function()
        {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
               discrepancyCommentValue.value ="Report Received"
            }
        }
        http.send(params);
   
}



