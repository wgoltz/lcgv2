// define some index names to maybe make it easier to see what is going on
const sortBy = {
    CONTRIB: 0, // alphabetic sort by contrib
    COUNT: 1    // sort by total number of observations by that contrib
}

// array of cells in contrib table
var ContribCellsArray
// names for individual elements of ContribCellsArray
const cellElement = {
    CONTRIB : 0,
    CNTED : 1,
    BAND : 2,
    NAME : 3,
    AFFIL : 4,
    CNTRY : 5,
    BG : 6
}

// names for individual elements of ContribArray (declared in buildData)
const contribElement = {
    CONTRIB : 0,
    NAME : 1,
    CNTRY : 2,
    AFFIL : 3,
    BAND : 4
}

// cross reference for alphabetic/count sorted ContribArray positions
var IndexArray
const indexElement = {
    CONTRIB : 0,
    COUNT : 1,
    POSITION : 2
}

// prototype to find a contributor
// contrib is at index 0 in all the arrays
// .. return the item
Array.prototype.findContrib = function(contrib) {
    var t = Object(this)
    for(var i = 0; i < t.length; i++)
        if(t[i][0] == contrib)
            return t[i]
    return null
}
// .. return the index
Array.prototype.findContribIndex = function(contrib) {
    var t = Object(this)
    for(var i = 0; i < t.length; i++)
        if(t[i][0] == contrib)
            return i
    return null
}

// called when sortContribSelect is changed
function sortContribSelected()
{
    buildContribTable(sortContribSelect.selectedIndex)
}

// build contribTable with contribs sorted alphabetically
function buildContribSelect()
{
    ContribCellsArray = null
    buildContribTable(sortBy.CONTRIB)
}

// array of contrib's that are checked in contribTable
var ContribChecked=[]

// track background color
var BG

var HeartCodes


// build contribTable sorted alphabetically or by contrib count
function buildContribTable(sortby)
{
    if(Mobile==false)
    {
        apassContribDiv.style.visibility="hidden"

        if(ContribCellsArray == null) // initialize
        {
            // setup HeartCodes
            HeartCodes="*" //---add heart to contrib if adoptedBy---
            if(AdoptedBy.childNodes.length>0)
            {
                for(var k = 0; k<AdoptedBy.childNodes.length; k++)
                    if(AdoptedBy.childNodes[k].getAttribute("ObsCode")&&AdoptedBy.childNodes[k].getAttribute("ObsCode")!="" )
                        HeartCodes+=AdoptedBy.childNodes[k].getAttribute("ObsCode")+"*"
            }

            var selectedContribs = Contribs.split(",").sort()
            var selectedContrib = selectedContribs[0]

            ContribArray.sort() // sort alphabetically by contrib

            ContribCellsArray = []
            IndexArray = []

            var lastContrib
            for(var i=0, j=0, k=0; j<ContribArray.length; j++)
            {
                var contrib = ContribArray[j][0]

                while(contrib > selectedContrib)
                    selectedContrib = selectedContribs[k++]

                if(lastContrib == contrib)
                    continue

                var name = ContribArray[j][contribElement.NAME]
                var cntry = ContribArray[j][contribElement.CNTRY]
                var affil = ContribArray[j][contribElement.AFFIL]
                var cnted = cntContrib(j, contrib)
                var cntBands=bandCntContrib(j, contrib)

                // create ContribCellsArray
                // (from which table is constructed)
                ContribCellsArray.push([contrib,cnted,cntBands,name,affil,cntry,null])

                // create IndexArray
                // (sort index array by contrib or cnted: third element is position in ContribArray)
                IndexArray.push([contrib, cnted, i++])

                lastContrib = contrib
            }
        }

        // sort IndexArray
        switch (sortby)
        {
        case sortBy.CONTRIB: // TODO: probably could skip this first time around as already sorted
            IndexArray.sort(function(a,b) { return a[indexElement.POSITION]-b[indexElement.POSITION] })
            break
        case sortBy.COUNT:
            IndexArray.sort(function(a,b) { return b[indexElement.COUNT]-a[indexElement.COUNT] })
            break
        }

        // clear old contribTable
        if(contribTable.rows.length > 0) //--clear previous contrib select---
            for(var k = contribTable.rows.length-1; k>=0; k--)
                contribTable.deleteRow(k)

        buildTableRows()

        setContribChecked()

        contribSelectDiv.style.display = "block"

        openDiv('contribSelectDiv')
    }
}

// subfunction of buildContribTable:
// from ContribArray (which is sorted alphabetically by contrib) count observations by contrib
// (istart is start position in ContribArray for this contrib)
function cntContrib(istart, contrib)
{
    var cnt = 0;
    for (var i = istart; i < ContribArray.length; i++)
        if (ContribArray[i][contribElement.CONTRIB] == contrib)
            cnt++
        else
            break
    return cnt
}

