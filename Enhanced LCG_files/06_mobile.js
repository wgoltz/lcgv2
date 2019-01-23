function isMobileDevice()
{       //---called via mobileTest @ 06_mobile.js---
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

var Mobile = false
function mobileTest()
{
    /*
     ---Arranges HTML for mobile viewing---
     called onLoad @ index.htm
    */

    Mobile = isMobileDevice()

    if(Mobile==true)
    {

        symbolDataPacketDiv.style.left="50%"
        // myStarNameTR.style.display="none"
        plotAnotherCurveDiv.style.overflow = "scroll"
        plotAnotherCurveDiv.style.top = "60px"
        plotAnotherCurveDiv.style.left = "100px"
        plotAnotherCurveDiv.style.fontSize = "150%"
        plotAnotherCurveDiv.style.width = "70%"
        plotAnotherCurveDiv.style.height = "100%"
        plotAnotherCurveDiv.style.webkitTransform = "scale(1.2,1.2)"
        plotAnotherCurveDiv.style.MozTransform = "scale(1.2,1.2)"  ;
        plotAnotherCurveDiv.style.msTransform = "scale(1.2,1.2)"  ;
        plotAnotherCurveDiv.style.OTransform = "scale(1.2,1.2)"  ;
        plotAnotherCurveDiv.style.transform = "scale(1.2,1.2)"  ;

        plotAnotherTable.style.width="100%"
        plotAnotherTable.style.height="90%"
        anotherStarNameValue.style.width="300px"
        anotherStarNameValue.style.height="40px"
        anotherStarNameValue.style.fontSize="150%"
        myStarNameSelect.style.height="40px"
        myStarNameSelect.style.fontSize="150%"
        anotherFromDateValue.style.width = "75%"
        anotherToDateValue.style.width = "75%"
        plotAnotherButton.style.fontSize = "150%"
        adopterDiv.style.visibility = "hidden"
        meanCurveButton.style.visibility = "hidden"
        boxResetButton.style.visibility = "hidden"
        prefButton.style.visibility = "hidden"
        printButton.style.visibility = "hidden"
        boxButton.style.visibility = "hidden"
        boxHelpButton.style.visibility = "hidden"
        contribSelectDiv.style.display = "none"
        userBandRequestDiv.style.top="30px"
        userBandRequestDiv.style.left="40px"
        userBandAllCheck.style.width="35px"
        userBandAllCheck.style.height="35px"
        userBandSelectCheck.style.height="35px"
        userBandSelectCheck.style.width="35px"
        userBandRequestDiv.style.webkitTransform = "scale(2,2)"
        userBandRequestDiv.style.MozTransform = "scale(2,2)"  ;
        userBandRequestDiv.style.msTransform = "scale(2,2)"  ;
        userBandRequestDiv.style.OTransform = "scale(2,2)"  ;
        userBandRequestDiv.style.transform = "scale(2,2)"  ;

        userBandRequestDiv.style.width="100%"
        userBandRequestDiv.style.overflow="auto"
        navTable.style.display="none"
        mostRecentDataDiv.style.display="none"
        mostRecentSymbolDataDiv.style.display="none"
        dataSelectDiv.style.display="none"
        sendAnotherPlotButton.style.fontSize="150%"

    }

}