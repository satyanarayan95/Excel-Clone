let leftCol=document.querySelector(".left_col");
let topRow=document.querySelector(".top_row");
let grid=document.querySelector(".grid");
let addressInput=document.querySelector(".address-input");
let boldBtn=document.querySelector(".bold");
let italicBtn=document.querySelector(".Italic");
let underlineBtn=document.querySelector(".underline");
let formulaBar=document.querySelector(".formula-input");
let alignBtns = document.querySelectorAll(".align-container>*");
let fontSizeElem = document.querySelector(".font-size");
let rows=100;
let col=26;

//left col
for(let i=0;i<rows;i++){
    let colBox=document.createElement("div");
    colBox.innerText=i+1;
    colBox.setAttribute("class","cell");
    leftCol.appendChild(colBox);
}
//top row
for(let i=0;i<col;i++){
    let cell=document.createElement("div");
    cell.innerText=String.fromCharCode(65 + i);
    cell.setAttribute("class","cell");
    topRow.appendChild(cell);
}

let btnContainer=document.querySelector(".add-sheet_btn-container");
let sheetList=document.querySelector(".sheets-list");
let firstSheet=document.querySelector(".sheet");
let sheetArray=[];
let sheetDb;
for(let i=0;i<rows;i++){
    let row=document.createElement("div");
    row.setAttribute("class","row");
    for(let j=0;j<col;j++){
        let cell=document.createElement("div");
        //cell.innerText=` ${i+1} ${String.fromCharCode(65 + j)}`;
        cell.setAttribute("class","cell");
        cell.setAttribute("rid",i);
        cell.setAttribute("cid",j);
        row.appendChild(cell); 
        cell.addEventListener("click",()=>{
            cell.contentEditable = "true";
            addressInput.setAttribute("value",`${String.fromCharCode(65 + j)}${i+1}`);
            let cellObj=sheetDb[i][j];
            if(cellObj.bold=="normal"){
                boldBtn.classList.remove("active-btn");
            }
            else{
                boldBtn.classList.add("active-btn");
            }
            if(cellObj.italic=="normal"){
                italicBtn.classList.remove("active-btn");
            }
            else{
                italicBtn.classList.add("active-btn");
            }
            if(cellObj.underline=="none"){
                underlineBtn.classList.remove("active-btn");
            }
            else{
                underlineBtn.classList.add("active-btn");
            }
            if (cellObj.formula) {
                formulaBar.value = cellObj.formula;
            } else {
                formulaBar.value = "";
            }
        }); 
    }
    grid.appendChild(row);
}

// *********formatting******
// Horizontal alignment
for (let i = 0; i < alignBtns.length; i++) {
    alignBtns[i].addEventListener("click", function () {
        let alignment = alignBtns[i].getAttribute("class");
        let uiCellElement = findUICellElement();
        uiCellElement.style.textAlign = alignment;
    })
}
// font-size
fontSizeElem.addEventListener("change", function () {
    let val = fontSizeElem.value;
    let uiCellElement = findUICellElement();
    uiCellElement.style.fontSize = val + "px";
})

//to make firstSheet active
firstSheet.addEventListener("click",makeMeActive);
firstSheet.click();
btnContainer.addEventListener("click",()=>{
    //creating new sheet
    let allSheets=document.querySelectorAll(".sheet");
    let lastSheet=allSheets[allSheets.length - 1];
    let lastIdx=lastSheet.getAttribute("idx");
    lastIdx=Number(lastIdx);
    //creating a new Sheet in the UI
    let newSheet=document.createElement("div");
    newSheet.setAttribute("class","sheet");
    newSheet.setAttribute("idx",`${lastIdx+1}`);
    newSheet.innerText=`sheet ${lastIdx+2}`;
    sheetList.appendChild(newSheet);

    for(let i=0;i<allSheets.length;i++){
        allSheets[i].classList.remove("active");
    }
    newSheet.classList.add("active");

    //create a newSheet(newDBsheet) in the DB which will b attached to sheetArray
    createSheet();
    //pointing newDb to sheetDb which is the name for working of the DB ,all the function and command are written on name sheetDb 
    sheetDb=sheetArray[lastIdx+1];
    newSheet.addEventListener("click",makeMeActive);
})