// subfunction of buildContribTable:
// from ContribArray (which is sorted alphabetically by contrib) make bands list string for contrib
// (istart is start position in ContribArray for this contrib)
function bandCntContrib(istart, contrib)
{
    var myBands =[]
    for (var i = istart; i < ContribArray.length; i++)
    {
        if (ContribArray[i][contribElement.CONTRIB] == contrib)
        {
            var contribBand = ContribArray[i][contribElement.BAND]
            if(myBands.toString().indexOf(contribBand)==-1)
                myBands.push(contribBand)
        }
        else
            break
    }
    var re=/@/g
    return myBands.toString().replace(re,"")
}

// subfunction of buildContribTable:
// progressively build contribTable, as rows split into two columns, alternating background colours between rows
function buildTableRows()
{
    var rowCnt = 0
    var length = ContribCellsArray.length
    for(var k = 0; k<length; k++)
    {
        // alternate bg color between rows
        BG = (rowCnt % 2) ? "#A6C9E6" : "#64B2F1"

        var row = contribTable.insertRow(rowCnt++)
        row.align="left"
        row.style.backgroundColor = BG

        var cell = 0

        // create two columns
        for(var i=0; i<2 && k<length; i++)
        {
            var ik = IndexArray[k][indexElement.POSITION]
            var contribCells = ContribCellsArray[ik]
            contribCells[cellElement.BG] = BG

            if (i % 2 == 0) // left column
                k++
            else // right column, add a spacer
            {
                var spacerCell = row.insertCell(cell++)
                spacerCell.style.backgroundColor = "#538BBA"
                spacerCell.style.width = "30px"
            }

            cell = buildRowCells(row, cell, contribCells)

            var contrib = contribCells[cellElement.CONTRIB]
            var contribCheck = document.getElementById("contribCheck"+contrib)
            var contribToggle = document.getElementById("contribToggleButton"+contrib)
            var contribPoints = SymbolG.selectAll(".Points."+contrib)
        }
    }
}

// subfunction of buildTable:
// build contribTable row cells, starting at cell, using element from ContribCellsArray
// returns the next cell position to continue the process with the next contrib
function buildRowCells(row, cell, contribCells)
{
    var contrib = contribCells[cellElement.CONTRIB]

    var radioCell = row.insertCell(cell++)
    radioCell.innerHTML = '<span style="border:1px solid black;border-radius:4px;background-color:darkorange"><input id=highlightRadio'+contrib+' name="highlightRadio" onClick=highlightContrib("'+contrib+'");checkMyCheck("'+contrib+'")  title="Highlight this contributor observations" type="checkbox" /></span>'

    var thisCell = row.insertCell(cell++)
    thisCell.setAttribute("id", "contribCell"+contrib)
    if(ShowMostRecentOb==true)
    {
        MostRecentOb = symbolPlotG.lastChild
        if(MostRecentOb.getAttribute("by")==contrib)
            thisCell.style.backgroundColor = "linen"
    }
    var cnted = contribCells[cellElement.CNTED]
    var cntBands = contribCells[cellElement.BAND]
    thisCell.innerHTML = contrib+" ("+cnted+") : "+cntBands

    thisCell = row.insertCell(cell++)
    thisCell.setAttribute("id", "checkCell"+contrib)
    thisCell.style.backgroundColor = BG
    if(contribAllCheck.checked)
        var checked = "checked"
    else
        var checked = (ContribChecked.findContrib("contrib") != null) ? "checked" : ""
    thisCell.innerHTML = "<input type=checkbox "+checked+" id=contribCheck"+contrib+" onClick=contribCheckClicked('"+contrib+"') />"

    thisCell = row.insertCell(cell++)
    thisCell.style.width = "20%"
    thisCell.style.fontSize = "110%"
    var heart=(HeartCodes.indexOf(contrib)!=-1) ? "<span title='Star Adopter'  style=cursor:default;color:red>&hearts;</span>" : ""
    var name = contribCells[cellElement.NAME]
    thisCell.innerHTML = heart+name
    thisCell.setAttribute("id", "name"+contrib)

    thisCell = row.insertCell(cell++)
    var cntry = contribCells[cellElement.CNTRY]
    thisCell.innerHTML = cntry

    thisCell = row.insertCell(cell++)
    thisCell.style.fontSize = "80%"
    var affil = contribCells[cellElement.AFFIL]
    thisCell.innerHTML = affil

    return cell
}


function setContribChecked()
{
    ContribChecked = []
    if(contribAllCheck.checked)
        for(var k = 0; k<ContribCellsArray.length; k++)
        {
            var contrib = ContribCellsArray[k][contribElement.CONTRIB]
            document.getElementById("contribCheck"+contrib).checked = true
            ContribChecked.push([contrib])
        }
}

