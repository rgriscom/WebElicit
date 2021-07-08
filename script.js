var x;
var startstop = 0;
var columns = 5
var rows = 4;
var TG_string = "";


function radioClick(radio_num){ //What happens when you click a radio button
  for (let i = 0; i < ((rows-1)*2); i++) {
    if (document.getElementById("radio_" + i.toString()).checked === true){
       document.getElementById("radio_" + i.toString()).checked = false;
                    
    }
}
  document.getElementById("radio_" + radio_num.toString()).checked = true;         


}


function generateUUID() { // Generates a UUID, Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


function addRow() {//Add a row to the data entry interface
  var table = document.getElementById("myTable");
  var row = table.insertRow(-1);
  rows = rows + 1;
    notes_cell = row.insertCell(0);
    notes_cell.innerHTML = "<form><input type=\"text\" value=\"\" id=\"" + (rows-1).toString() +  "_notes\"></form>";
    transcription_cell = row.insertCell(0);
    transcription_cell.innerHTML = "<form><input type=\"text\" value=\"\" id=\"" + (rows-1).toString() +  "_transcription\"></form>";
    translation_cell = row.insertCell(0);
    translation_cell.innerHTML = "<form><input type=\"text\" value=\"\" id=\"" + (rows-1).toString() +  "_translation\"></form>";    
    start_cell = row.insertCell(-1);
    start_cell.innerHTML = "<form><input type=\"radio\" id=\"radio_" + ((rows-2)*2).toString() + "\" onclick=\"radioClick(" + ((rows-2)*2).toString() + ")\"></form><span id=\"" + ((rows-2)*2).toString() + "_hour\">00</span> : <span id=\"" + ((rows-2)*2).toString() + "_min\">00</span> : <span id=\"" + ((rows-2)*2).toString() + "_sec\">00</span> : <span id=\"" + ((rows-2)*2).toString() + "_milisec\">00</span>";
    end_cell = row.insertCell(-1);
    end_cell.innerHTML = "<form><input type=\"radio\" id=\"radio_" + ((rows*2)-3).toString() + "\"  onclick=\"radioClick(" + ((rows*2)-3).toString() + ")\"></form><span id=\"" + ((rows*2)-3).toString() + "_hour\">00</span> : <span id=\"" + ((rows*2)-3).toString() + "_min\">00</span> : <span id=\"" + ((rows*2)-3).toString() + "_sec\">00</span> : <span id=\"" + ((rows*2)-3).toString() + "_milisec\">00</span>";

}

function deleteRow() {//Delete a row from the data entry interface
  if (rows > 2){
    document.getElementById("myTable").deleteRow(-1);
    rows = rows - 1;
  }
}
/*
function addColumn() {//Add a column to the data entry interface
	var row_list = [];
  	for (let i = 0; i < rows; i++) {
  		row_list[i] = document.getElementById("myTable").rows[i];
    	var x = row_list[i].insertCell((columns-2));
  		x.innerHTML = "<form><input type=\"text\" value=\"\"></form>";
    }
  columns = columns + 1;
}

function deleteColumn() { //Remove a column from the data entry interface

	var row_list = [];
  	for (let i = 0; i < rows; i++) {
  		row_list[i] = document.getElementById("myTable").rows[i];
    	row_list[i].deleteCell((columns-3));
    }
  
  columns = columns - 1;
}
*/ 
function createJSON() {//Create JSON file from the data entered into the form
  json_string = '{"rows":[],"translation_lg":"","transcription_lg":"","notes_lg":""}';  
  outJSON = JSON.parse(json_string);
  
  outJSON["translation_lg"] = document.getElementById("translation_lg").value;
    outJSON["transcription_lg"] = document.getElementById("transcription_lg").value;
    outJSON["notes_lg"] = document.getElementById("notes_lg").value;
    outJSON["title"] = document.getElementById("doc_title").value;
  for (let i = 1; i < rows; i++) {
    
    outJSON['rows'].push({"translation":"","transcription":"","notes":"","start_time":0,"end_time":0})
    outJSON['rows'][(i-1)].translation = document.getElementById(i.toString() + "_translation").value;
    outJSON['rows'][(i-1)].transcription = document.getElementById(i.toString() + "_transcription").value;
    outJSON['rows'][(i-1)].notes = document.getElementById(i.toString() + "_notes").value;
    start_hour = parseInt(document.getElementById(((i*2)-2).toString() + "_hour").innerHTML);
    start_min = parseInt(document.getElementById(((i*2)-2).toString() + "_min").innerHTML);
    start_sec = parseInt(document.getElementById(((i*2)-2).toString() + "_sec").innerHTML);
    start_milisec = parseInt(document.getElementById(((i*2)-2).toString() + "_milisec").innerHTML);
    end_hour = parseInt(document.getElementById(((i*2)-1).toString() + "_hour").innerHTML);
    end_min = parseInt(document.getElementById(((i*2)-1).toString() + "_min").innerHTML);
    end_sec = parseInt(document.getElementById(((i*2)-1).toString() + "_sec").innerHTML);
    end_milisec = parseInt(document.getElementById(((i*2)-1).toString() + "_milisec").innerHTML);
    outJSON['rows'][(i-1)].start_time = start_milisec + (start_sec * 1000) + (start_min * 60000) + (start_hour * 3600000);
    outJSON['rows'][(i-1)].end_time = end_milisec + (end_sec * 1000) + (end_min * 60000) + (end_hour * 3600000);
  }
}

function createTextGrid() {//Create a TextGrid file by using the data contained with the JSON
  final_time = (outJSON['rows'][outJSON['rows'].length-1].end_time / 1000);
  tier_counter = 1;
  TG_string = "File type = \"ooTextFile\"\nObject class = \"TextGrid\"\n\nxmin = 0\nxmax = " + (end_time / 1000).toString() + "\ntiers? <exists>\nsize = 4\nitem []:\n";
  
  for (let i = 1; i < 5; i++){
    TG_string += "    item [" + tier_counter.toString() + "]:\n";
    TG_string += "        class = \"IntervalTier\"\n"
    if (tier_counter === 1){
        TG_string +="        name = \"REFID\"\n";
    } 
    if (tier_counter === 2){
      TG_string +="        name = \"Translation\"\n";
    }
    if (tier_counter === 3){
      TG_string +="        name = \"Transcription\"\n";
    }
    if (tier_counter === 4){
      TG_string += "        name = \"Notes\"\n";
    }  
    TG_string += "        xmin = 0\n";
    TG_string += "        xmax = " + (end_time / 1000).toString() + "\n";
    TG_string += "        intervals: size = " + (((rows*2)-1).toString() + "\n")
    //#Fill out each TextGrid interval using the dictionary
    
    for (let j = 1; j < rows; j++){
      if (j === 1){
        temp_prev_xmax = 0
      } else{              
        temp_prev_xmax = (outJSON['rows'][j-2].end_time / 1000);
      }
      temp_next_xmin = (outJSON['rows'][j-1].start_time / 1000);
      TG_string += "        intervals [" + ((j * 2) - 1).toString() + "]:\n";
      if (j == 1){
        TG_string += "            xmin = 0\n";
      } else {
        TG_string += "            xmin = " + temp_prev_xmax.toString() + "\n";
      }
      TG_string += "            xmax = " + temp_next_xmin.toString() + "\n";
      TG_string += "            text = \"\"\n";
      TG_string += "        intervals [" + (j * 2).toString() + "]:\n";
      TG_string += "            xmin = " + (outJSON['rows'][j-1].start_time / 1000).toString() + "\n";
      TG_string += "            xmax = " + (outJSON['rows'][j-1].end_time / 1000).toString() + "\n";
      if (tier_counter === 1){
              TG_string +=  "            text = \"" + j.toString() + "\"\n";
      } 
      if (tier_counter === 2){
        TG_string += "            text = \"" + outJSON['rows'][j-1].translation + "\"\n";
      }
      if (tier_counter === 3){
        TG_string += "            text = \"" + outJSON['rows'][j-1].transcription + "\"\n";
      }
      if (tier_counter === 4){
        TG_string += "            text = \"" + outJSON['rows'][j-1].notes + "\"\n";
      }         
            
    }
    
    TG_string += "        intervals [" + ((rows*2)-1).toString() + "]:\n";    
    TG_string +=  "            xmin = " + final_time.toString() + "\n";
    TG_string +=  "            xmax = " + (end_time / 1000).toString() + "\n";
    TG_string +=  "            text = \"\"\n";
    tier_counter += 1
}
}

function createFlextext() {//Create a Flextext file by using the data contained with the JSON
        document_uuid = generateUUID();
        media_uuid = generateUUID();
        analysis_lg_code = outJSON["translation_lg"];
        document_title = outJSON["title"];

        FT_string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        FT_string += "<document version=\"2\">\n";
        FT_string += "    <interlinear-text guid=\"" + document_uuid +  "\">\n";
        FT_string += "        <item lang=\"" + analysis_lg_code + "\" type=\"title\">" + document_title + "</item>\n";
        FT_string += "        <paragraphs>\n";
        

        //Cycle through all of the annotations    
        annotation_counter = 1;
        for (let i = 1; i < rows; i++){
          paragraph_uuid = generateUUID();
          phrase_uuid = generateUUID();
          FT_string += "            <paragraph guid=\"" + paragraph_uuid + "\">\n";
          FT_string += "                <phrases>\n";
          FT_string += "                    <phrase begin-time-offset=\"" + (outJSON['rows'][i-1].start_time).toString() + "\"\n";
          FT_string += "                        end-time-offset=\"" + (outJSON['rows'][i-1].end_time).toString() + "\"\n";
          FT_string += "                        guid=\"" + phrase_uuid + "\"\n";
          FT_string += "                        media-file=\"" + media_uuid + "\" speaker=\"A\">\n";
          FT_string += "                        <item lang=\"" + outJSON["transcription_lg"] + "\" type=\"txt\">" + outJSON['rows'][i-1].transcription + "</item>\n";
          //FT_string += "                        <words/>\n";
          FT_string += "                        <item lang=\"zxx\" type=\"gls\">" + i.toString() + "</item>\n";
          FT_string += "                        <item lang=\"" + outJSON["translation_lg"] + "\" type=\"gls\">" + outJSON['rows'][i-1].translation + "</item>\n";
          FT_string += "                    </phrase>\n";
          FT_string += "                </phrases>\n";
          FT_string += "            </paragraph>\n";
          annotation_counter += 1
	}
        FT_string += "        </paragraphs>\n";
        FT_string += "        <media-files offset-type=\"\">\n";
        FT_string += "            <media guid=\"" + media_uuid + "\" location=\"\"/>\n";
        FT_string += "        </media-files>\n";
        FT_string += "    </interlinear-text>\n";
        FT_string += "</document>";
        
    }

  function createEAF() {//Create an EAF file by using the data contained with the JSON
//Fill out the beginning of the EAF file
        EAF_string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        today = new Date()
        EAF_string += "<ANNOTATION_DOCUMENT AUTHOR=\"unspecified\" DATE=\"" + today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate() + "T" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "-08:00\" FORMAT=\"3.0\" VERSION=\"3.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"http://www.mpi.nl/tools/elan/EAFv3.0.xsd\">\n";
        EAF_string += "    <HEADER MEDIA_FILE=\"\" TIME_UNITS=\"milliseconds\">\n";

  //Fixes slashes in Windows directories
//        if Operating_System == 'Windows':                   
//          EAF_string += "        <MEDIA_DESCRIPTOR MEDIA_URL=\"file:///" + filename_stem + ".wav\" MIME_TYPE=\"audio/x-wav\" RELATIVE_MEDIA_URL=\"./" + filename_stem + ".wav\"/>\n";
//        else:
//          EAF_string += "        <MEDIA_DESCRIPTOR MEDIA_URL=\"file://" + filename_stem + ".wav\" MIME_TYPE=\"audio/x-wav\" RELATIVE_MEDIA_URL=\"./" + filename_stem + ".wav\"/>\n";
        EAF_string += "        <PROPERTY NAME=\"URN\">urn:nl-mpi-tools-elan-eaf:93cd58ea-4af9-44d5-a6d5-d468217ccf5e</PROPERTY>\n";
        EAF_string += "        <PROPERTY NAME=\"lastUsedAnnotationId\">" + (rows*5).toString() + "</PROPERTY>\n";
        EAF_string += "    </HEADER>\n";
        EAF_string += "    <TIME_ORDER>\n";                      
  //Fill out time slots
        for (let i =1; i < rows; i++) {
          EAF_string += "        <TIME_SLOT TIME_SLOT_ID=\"ts" + ((i * 2) - 1).toString() + "\" TIME_VALUE=\"" + (outJSON['rows'][i-1].start_time).toString() + "\"/>\n";
          EAF_string += "        <TIME_SLOT TIME_SLOT_ID=\"ts" + (i * 2).toString() + "\" TIME_VALUE=\"" + (outJSON['rows'][i-1].end_time).toString() + "\"/>\n";
          }
  //Fill out RFID annotations
        EAF_string += "    </TIME_ORDER>\n";
        EAF_string += "    <TIER DEFAULT_LOCALE=\"en\" LINGUISTIC_TYPE_REF=\"REFID\" TIER_ID=\"REFID\">\n";

        for (let i =1; i < rows; i++) {
          EAF_string += "        <ANNOTATION>\n";
          EAF_string += "            <ALIGNABLE_ANNOTATION ANNOTATION_ID=\"a" + (2 * (rows-1) + i).toString() + "\" TIME_SLOT_REF1=\"ts" + ((i * 2) -1).toString() + "\" TIME_SLOT_REF2=\"ts" + (i * 2).toString() + "\">\n";
          EAF_string += "                <ANNOTATION_VALUE>" + i.toString() + "</ANNOTATION_VALUE>\n";
          EAF_string += "            </ALIGNABLE_ANNOTATION>\n";
          EAF_string += "        </ANNOTATION>\n";
          }
        EAF_string += "    </TIER>\n";            
//Fill out transcription and translation annotations
                     
            EAF_string += "    <TIER DEFAULT_LOCALE=\"en\" LINGUISTIC_TYPE_REF=\"Translation\" PARENT_REF=\"REFID\" TIER_ID=\"Translation\">\n";

            for (let i =1; i < rows; i++) {
              EAF_string += "        <ANNOTATION>\n";
              EAF_string += "            <REF_ANNOTATION ANNOTATION_ID=\"a" + ((3 * (rows-1)) + i).toString() + "\" ANNOTATION_REF=\"a" + ((2 * (rows-1)) + i).toString() + "\">\n";
              EAF_string += "                <ANNOTATION_VALUE>" + outJSON['rows'][i-1].translation  + "</ANNOTATION_VALUE>\n";
              EAF_string += "            </REF_ANNOTATION>\n";
              EAF_string += "        </ANNOTATION>\n";
              }
            EAF_string += "    </TIER>\n";

            EAF_string += "    <TIER DEFAULT_LOCALE=\"en\" LINGUISTIC_TYPE_REF=\"Transcription\" PARENT_REF=\"REFID\" TIER_ID=\"Transcription\">\n";
	 for (let i =1; i < rows; i++) {
              EAF_string += "        <ANNOTATION>\n";
              EAF_string += "            <REF_ANNOTATION ANNOTATION_ID=\"a" + ((4 * (rows-1)) + i).toString() + "\" ANNOTATION_REF=\"a" + ((2 * (rows-1)) + i).toString() + "\">\n";
              EAF_string += "                <ANNOTATION_VALUE>" + outJSON['rows'][i-1].transcription  + "</ANNOTATION_VALUE>\n";
              EAF_string += "            </REF_ANNOTATION>\n";
              EAF_string += "        </ANNOTATION>\n";
              }
            EAF_string += "    </TIER>\n";
            
         EAF_string += "    <TIER DEFAULT_LOCALE=\"en\" LINGUISTIC_TYPE_REF=\"Notes\" PARENT_REF=\"REFID\" TIER_ID=\"Notes\">\n";
	 for (let i =1; i < rows; i++) {
              EAF_string += "        <ANNOTATION>\n";
              EAF_string += "            <REF_ANNOTATION ANNOTATION_ID=\"a" + ((5 * (rows-1)) + i).toString() + "\" ANNOTATION_REF=\"a" + ((2 * (rows-1)) + i).toString() + "\">\n";
              EAF_string += "                <ANNOTATION_VALUE>" + outJSON['rows'][i-1].notes  + "</ANNOTATION_VALUE>\n";
              EAF_string += "            </REF_ANNOTATION>\n";
              EAF_string += "        </ANNOTATION>\n";
              }
            EAF_string += "    </TIER>\n";
                      
                        
  //Fill out end of the EAF file
        EAF_string += "    <LINGUISTIC_TYPE GRAPHIC_REFERENCES=\"false\" LINGUISTIC_TYPE_ID=\"REFID\" TIME_ALIGNABLE=\"true\"/>\n";
        EAF_string += "    <LINGUISTIC_TYPE CONSTRAINTS=\"Symbolic_Association\" GRAPHIC_REFERENCES=\"false\" LINGUISTIC_TYPE_ID=\"Transcription\" TIME_ALIGNABLE=\"false\"/>\n";   
        EAF_string += "    <LINGUISTIC_TYPE CONSTRAINTS=\"Symbolic_Association\" GRAPHIC_REFERENCES=\"false\" LINGUISTIC_TYPE_ID=\"Translation\" TIME_ALIGNABLE=\"false\"/>\n";
        EAF_string += "    <LINGUISTIC_TYPE CONSTRAINTS=\"Symbolic_Association\" GRAPHIC_REFERENCES=\"false\" LINGUISTIC_TYPE_ID=\"Notes\" TIME_ALIGNABLE=\"false\"/>\n";
        EAF_string += "    <LOCALE COUNTRY_CODE=\"US\" LANGUAGE_CODE=\"en\"/>\n";
        EAF_string += "    <CONSTRAINT DESCRIPTION=\"Time subdivision of parent annotation's time interval, no time gaps allowed within this interval\" STEREOTYPE=\"Time_Subdivision\"/>\n";
        EAF_string += "    <CONSTRAINT DESCRIPTION=\"Symbolic subdivision of a parent annotation. Annotations refering to the same parent are ordered\" STEREOTYPE=\"Symbolic_Subdivision\"/>\n";
        EAF_string += "    <CONSTRAINT DESCRIPTION=\"1-1 association with a parent annotation\" STEREOTYPE=\"Symbolic_Association\"/>\n";
        EAF_string += "    <CONSTRAINT DESCRIPTION=\"Time alignable annotations within the parent annotation's time interval, gaps are allowed\" STEREOTYPE=\"Included_In\"/>\n";
        EAF_string += "</ANNOTATION_DOCUMENT>";


  }

  function downloadObject(typeObj,exportObj,exportName){//Download a text file
    if (typeObj === "JSON"){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  if (typeObj === "TextGrid"){
    var dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(exportObj);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".TextGrid");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  if (typeObj === "Flextext"){
    var dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(exportObj);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".flextext");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  if (typeObj === "EAF"){
    var dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(exportObj);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".eaf");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  }

  function exportFiles(exportType){//Create a text file
    if (exportType === "JSON"){
      createJSON();
      downloadObject("JSON",outJSON,document.getElementById("doc_title").value);
    } 
    if (exportType === "TextGrid") {
    createJSON();
    createTextGrid(); 
    downloadObject("TextGrid",TG_string,document.getElementById("doc_title").value);
  }
  if (exportType === "Flextext") {
    createJSON();
    createFlextext(); 
    downloadObject("Flextext",FT_string,document.getElementById("doc_title").value);
  }
  if (exportType === "EAF") {
    createJSON();
    createEAF(); 
    downloadObject("EAF",EAF_string,document.getElementById("doc_title").value);
  }

  }




        function startStop() { /* Toggle StartStop */

        startstop = startstop + 1;

        if (startstop === 1) {
            start();
            document.getElementById("start").innerHTML = "Stop";
        } else if (startstop === 2) {
            document.getElementById("start").innerHTML = "Start";
            startstop = 0;
            stop();
        }

        }
        

        function start() {
        ticker.start();
        start_time = Date.now();
        } /* Start */

        function stop() {
        ticker.stop();
        end_time = Date.now() - start_time
        if (end_time > 3600000){
                      end_hour = Math.floor(end_time / 3600000)
                      end_min = Math.floor((end_time - (3600000 * end_hour)) / 60000);
                      end_sec = Math.floor((end_time - (3600000 * end_hour) - (60000 * end_min)) / 1000);
                      end_milisec = end_time - (3600000 * end_hour) - (60000 * end_min) - (1000 * end_sec);
                      

                    } else { //Less than an hour
                    if (end_time > 60000){ // If over a minute
                      end_hour = 0
                      end_min = Math.floor((end_time - (3600000 * end_hour)) / 60000);
                      end_sec = Math.floor((end_time - (3600000 * end_hour) - (60000 * end_min)) / 1000);
                      end_milisec = end_time - (3600000 * end_hour) - (60000 * end_min) - (1000 * end_sec);

                    } else { // If less than a minute
                      end_hour = 0
                      end_min = 0;
                      end_sec = Math.floor((end_time - (3600000 * end_hour) - (60000 * end_min)) / 1000);
                      end_milisec = end_time - (3600000 * end_hour) - (60000 * end_min) - (1000 * end_sec);

                    }
        } /* Stop */
      }
      

        function assign(){
          var check_id = 0;
            for (let i = 0; i < ((rows-1)*2); i++) {
                
                if (document.getElementById("radio_" + i.toString()).checked === true){
                    //Assign the value based on the actual time which has elapsed rather than using the text in the displayed timer
                    assign_time = Date.now() - start_time
                    //If over an hour
                    if (assign_time > 3600000){
                      assign_hour = Math.floor(assign_time / 3600000)
                      assign_min = Math.floor((assign_time - (3600000 * assign_hour)) / 60000);
                      assign_sec = Math.floor((assign_time - (3600000 * assign_hour) - (60000 * assign_min)) / 1000);
                      assign_milisec = assign_time - (3600000 * assign_hour) - (60000 * assign_min) - (1000 * assign_sec);
                      

                    } else { //Less than an hour
                    if (assign_time > 60000){ // If over a minute
                      assign_hour = 0
                      assign_min = Math.floor((assign_time - (3600000 * assign_hour)) / 60000);
                      assign_sec = Math.floor((assign_time - (3600000 * assign_hour) - (60000 * assign_min)) / 1000);
                      assign_milisec = assign_time - (3600000 * assign_hour) - (60000 * assign_min) - (1000 * assign_sec);

                    } else { // If less than a minute
                      assign_hour = 0
                      assign_min = 0;
                      assign_sec = Math.floor((assign_time - (3600000 * assign_hour) - (60000 * assign_min)) / 1000);
                      assign_milisec = assign_time - (3600000 * assign_hour) - (60000 * assign_min) - (1000 * assign_sec);

                    }
                    document.getElementById(i.toString() + "_hour").innerHTML = assign_hour;
                    document.getElementById(i.toString() + "_min").innerHTML = assign_min;
                    document.getElementById(i.toString() + "_sec").innerHTML = assign_sec;
                    document.getElementById(i.toString() + "_milisec").innerHTML = assign_milisec;
                  }
                    check_id = i;
                }
              }
            document.getElementById("radio_" + check_id.toString()).checked = false;
            if (check_id < ((rows*2)-3)){
              document.getElementById("radio_" + (check_id+1).toString()).checked = true;
            }
        } 
        
            
        
        function reset() {
        document.getElementById("sec").innerHTML = "00";
        document.getElementById("min").innerHTML = "00";
        document.getElementById("hour").innerHTML = "00";
        }
        

        var drift_history = [];
        var drift_history_samples = 10;
        var drift_correction = 0;

      
function AdjustingInterval(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
    }

    function step() {
        var drift = Date.now() - expected;
        if (drift > that.interval) {
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        workFunc();
        if (drift <= interval) {
    // sample drift amount to history after removing current correction
    // (add to remove because the correction is applied by subtraction)
        drift_history.push(drift + drift_correction);

    // predict new drift correction
        drift_correction = calc_drift(drift_history);

    // cap and refresh samples
    if (drift_history.length >= drift_history_samples) {
      drift_history.shift();
    }  
}
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift- drift_correction));
    }
}
// For testing purposes, we'll just increment
// this and send it out to the console.
var justSomeNumber = 0;

