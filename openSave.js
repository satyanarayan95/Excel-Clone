let save=document.querySelector(".save");
let openFile=document.querySelector(".open-file");

save.addEventListener("click",()=>{
    const blobConfig = new Blob(
        [ JSON.stringify(sheetDb) ], 
        { type: 'application/json' }
    )
    
    // Convert Blob to URL
    const blobUrl = URL.createObjectURL(blobConfig);
    
    // Create an a element with blobl URL
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.target = "_blank";
    anchor.download = "file.json";
    
    // Auto click on a element, trigger the file download
    anchor.click();
    
    // Don't forget ;)
    URL.revokeObjectURL(blobUrl);
})

openFile.addEventListener("click",()=>{
    let open=document.createElement("input");
    open.setAttribute("type","file");
    
    open.addEventListener("change",()=>{
        //files array->file accept
        let filesArray=open.files;
        let fileObj=filesArray[0];
        let fr=new FileReader(fileObj);
        fr.readAsText(fileObj);
        fr.onload=function(){
            console.log(fr.result);
        }
    })
    open.click();
})