function contribAllCheckClicked()
{

    /*---Check box clicked---
        Called from:
           contribAllCheck @ index.htm
    */

    hidePointData()

    if(contribAllCheck.checked)
    {
        PlotSVG.selectAll(".Points")
        .classed("selected", true)
        .attr("opacity", 1)

        //----clear toggle buttons---

        clearContribToggle()
        contribToggleDiv.style.visibility = 'hidden'

        var rows = contribToggleTable.rows
        for(var k = rows.length-1; k>=0; k--)
            contribToggleTable.deleteRow(k)

        for(j = 0; j<ContribCellsArray.length; j++)
        {
            var contribCell = ContribCellsArray[j]
            document.getElementById("checkCell"+contribCell[cellElement.CONTRIB]).style.backgroundColor = contribCell[cellElement.BG]
        }
        contribCheckAPASS.checked=true

        if(MeanActive)
            setMeanBin()
    }
    else
    {
        for(var k = 0; k<ContribCellsArray.length; k++)
        {
            var contrib = ContribCellsArray[k][contribElement.CONTRIB]

            document.getElementById("contribCheck"+contrib).checked = false

            var contribRadio = document.getElementById("highlightRadio"+contrib)
            if(contribRadio.checked && contrib==PrevContribHighlight)
            {
                contribRadio.checked=false
                document.getElementById("contribCell"+contrib).style.backgroundColor = PrevContribBGcolor
                PrevContribHighlight=null
            }
        }

        //---remove highlignt symbols--
        // (and restore points)
        var node = symbolPlotG.childNodes
        for(var j=0;j<ContribHighlightArray.length;j++)
        {
            var newNode = ContribHighlightArray[j]
            var index = newNode.getAttribute("dataLoc")
            symbolPlotG.replaceChild(newNode, node.item(index))
        }
        ContribHighlightArray=[]

        PlotSVG.selectAll(".Points")
        .classed("selected", false)

        contribCheckAPASS.checked=false
        highlightRadioAPASS.checked=false
        contribCellAPASS.style.background=""

        if(MeanActive)
            setMeanBin()
    }

    setContribChecked()

    displayPoints()
}

function contribCheckClicked(contrib)
{
    /*---individual contributor check box clicked ---
        Called from:
           contribCheck+"ID" @ contribTable: index.htm

    */

    hidePointData()

    var contribCell = ContribCellsArray.findContrib(contrib)
    var contribCheck = document.getElementById("contribCheck"+contrib)
    if(contribCheck.checked)
    {        
//        if(contribAllCheck.checked==false)
//        {
            var contribCheckCell = document.getElementById("checkCell"+contrib)
            contribCell[cellElement.BG] = contribCheckCell.style.backgroundColor
            contribCheckCell.style.backgroundColor = "black"

            if(ContribChecked.findContrib(contrib)==null)
                ContribChecked.push([contrib])

            var bands = contribCell[cellElement.BAND].split(",")
            for(var i = 0; i < bands.length; i++)
            {
                var band = bands[i]
                if ((document.getElementById("band"+band+"Check").checked))
                    SymbolG.selectAll(".Points."+contrib+"."+band)
                    .attr("opacity", 1)
                    .attr("pointer-events", "visible")
                    .classed("selected", true)

                SymbolG.selectAll(".Points.faint."+contrib+"."+band)
                .classed("showFaint", document.getElementById("bandFaintCheck").checked)
            }
//        }

        var contribToggle = document.getElementById("toggleContribButton"+contrib)
        if(contribToggle)
        {
            contribToggle.style.borderStyle = "inset"
            contribToggle.style.display = "block"
            contribToggle.style.opacity = 1
        }

        else
            buildContribToggleButton(contrib)
    }
    else
    {
        document.getElementById("checkCell"+contrib).style.backgroundColor = contribCell[cellElement.BG]

        var i = ContribChecked.findContribIndex(contrib)
        if (i != null)
            ContribChecked.splice(i, 1)

        SymbolG.selectAll(".Points."+contrib)
        .classed("selected", false)

        var contribToggle = document.getElementById("toggleContribButton"+contrib)
        if(contribToggle)
            contribToggle.style.display = "none"
    }

    displayPoints()

    if(MeanActive)
        setMeanBin()

}

