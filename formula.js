for (let i = 0; i < allCells.length; i++) {
    //to save the user entered value into db for later use
    allCells[i].addEventListener("blur",function(){
        let data=allCells[i].innerText;
        let address=addressInput.value;
        let {rid,cid}=getRIDCIDfromAddress(address);
        let cellObject = sheetDb[rid][cid];
        //to check if the value in the cell is same as value present in DB
        if (cellObject.value ==data) {
            return;
        }
        //if value is entered manually later then the formula has to be removed from  DB
        if(cellObject.formula){
            removeFormula(cellObject,address);
            formulaBar.value="";
        }
        //assign the manual value into DB
        cellObject.value=data;
        // if you are updating your value then  
        // someone may have included you in there formula so you need to tell them to evaluate there value
        updateChildren(cellObject);
    })
    
}

//function to remove parents from the children
function removeFormula(cellObj,myName){
    //get parents name by splitting the formula 
    let formula=cellObj.formula;
    let formulaTokens=formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDb[rid][cid];
            //removing children names from their parent's children array
            let idx=parentObj.children.indexOf(myName);
            parentObj.children.splice(idx,1);
    }
 }
 cellObj.formula="";
}


formulaBar.addEventListener("keydown",function(e){
    if(e.key=="Enter" && formulaBar.value){
        //user input formula
        let cFormula=formulaBar.value;
        //formulaBar.value="";
        let address=addressInput.value;
        let {rid,cid}=getRIDCIDfromAddress(address);
        let cellObj=sheetDb[rid][cid];

        //if new formula is entered then followings need to be updated
        if(cFormula !=cellObj.formula){
            removeFormula(cellObj,address);
        }
        //get value from the new formula
        let value=evaluateFormula(cFormula);
         // jis cell ke liye formula apply kar rhe hai (address bar wala cell)
        //  ui-> value update
        // ,db-> value,formula update 
        setCell(value,cFormula);
         //    formula is equation -> hold true
        // formula cell -> cell object -> name add
        //the cell need to be added into the children array of parents(from cFormula)
        setParentCHArray(cFormula,address);
    }
})

function evaluateFormula(formula){
    let formulaTokens=formula.split(" ");
    for(let i=0;i<formulaTokens.length;i++){
        let ascii = formulaTokens[i].charCodeAt(0);
        if(ascii>=65 && ascii<=90){
            let {rid,cid}=getRIDCIDfromAddress(formulaTokens[i]);
            let value=sheetDb[rid][cid].value;
            if(value==""){
                value=0;
            }
            formulaTokens[i]=value;
        }
    }
    let evaluatedFormula=formulaTokens.join(" ");
    return eval(evaluatedFormula);
}

function setCell(value,formula){
    let uiCellElement=getUICellElement();
    uiCellElement.innerText=value;
    //DB update
    let {rid,cid}=getRIDCIDfromAddress(addressInput.value);
    sheetDb[rid][cid].value=value;
    sheetDb[rid][cid].formula=formula;
}

function setParentCHArray(formula,chAddress){
    let formulaTokens=formula.split(" ");
    for(let i=0;i<formulaTokens.length;i++){
        let ascii = formulaTokens[i].charCodeAt(0);
        if(ascii>=65 && ascii<=90){
            let {rid,cid}=getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj=sheetDb[rid][cid];
            parentObj.children.push(chAddress);
        }
    }
}

function updateChildren(cellObj){
    let children=cellObj.children;
    for (let i = 0; i < children.length; i++) {
        // children name
        let chAddress=children[i];
        let {rid,cid}=getRIDCIDfromAddress(chAddress);
        childObj=sheetDb[rid][cid];
        // get formula of children
        let chFormula=childObj.formula;
        let newValue=evaluateFormula(chFormula);
        SetChildrenCell(newValue, chFormula, rid, cid);
        // if you are updating your value then  
        // someone may have included you in there formula so you need to tell them to evaluate there value
        updateChildren(childObj);
        
    }
}

function SetChildrenCell(value, formula, rid, cid) {
    // let uicellElem = findUICellElement();
    // db update 
    let uiCellElement =
    document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText = value;
    sheetDb[rid][cid].value = value;
    sheetDb[rid][cid].formula = formula;
}



function getUICellElement(){
    let address=addressInput.value;
    let ridcidObj=getRIDCIDfromAddress(address);
    let rid=ridcidObj.rid;
    let cid=ridcidObj.cid;
    let uiCellElement=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    return uiCellElement;
}

function getRIDCIDfromAddress(address){
    let cid=Number(address.charCodeAt(0))-65;
    let rid=Number(address.slice(1))-1;
    return {rid,cid};
}