// Define the work to be done
var doWork = function() {
    //console.log(++justSomeNumber);
    ++document.getElementById("sec").innerHTML;
    if (document.getElementById("sec").innerHTML < 10) {
      document.getElementById("sec").innerHTML = "0" + document.getElementById("sec").innerHTML;
    }
    

        if (document.getElementById("sec").innerHTML == 60) {
            ++document.getElementById("min").innerHTML;
            document.getElementById("sec").innerHTML = 0;
            if (document.getElementById("min").innerHTML < 10) {
      document.getElementById("min").innerHTML = "0" + document.getElementById("min").innerHTML;
    }
        }

        if (document.getElementById("min").innerHTML == 60) {
            document.getElementById("min").innerHTML = 0;
            ++document.getElementById("hour").innerHTML;
            if (document.getElementById("hour").innerHTML < 10) {
      document.getElementById("hour").innerHTML = "0" + document.getElementById("hour").innerHTML;
    }

        }
};

// Define what to do if something goes wrong
var doError = function() {
    console.warn('The drift exceeded the interval.');
};

// (The third argument is optional)
var ticker = new AdjustingInterval(doWork, 1000, doError);

function calc_drift(arr){
  // Calculate drift correction.

  var values = arr.concat(); // copy array so it isn't mutated
  
  values.sort(function(a,b){
    return a-b;
  });
  if(values.length ===0) return 0;
  var half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  var median = (values[half - 1] + values[half]) / 2.0;
  
  return median;
}

   