function makeMeActive(e){
    let sheet=e.currentTarget;
    let allSheets=document.querySelectorAll(".sheet");
    for(let i=0;i<allSheets.length;i++){
        allSheets[i].classList.remove("active");
    }
   sheet.classList.add("active");
   let idx = sheet.getAttribute("idx");
    if (!sheetArray[idx]) {
        // only when you init the workbook
        createSheet();
    }
    // current set 
    sheetDb = sheetArray[idx];
    setUI();
}

function createSheet(){
    let newDB=[];
    for(let i=0;i<rows;i++){
        let row=[];
        for(let j=0;j<col;j++){
            let cell={
                bold:"normal",
                italic:"normal",
                underline:"none",
                hAlign:"center",
                fontFamily:"sans-serif",
                fontSize:"16",
                color:"black",
                bColor:"none",
                value: "",
                formula: "",
                children: []
            }
            //select all the cell using rid cid and clearing their value(it will only clear the UI , no change in db)
            let elem = document.querySelector(`.grid .cell[rid='${i}'][cid='${j}']`);
                elem.innerText = "";
            row.push(cell);
        }
        newDB.push(row);
    }
    sheetArray.push(newDB);
}
//in the function , for each cell the data is fetched from DB and put them in cell for UI
function setUI() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < col; j++) {
            let elem = 
            document.querySelector(`.grid .cell[rid='${i}'][cid='${j}']`);
            let value = sheetDb[i][j].value;
            elem.innerText = value;
        }
    }
}

// *********formatting******
// Horizontal alignment
for (let i = 0; i < alignBtns.length; i++) {
    alignBtns[i].addEventListener("click", function () {
        let alignment = alignBtns[i].getAttribute("class");
        let uiCellElement = getUICellElement();
        uiCellElement.style.textAlign = alignment;
    })
}
// font-size
fontSizeElem.addEventListener("change", function () {
    let val = fontSizeElem.value;
    let uiCellElement = getUICellElement();
    uiCellElement.style.fontSize = val + "px";
})


boldBtn.addEventListener("click",()=>{
    
    let uiCell=getUICellElement();
    let cid=uiCell.getAttribute("cid");
    let rid=uiCell.getAttribute("rid");
    let cellObj=sheetDb[rid][cid];
    if(cellObj.bold=="normal"){
        uiCell.style.fontWeight="bold";
        boldBtn.classList.add("active-btn");
        cellObj.bold="bold";
    }
    else{
        uiCell.style.fontWeight="normal";
        boldBtn.classList.remove("active-btn");
        cellObj.bold="normal";

    }
})
italicBtn.addEventListener("click",()=>{
    
    let uiCell=getUICellElement();
    let cid=uiCell.getAttribute("cid");
    let rid=uiCell.getAttribute("rid");
    let cellObj=sheetDb[rid][cid];
    if(cellObj.italic=="normal"){
        uiCell.style.fontStyle="italic";
        italicBtn.classList.add("active-btn");
        cellObj.italic="italic";
    }
    else{
        uiCell.style.fontStyle="normal";
        boldBtn.classList.remove("active-btn");
        cellObj.italic="normal";

    }
})
underlineBtn.addEventListener("click",()=>{
    
    let uiCell=getUICellElement();
    let cid=uiCell.getAttribute("cid");
    let rid=uiCell.getAttribute("rid");
    let cellObj=sheetDb[rid][cid];
    if(cellObj.underline=="none"){
        uiCell.style.textDecoration="underline";
        underlineBtn.classList.add("active-btn");
        cellObj.underline="underline";
    }
    else{
        uiCell.style.textDecoration="none";
        underlineBtn.classList.remove("active-btn");
        cellObj.underline="none";

    }
})


let allCells=document.querySelectorAll(".grid .cell");

allCells[0].click();

