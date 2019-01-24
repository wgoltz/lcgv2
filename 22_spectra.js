var SpectraG
/*
 Placeholder for future spectra data points

*/
function addSampleSpectra()
{
    /*---Temp - show examples of spectra symbols---
        Called from:
            @ 24_loadSampleStarData.js
    */

   var height=PlotHeight-30
  
   var spectra1=SpectraG.append("circle")
    .attr("r","8")
    .attr("cx","80")
    .attr("cy",0)
    .attr("stroke","none")
    .attr("fill","url(#spectra)")
    .attr("onmouseover","showSpectra(evt)")
    .attr("onmouseout","hideSpectra()")

   var spectra1=SpectraG.append("circle")
    .attr("r","8")
    .attr("cx","280")
    .attr("cy",0)
    .attr("stroke","none")
    .attr("fill","url(#spectra)")
    .attr("onmouseover","showSpectra(evt)")
    .attr("onmouseout","hideSpectra()")

   var spectra1=SpectraG.append("circle")
    .attr("r","8")
    .attr("cx","580")
    .attr("cy",0)
    .attr("stroke","none")
    .attr("fill","url(#spectra)")
    .attr("onmouseover","showSpectra(evt)")
    .attr("onmouseout","hideSpectra()")

}