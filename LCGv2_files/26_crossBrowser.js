function setBrowserStyle()
{
   //---CSS adjustments based on the user's screen size & browser---
    /*---onLoad at index.htm---
        Called from:
           testBrowserVersion @ 13_bowser.js
    */

    if(screen.width<900)
    {
        document.body.style.overflowX = "visible"
        navTable.style.width = 1200+"px"
        plotContainerDiv.style.width = 1200+"px"
        meanCurveDiv.style.width = 1200+"px"
        document.body.style.fontSize = "75%"
    }
    if(BrowserName=="Internet Explorer"&&screen.width<1300)
    {
        document.body.style.overflowX = "visible"

    }

    if(BrowserName=="Safari")
    {
       // meanCurveDiv.style.top = "40px"
        spacerContribDiv.innerHTML = "<p>&nbsp;</p>"
    }
    else
    {

        spacerContribDiv.innerHTML = "<p>&nbsp;</p>"

    }
    if(BrowserName=="Opera"||BrowserName=="Firefox")
    {
       // if(BrowserName=="Opera")
            //document.body.style.fontSize = "75%"

            //if(BrowserName=="Firefox")
            //document.body.style.fontSize = "90%"

          //  meanCurveDiv.style.height = "20px"

            if(BrowserName=="Firefox")
            {
               //meanCurveDiv.style.top = "30px"
                spacerContribDiv.innerHTML = "<p>&nbsp;</p><p>&nbsp;</p>"
            }
           // else
                //meanCurveDiv.style.top = "40px"

                tdBinSize.style.height = "30px"
                //meanCurveDiv.style.fontSize = "90%"

                aavsoLogoImg.width = 20
                aavsoLogoImg.height = 20

    }
    if(BrowserName=="Internet Explorer")
    {
       // meanCurveDiv.style.top = "40px"

    }
  //  if(BrowserName!="Chrome")
      //  printButton.style.visibility="hidden"

}