function buildContribToggleButton(contrib)
{
    /*---Create Toggle Button---
        Called from:
           contribCheckClicked @ 16_contributors.js
    */
    if(contribAllCheck.checked==false)
    {
        var contribToggle = document.getElementById("toggleContribButton"+contrib)
        if(PrevContribHighlight && (PrevContribHighlight==contrib) && contribToggle)
            contribToggle.style.borderColor = ""

        contribToggleDiv.style.visibility = 'visible'
        var rows = contribToggleTable.rows
        //---dont duplicate---
        if(! contribToggle)
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

function selectContrib(contrib, show)
{
    var bands = ContribCellsArray.findContrib(contrib)[cellElement.BAND].split(",")
    for(var i = 0; i < bands.length; i++)
    {
        var band = bands[i]
        if ((document.getElementById("band"+band+"Check").checked))
            SymbolG.selectAll(".Points."+contrib+"."+band)
            .attr("opacity", (show) ? 1 : 0.1)
            .attr("pointer-events", (show) ? "visible" : "none")
    }
    displayPoints()
}

function toggleContrib(contrib)
{
    /*---Hide/Show contrib symbols---
        Called from:
            toggleContribButton+"ID" @ contribToggleTable : index.htm
    */

    var button = document.getElementById("toggleContribButton"+contrib)
    var show = (button.style.borderStyle=="outset")

    selectContrib(contrib, show)

    button.style.opacity = (show) ? "1" : ".6"
    button.style.borderStyle = (show) ? "inset" : "outset"

    displayPoints()
    if(MeanActive)
        setMeanBin()
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

    var toggleButton = document.getElementById("toggleContribButton"+PrevContribHighlight)
    if(PrevContribHighlight && toggleButton)
        toggleButton.style.borderColor = ""

    if(PrevContribHighlight)
    {
        document.getElementById("highlightRadio"+PrevContribHighlight).checked=false
        document.getElementById("contribCell"+PrevContribHighlight).style.backgroundColor = PrevContribBGcolor

        // restore points from ContribHighlightArray
        var node = symbolPlotG.childNodes
        for(var j=0;j<ContribHighlightArray.length;j++)
        {
            var newNode = ContribHighlightArray[j]
            var index = newNode.getAttribute("dataLoc")
            symbolPlotG.replaceChild(newNode, node.item(index))
        }
        ContribHighlightArray=[]
    }

    if(document.getElementById("highlightRadio"+contrib).checked==false && contrib==PrevContribHighlight)
    {
        document.getElementById("contribCell"+contrib)
        .style.backgroundColor = PrevContribBGcolor
        PrevContribHighlight=null
    }
    else
    {
        // restore points from ContribHighlightArray
        var node = symbolPlotG.childNodes
        for(var j=0;j<ContribHighlightArray.length;j++)
        {
            var newNode = ContribHighlightArray[j]
            var index = newNode.getAttribute("dataLoc")
            symbolPlotG.replaceChild(newNode, node.item(index))
        }
        ContribHighlightArray=[]

        PrevContribHighlight = contrib
        PrevContribBGcolor = document.getElementById("contribCell"+contrib).style.backgroundColor

        // create ContribHighlightArray from points and replace points with highlight symbol
        var contribCell = ContribCellsArray.findContrib(contrib)
        var bands = contribCell[cellElement.BAND].split(",")
        for(var i = 0; i < bands.length; i++)
        {
            var band = bands[i]
            if ((document.getElementById("band"+band+"Check").checked))
            {
                SymbolG.selectAll(".Points."+contrib+"."+band)
                .classed("selected", true)

                var points = SymbolG.selectAll(".Points."+contrib+"."+band)[0]
                var node = symbolPlotG.childNodes

                for(var k = 0; k<points.length; k++)
                {
                    var point = points[k]
                    var index = point.getAttribute("dataLoc")

                    var newNode=contribSymbol.cloneNode(true)

                    newNode.setAttribute("dataLoc",index)
                    newNode.setAttribute("id", point.getAttribute("id"))
                    newNode.setAttribute("class",point.getAttribute("class")+" highlighted")
                    newNode.setAttribute("band",point.getAttribute("band"))
                    newNode.setAttribute("faint",point.getAttribute("faint"))
                    newNode.setAttribute("by",point.getAttribute("by"))
                    newNode.setAttribute("xValTop",point.getAttribute("xValTop"))
                    newNode.setAttribute("xVal",point.getAttribute("xVal"))
                    newNode.setAttribute("yVal",point.getAttribute("yVal"))
                    newNode.setAttribute("uncert",point.getAttribute("uncert"))
                    newNode.setAttribute("transform",point.getAttribute("transform"))

                    ContribHighlightArray.push(symbolPlotG.replaceChild(newNode,node.item(index)))
                }
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
    {
//        var points = PlotSVG.selectAll(".Points."+contrib)[0]
//        for(var k = 0; k<points.length; k++)
//        {
//            var point = points[k]
//            point.setAttribute("opacity", 1)
//            point.setAttribute("pointer-events", "visible")
//        }
        PlotSVG.selectAll(".Points."+contrib)
        .attr("opacity", 1)
        .attr("pointer-events", "visible")

        myCheck.checked=true

        displayPoints()
    }
}
