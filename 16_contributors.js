//-------------sort-----------
function sortContribSelected()
{
  if(sortContribSelect.selectedIndex==1)
    buildContribSelect() //---default---
  else if(sortContribSelect.selectedIndex==2)
    buildContribCntSelect()


}



var ContribCheckArray =[]
var ContribCntArray=[] // ---sort on contributions : ContribCntArray.push([cnted,contrib,"'"+cntBands+"'","'"+name+"'",,"'"+affil+"'",cntry]) ---
function buildContribSelect()
{
    if(Mobile==false)
    {
    /*---build contribTable(alphabetical)---
        Called from:
           buildJsonObj @ 02_buildData.js
    */

   apassContribDiv.style.visibility="hidden"
    //---return from contribution count sort
    if(ContribCntArray.length>0)
    {
         for(var j=0;j<ContribHighlightArray.length;j++)
            {
                symbolPlotG.removeChild(ContribHighlightArray[j])
            }

     contribAllCheck.checked=true
     contribAllCheckClicked()
         ContribCntArray=[]
        PrevContribHighlight = null
        PrevContribHighlight=null
        PrevContribBGcolor=null
        ContribHighlightArray=[]
     }
     else
     {
      contribSelectDiv.style.height = "1px"
      contribSelectDiv.style.display = "none"
      }
     var heartCodes="*" //---add heart to contrib if adoptedBy---
     if(AdoptedBy.childNodes.length>0)
    {
        for(var k = 0; k<AdoptedBy.childNodes.length; k++)
        if(AdoptedBy.childNodes[k].getAttribute("ObsCode")&&AdoptedBy.childNodes[k].getAttribute("ObsCode")!="" )
            heartCodes+=AdoptedBy.childNodes[k].getAttribute("ObsCode")+"*"
    }

    clearContribToggle()

  contribAllCheck.checked = true

    ContribCheckArray =[]
    CheckedContribArray =[]
    //--clear previous contrib select---
    for(var k = contribTable.rows.length-1; k>=0; k--)
        contribTable.deleteRow(k)

        ContribArray.sort()

        function cntContrib(Contrib)
        {
            var current = Contrib;
            var cnt = 0;
            for (var i = 0; i < ContribArray.length; i++)
            {
                if (ContribArray[i][0]== current)
                {
                    cnt++;
                }
            }

            return cnt
        }


        function bandContrib(Contrib)
        {
            var current = Contrib;
            var myBands =[]
            for (var i = 0; i < ContribArray.length; i++)
            {
                if (ContribArray[i][0]== current)
                {
                    var contribBand = ContribArray[i][4]
                    if(myBands.toString().indexOf(contribBand)==-1)
                    {
                        myBands.push(contribBand)
                        //---init this array, see 19_dataSelect.js---
                        SelectedBandContribArray.push([contribBand, current])
                    }
                }
            }
            var re=/@/g

            return " : <i>"+myBands.toString().replace(re,"")+"</i>"
        }
        function bandCntContrib(Contrib)
        {
            var current = Contrib;
            var myBands =[]
            for (var i = 0; i < ContribArray.length; i++)
            {
                if (ContribArray[i][0]== current)
                {   var contribBand = ContribArray[i][4]
                     if(myBands.toString().indexOf(contribBand)==-1)
                        myBands.push(contribBand)

                }
            }
              var re=/@/g
            return myBands.toString().replace(re,"")
        }


       var contribSplit = Contribs.split(",").sort()


        CntIndexArray=[] //--sort count---
        var rowCnt = 0
    for(var k = 0; k<contribSplit.length; k++)
    {
      var contrib = contribSplit[k]
      if(contrib!="")
      {
            var bg = "#A6C9E6"
            var bgFactor = rowCnt*.5+""
            if(bgFactor.indexOf(".5")==-1)
                bg = "#64B2F1"

            var cnted = cntContrib(contrib)
            var myBands = bandContrib(contrib)
            var row = contribTable.insertRow(rowCnt++)
            row.align="left"
            row.style.backgroundColor = bg
            var radioCell = row.insertCell(0)
            radioCell.innerHTML = '<span style="border:1px solid black;border-radius:4px;background-color:darkorange" ><input id=highlightRadio'+contrib+' name="highlightRadio" onClick=highlightContrib("'+contrib+'");checkMyCheck("'+contrib+'")  title="Highlight this contributor observations" type="checkbox" /></span>'
            var contribCell = row.insertCell(1)

            if(ShowMostRecentOb==true)
            {
                MostRecentOb = symbolPlotG.lastChild
                if(MostRecentOb.getAttribute("by")==contrib)
                {
                    contribCell.style.backgroundColor = "linen"
                    highlightMostRecentOb()
                }
            }

            contribCell.setAttribute("id", "contribCell"+contrib)
            contribCell.innerHTML = contrib+" ("+cnted+")"+myBands
            var checkCell = row.insertCell(2)
            checkCell.setAttribute("id", "checkCell"+contrib)
            checkCell.style.backgroundColor = bg
            checkCell.innerHTML = "<input type=checkbox checked id=contribCheck"+contrib+" onClick=contribCheckClicked('"+contrib+"') />"
            var nameCell = row.insertCell(3)
            nameCell.style.width = "20%"
            nameCell.style.fontSize = "110%"
            var cntryCell = row.insertCell(4)
            var affilCell = row.insertCell(5)
            affilCell.style.fontSize = "80%"
            for(var j = 0; j<ContribArray.length; j++)
            {

                var myContrib = ContribArray[j][0]

                if(ContribArray[j][1]!=""&&myContrib==contrib)
                {
                    var name = ContribArray[j][1]
                    var cntry = ContribArray[j][2]
                    var affil = ContribArray[j][3]
                        var heart=""
                        if(heartCodes.indexOf(contrib)!=-1)
                            heart="<span title='Star Adopter'  style=cursor:default;color:red>&hearts;</span>"
                        nameCell.innerHTML = heart+name

                    nameCell.setAttribute("id", "name"+contrib)
                    cntryCell.innerHTML = cntry
                    affilCell.innerHTML = affil
                    var cntBands=bandCntContrib(contrib)
                     ContribCntArray.push([cnted,contrib,"'"+cntBands+"'","'"+name+"'",affil,cntry])
                    break
                }

            }
            ContribCheckArray.push(contrib)

            if(k<contribSplit.length-1)
            {
                contrib = contribSplit[k+1]

                var spacerCell = row.insertCell(6)
                spacerCell.style.backgroundColor = "#538BBA"
                spacerCell.style.width = "30px"

                var cnted = cntContrib(contrib)
                var myBands = bandContrib(contrib)

                var radioCell = row.insertCell(7)
                radioCell.innerHTML = '<span style="border:1px solid black;border-radius:4px;background-color:darkorange"><input id=highlightRadio'+contrib+' name="highlightRadio" onClick=highlightContrib("'+contrib+'");checkMyCheck("'+contrib+'")  title="Highlight this contributor observations" type="checkbox" /></span>'

                var contribCell = row.insertCell(8)
                contribCell.setAttribute("id", "contribCell"+contrib)

                if(ShowMostRecentOb==true)
                {
                    MostRecentOb = symbolPlotG.lastChild
                    if(MostRecentOb.getAttribute("by")==contrib)
                        contribCell.style.backgroundColor = "linen"

                }
                contribCell.innerHTML = contrib+" ("+cnted+")"+myBands

                var checkCell = row.insertCell(9)
                checkCell.setAttribute("id", "checkCell"+contrib)
                checkCell.style.backgroundColor = bg

                checkCell.innerHTML = "<input type=checkbox checked id=contribCheck"+contrib+" onClick=contribCheckClicked('"+contrib+"') />"
                var nameCell = row.insertCell(10)
                nameCell.style.width = "20%"
                nameCell.style.fontSize = "110%"

                var cntryCell = row.insertCell(11)
                var affilCell = row.insertCell(12)
                affilCell.style.fontSize = "80%"
                for(var j = 0; j<ContribArray.length; j++)
                {

                    var myContrib = ContribArray[j][0]

                    if(myContrib==contrib)
                    {
                        var name = ContribArray[j][1]
                        var cntry = ContribArray[j][2]
                        var affil = ContribArray[j][3]
                        var heart=""
                          if(heartCodes.indexOf(contrib)!=-1)
                            heart="<span title='Star Adopter'  style=cursor:default;color:red>&hearts;</span>"
                        nameCell.innerHTML = heart+name
                        nameCell.setAttribute("id", "name"+contrib)

                        cntryCell.innerHTML = cntry
                        affilCell.innerHTML = affil
                        var cntBands=bandCntContrib(contrib)
                         ContribCntArray.push([cnted,contrib,"'"+cntBands+"'","'"+name+"'",affil,cntry])
                        break
                    }

                }
                ContribCheckArray.push(contrib)

            }

        }
       k++
    }
    contribSelectDiv.style.display = "block"
   if( ContribCntSorted==false  )
    openDiv('contribSelectDiv')

    }
}
var ContribCntSorted=false
function buildContribCntSelect()
{
    ContribCntSorted=true

    for(var j=0;j<ContribHighlightArray.length;j++)
        {
            symbolPlotG.removeChild(ContribHighlightArray[j])
        }
     contribAllCheck.checked=true
    contribAllCheckClicked()

    CheckedContribArray=[]
    PrevContribHighlight = null
    PrevContribHighlight=null
    PrevContribBGcolor=null
    ContribHighlightArray=[]

    //---remove highlight symbols
    //---show all band symbols--


    //---sort contribs on their number of contributions-----
   // ---sort on contributions : ContribCntArray.push([cnted,contrib,"'"+cntBands+"'","'"+name+"'",,"'"+affil+"'",cntry]) ---

      var ContribCntArraySorted=[]
      var cntSortArray=[]
      for(var k=0;k<ContribCntArray.length;k++)
      {
          contribCnt=ContribCntArray[k]
           var cnted=contribCnt[0]
           cntSortArray.push(cnted+ k/10000)
      }
      cntSortArray.sort(function(a, b){return b-a})

      var contribCntArraySorted=[]
      for(var k=0;k<cntSortArray.length;k++)
      {
           var sortIndex=cntSortArray[k]+""

           sortIndex=sortIndex.split(".")[1]
           var index="."+sortIndex
           index=+index*10000
           index=Math.round(index)
           if(isNaN(index))
           index=0

           ContribCntArraySorted.push(ContribCntArray[index])


      }


    clearContribToggle()
    contribAllCheck.checked = true

    ContribCheckArray =[]
    CheckedContribArray =[]
    //--clear previous contrib select---
    for(var k = contribTable.rows.length-1; k>=0; k--)
        contribTable.deleteRow(k)

        //contribSelectDiv.style.height = "1px"

        //ContribArray.sort()
     var heartCodes="*" //---add heart to contrib if adoptedBy---
     if(AdoptedBy.childNodes.length>0)
    {
        for(var k = 0; k<AdoptedBy.childNodes.length; k++)
         if(AdoptedBy.childNodes[k].getAttribute("ObsCode")&&AdoptedBy.childNodes[k].getAttribute("ObsCode")!="" )
           heartCodes+=AdoptedBy.childNodes[k].getAttribute("ObsCode")+"*"
    }

        var rowCnt = 0
    for(var k = 0; k<ContribCntArraySorted.length; k++)
    {
        var cntSort = ContribCntArraySorted[k] //---[cnted,contrib,"'"+cntBands+"'","'"+name+"'",,"'"+affil+"'",cntry]

        var bg = "#A6C9E6"
        var bgFactor = rowCnt*.5+""
        if(bgFactor.indexOf(".5")==-1)
            bg = "#64B2F1"

        var cnted = cntSort[0]
        var contrib = cntSort[1]
        var myBands = " : "+cntSort[2].replace(/'/g,"")
        var name = cntSort[3].replace(/'/g,"")

        var affil = cntSort[4]

        var cntry = cntSort[5]


        var row = contribTable.insertRow(rowCnt++)
         row.align="left" 
        row.style.backgroundColor = bg
        var radioCell = row.insertCell(0)
        radioCell.innerHTML = '<span style="border:1px solid black;border-radius:4px;background-color:darkorange" ><input id=highlightRadio'+contrib+' name="highlightRadio" onClick=highlightContrib("'+contrib+'");checkMyCheck("'+contrib+'")   title="Highlight this contributor observations" type="checkbox" /></span>'
        var contribCell = row.insertCell(1)

        contribCell.setAttribute("id", "contribCell"+contrib)
        contribCell.innerHTML = contrib+" ("+cnted+")"+myBands
        var checkCell = row.insertCell(2)
        checkCell.setAttribute("id", "checkCell"+contrib)
        checkCell.style.backgroundColor = bg
        checkCell.innerHTML = "<input type=checkbox checked id=contribCheck"+contrib+" onClick=contribCheckClicked('"+contrib+"') />"
        var nameCell = row.insertCell(3)
        nameCell.style.width = "20%"
        nameCell.style.fontSize = "110%"
        var cntryCell = row.insertCell(4)
        var affilCell = row.insertCell(5)
        affilCell.style.fontSize = "80%"

        var heart=""
        if(heartCodes.indexOf(contrib)!=-1)
            heart="<span title='Star Adopter' style=cursor:default;color:red>&hearts;</span>"
        nameCell.innerHTML = heart+name

        nameCell.setAttribute("id", "name"+contrib)
        cntryCell.innerHTML = cntry
        affilCell.innerHTML = affil

        ContribCheckArray.push(contrib)

        if(k<ContribCntArraySorted.length-1)
        {
             var cntSort = ContribCntArraySorted[k+1]

            var spacerCell = row.insertCell(6)
            spacerCell.style.backgroundColor = "#538BBA"
            spacerCell.style.width = "30px"

            var cnted = cntSort[0]
            var contrib = cntSort[1]
            var myBands = " : "+cntSort[2].replace(/'/g,"")
            var name = cntSort[3].replace(/'/g,"")

            var affil = cntSort[4]
            var cntry = cntSort[5]


            var radioCell = row.insertCell(7)
            radioCell.innerHTML = '<span style="border:1px solid black;border-radius:4px;background-color:darkorange"><input id=highlightRadio'+contrib+' name="highlightRadio" onClick=highlightContrib("'+contrib+'");checkMyCheck("'+contrib+'")  title="Highlight this contributor observations" type="checkbox" /></span>'

            var contribCell = row.insertCell(8)
            contribCell.setAttribute("id", "contribCell"+contrib)


            contribCell.innerHTML = contrib+" ("+cnted+")"+myBands

            var checkCell = row.insertCell(9)
            checkCell.setAttribute("id", "checkCell"+contrib)
            checkCell.style.backgroundColor = bg

            checkCell.innerHTML = "<input type=checkbox checked id=contribCheck"+contrib+" onClick=contribCheckClicked('"+contrib+"') />"
            var nameCell = row.insertCell(10)
            nameCell.style.width = "20%"
            nameCell.style.fontSize = "110%"

            var cntryCell = row.insertCell(11)
            var affilCell = row.insertCell(12)
            affilCell.style.fontSize = "80%"
                    var heart=""
                    if(heartCodes.indexOf(contrib)!=-1)
                        heart="<span title='Star Adopter'  style=cursor:default;color:red>&hearts;</span>"
                    nameCell.innerHTML = heart+name
                    nameCell.setAttribute("id", "name"+contrib)
                    cntryCell.innerHTML = cntry
                    affilCell.innerHTML = affil

            ContribCheckArray.push(contrib)
            k++
        }
    }
    contribSelectDiv.style.display = "block"



}

function contribAllCheckClicked()
{

    /*---Check box clicked---
        Called from:
           contribAllCheck @ index.htm
    */
    hidePointData()
    if(contribAllCheck.checked==true)
    {
        for(var k = 0; k<ContribCheckArray.length; k++)
        {
            var contrib = ContribCheckArray[k]
            var myCheck = document.getElementById("contribCheck"+contrib)
            myCheck.checked = true
        }
        PlotSVG.selectAll(".Points").attr("opacity", 1)
        .attr("pointer-events", "visible")
        //----clear toggle buttons---
        clearContribToggle()
        contribToggleDiv.style.visibility = 'hidden'
        var rows = contribToggleTable.rows
        for(var k = rows.length-1; k>=0; k--)
            contribToggleTable.deleteRow(k)

            for(j = 0; j<CheckedContribArray.length; j++)
        {
            var checkedContrib = CheckedContribArray[j][0]
            document.getElementById("checkCell"+checkedContrib).style.backgroundColor = CheckedContribArray[j][1]

        }
        contribCheckAPASS.checked=true
        CheckedContribArray =[]
    }
    else
    {
        for(var k = 0; k<ContribCheckArray.length; k++)
        {
            var contrib = ContribCheckArray[k]
            var myCheck = document.getElementById("contribCheck"+contrib)
            myCheck.checked = false
          if(document.getElementById("highlightRadio"+contrib).checked
            && contrib==PrevContribHighlight)
            {      document.getElementById("highlightRadio"+contrib).checked=false
                document.getElementById("contribCell"+contrib).style.backgroundColor = PrevContribBGcolor
                PrevContribHighlight=null
            }


        }
        PlotSVG.selectAll(".Points").attr("opacity", 0)
        .attr("pointer-events", "none")

        contribCheckAPASS.checked=false
        highlightRadioAPASS.checked=false
        contribCellAPASS.style.background=""
        //---remove highlignt symbols--
        for(var j=0;j<ContribHighlightArray.length;j++)
       {
           symbolPlotG.removeChild(ContribHighlightArray[j])
       }
        ContribHighlightArray=[]
    }

}

var CheckedContribArray =[]
function contribCheckClicked(contrib)
{
    /*---individual contributor check box clicked ---
        Called from:
           contribCheck+"ID" @ contribTable: index.htm

    */

    hidePointData()
    var points = PlotSVG.selectAll(".Points")[0]
    var myCheck = document.getElementById("contribCheck"+contrib)
    if(myCheck.checked==true)
    {
        if(contribAllCheck.checked==false)
        {
            var checkBg = document.getElementById("checkCell"+contrib).style.backgroundColor
            CheckedContribArray.push([contrib, checkBg])
            document.getElementById("checkCell"+contrib).style.backgroundColor = "black"
        }

        for(var k = 0; k<points.length; k++)
        {
            var point = points[k]

            if(point.getAttribute("by")==contrib)
            {
                point.setAttribute("opacity", 1)
                point.setAttribute("pointer-events", "visible")
            }
        }

        if(document.getElementById("toggleContribButton"+contrib))
        {
            document.getElementById("toggleContribButton"+contrib).style.borderStyle = "inset"
            document.getElementById("toggleContribButton"+contrib).style.display = "block"
        }

        else
            buildContribToggleButton(contrib)
    }
    else
    {

        for(j = 0; j<CheckedContribArray.length; j++)
        {
            var checkedContrib = CheckedContribArray[j][0]
            if(checkedContrib==contrib)
            {
                document.getElementById("checkCell"+contrib).style.backgroundColor = CheckedContribArray[j][1]
                CheckedContribArray.slice(j, 1)

                break;
            }
        }

        for(var k = 0; k<points.length; k++)
        {
            var point = points[k]

            if(point.getAttribute("by")==contrib)
            {
                point.setAttribute("opacity", 0)
                point.setAttribute("pointer-events", "none")

            }

        }

        if(document.getElementById("toggleContribButton"+contrib))
            document.getElementById("toggleContribButton"+contrib).style.display = "none"

    }

}

function buildContribToggleButton(contrib)
{
    /*---Create Toggle Button---
        Called from:
           contribCheckClicked @ 16_contributors.js
    */
     if(contribAllCheck.checked==false)
     {
            if(PrevContribHighlight
            &&PrevContribHighlight==contrib
            &&document.getElementById("toggleContribButton"+PrevContribHighlight)
            )
                document.getElementById("toggleContribButton"+PrevContribHighlight).style.borderColor = ""

                contribToggleDiv.style.visibility = 'visible'
                var rows = contribToggleTable.rows
                //---dont duplicate---
            if(!document.getElementById("toggleContribButton"+contrib))
            {
                var rowCnt = rows.length
                var row = contribToggleTable.insertRow(rowCnt++)
                row.align = "center"
                var buttonCell = row.insertCell(0)
                buttonCell.title = "Toggle contributor's symbols on/off"
                if(PrevContribHighlight==contrib)
                    var border = "border-color:darkorange;"
                    else
                        var border = ""

                buttonCell.innerHTML = "<button id=toggleContribButton"+contrib+"  style='"+border+"background-color:#A6C9E6;border-radius:3px;border-style:inset;border-width:3px' onClick=toggleContrib('"+contrib+"')>"+contrib+"</button>"
            }
      }
}

function toggleContrib(contrib)
{
    /*---Hide/Show contrib symbols---
        Called from:
            toggleContribButton+"ID" @ contribToggleTable : index.htm
    */


    var points = PlotSVG.selectAll(".Points")[0]

    var button = document.getElementById("toggleContribButton"+contrib)
    if(button.style.borderStyle=="inset")
    {
        for(var k = 0; k<points.length; k++)
        {
            var point = points[k]

            if(point.getAttribute("by")==contrib||point.getAttribute("by")==contrib+"_highlight")
            {
                point.setAttribute("opacity", 0)
                point.setAttribute("pointer-events", "none")

            }

        }
        button.style.opacity = ".6"
        button.style.borderStyle = "outset"
    }
    else
    {
        for(var k = 0; k<points.length; k++)
        {
            var point = points[k]

            if(point.getAttribute("by")==contrib)
            {
                point.setAttribute("opacity", 1)
                point.setAttribute("pointer-events", "visible")
            }
            else if(point.getAttribute("by")==contrib+"_highlight")
            {
                point.setAttribute("opacity", 1)
                //point.setAttribute("pointer-events", "visible")
            }


        }

        button.style.borderStyle = "inset"
                button.style.opacity = "1"

    }

}

function clearContribToggle()
{
    /*---remove all toggle buttons---
        Called from:
           buildContribSelect @ 16_contributors.js
           contribAllCheckClicked @ 16_contributors.js
    */
    contribToggleDiv.style.visibility = 'hidden'
    var rows = contribToggleTable.rows
    for(var k = rows.length-1; k>=0; k--)
        contribToggleTable.deleteRow(k)

}
var PrevContribHighlight
var PrevContribBGcolor
var ContribHighlightArray=[]
function highlightContrib(contrib)
{
    /*---Hightlight this contrib's symbols---
        Called from:
           highlightRadio+"ID" @ contribTable : index.htm
           highlightRadioApass @ index.htm
    */
    //---build contrib symbols----

    if(PrevContribHighlight
    &&document.getElementById("toggleContribButton"+PrevContribHighlight)
    )
    {
        document.getElementById("toggleContribButton"+PrevContribHighlight).style.borderColor = ""
    }
    if(PrevContribHighlight)
    {
        document.getElementById("highlightRadio"+PrevContribHighlight).checked=false
        document.getElementById("contribCell"+PrevContribHighlight).style.backgroundColor = PrevContribBGcolor
        for(var j=0;j<ContribHighlightArray.length;j++)
        {
            symbolPlotG.removeChild(ContribHighlightArray[j])
        }
        ContribHighlightArray=[]
    }

    if(document.getElementById("highlightRadio"+contrib).checked==false
    && contrib==PrevContribHighlight)
    {
        document.getElementById("contribCell"+contrib).style.backgroundColor = PrevContribBGcolor
        PrevContribHighlight=null
    }
    else
    {
       for(var j=0;j<ContribHighlightArray.length;j++)
       {
           symbolPlotG.removeChild(ContribHighlightArray[j])
       }
        ContribHighlightArray=[]
        PrevContribHighlight = contrib
        PrevContribBGcolor = document.getElementById("contribCell"+contrib).style.backgroundColor
        var points = PlotSVG.selectAll(".Points")[0]
        var contribHighlightCnt=points.length-1

        for(var k = 0; k<points.length; k++)
        {
            var point = points[k]
            //---do not place highlight on hidden bands--
           var band=point.getAttribute("band")
           var faint=point.getAttribute("faint")
           var check = document.getElementById("band"+band+"Check")
           if(check.checked==true)
            if(point.getAttribute("by")==contrib)  //--highlight symbol--
            {
                var id="contribHighlight"+contribHighlightCnt++
                var contribHighlight=contribSymbol.cloneNode(true)
                contribHighlight.setAttribute("id",id)
                contribHighlight.setAttribute("class","Points")
                contribHighlight.setAttribute("band",band)
                contribHighlight.setAttribute("faint",faint)
                contribHighlight.setAttribute("dataLoc",contribHighlightCnt)
                contribHighlight.setAttribute("by",point.getAttribute("by")+"_highlight")
                var dataLoc=+point.getAttribute("dataLoc")
                Data[contribHighlightCnt]={mag:Data[dataLoc].mag,time:Data[dataLoc].time,JD:Data[dataLoc].JD}
                contribHighlight.setAttribute("transform",point.getAttribute("transform"))
                ContribHighlightArray.push(contribHighlight)
                symbolPlotG.appendChild(contribHighlight)

            }
        }

        document.getElementById("contribCell"+contrib).style.backgroundColor = "darkorange"
        if(document.getElementById("toggleContribButton"+PrevContribHighlight))
            document.getElementById("toggleContribButton"+PrevContribHighlight).style.borderColor = "darkorange"
    }
}

//---if highlight checked and myCheck no checked---
function checkMyCheck(contrib)
{
    var myCheck = document.getElementById("contribCheck"+contrib)
    if(myCheck.checked==false)
    {    var points = PlotSVG.selectAll(".Points")[0]
        for(var k = 0; k<points.length; k++)
        {
            var point = points[k]

            if(point.getAttribute("by")==contrib)
            {
                point.setAttribute("opacity", 1)
                point.setAttribute("pointer-events", "visible")
            }
        }
        myCheck.checked=true

    }

}
