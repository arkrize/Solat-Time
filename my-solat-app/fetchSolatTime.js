var baseurl = "https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat";
var query = {}; // query data
var duration = {}; // duration data

function periodChange() {
  // update query data
  var p = document.getElementById("period");
  var period = p.options[p.selectedIndex].value;
  query.period = period;
  
  // update endpoint
  var endpoint = baseurl + "&zone=" + query.zone + "&period=" + period;
  document.getElementById("endpoint").innerHTML = endpoint;
  
  // hide or show duration field
  var durationField = document.getElementById("duration-field");
  durationField.style.display = (period == "duration") ? 'block' : 'none';
}

function zoneChange() {
  // update query data
  query.zone = document.getElementById("zone").value;
  
  // update endpoint
  var endpoint = baseurl + "&zone=" + query.zone + "&period=" + query.period;
  document.getElementById("endpoint").innerHTML = endpoint;
}

function datestartChange() {
  // update duration data
  duration.datestart = document.getElementById("datestart").value;
  
  // update duration display
  var body = "datestart=" + duration.datestart + "&dateend=" + duration.dateend;
  document.getElementById("duration-body").innerHTML = body;
}

function dateendChange() {
  // update duration data
  duration.dateend = document.getElementById("dateend").value;
  
  // update duration display
  var body = "datestart=" + duration.datestart + "&dateend=" + duration.dateend;
  document.getElementById("duration-body").innerHTML = body;
}

/**
 * Format JSON to human readable output.
 * @param {string} data - JSON data.
 * @return {string} Readable JSON data.
 */
function beautify(data) {
  return JSON.stringify(JSON.parse(data), null, 2);
}

function sendRequest() {
  var xhttp = new XMLHttpRequest();
  var endpoint = baseurl + "&zone=" + query.zone + "&period=" + query.period;
  var body = "datestart=" + duration.datestart + "&dateend=" + duration.dateend;
  
  document.getElementById("result").innerHTML = 'memuatkan...';
  xhttp.onreadystatechange = function() {
    document.getElementById("result").innerHTML = beautify(this.responseText);
  };
  xhttp.open("POST", endpoint, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(body);
}

window.onload = function() {
  // initialize query data
  query.period = "today";
  query.zone = "JHR01";
  
  // initalize duration data
  duration.datestart = "2019-11-11";
  duration.dateend = "2019-11-12"
  
  // dynamically add zone dropdown
  zones.forEach(function(zone) {
    var option = document.createElement('option');
    option.value = zone;
    option.text = zone;
    document.getElementById("zone").appendChild(option)
  });
  
  // initialize endpoint
  var endpoint = baseurl + "&zone=" + query.zone + "&period=" + query.period;
  var body = "datestart=" + duration.datestart + "&dateend=" + duration.dateend;
  document.getElementById("endpoint").innerHTML = endpoint;
  document.getElementById("duration-body").innerHTML = body;
};

// zone data
var zones = [
  "JHR01",  "JHR02",  "JHR03",  "JHR04",  "KDH01",  
  "KDH02",  "KDH03",  "KDH04",  "KDH05",  "KDH06",  
  "KDH07",  "KTN01",  "KTN03",  "MLK01",  "NGS01",  
  "NGS02",  "PHG01",  "PHG02",  "PHG03",  "PHG04",  
  "PHG05",  "PHG06",  "PLS01",  "PNG01",  "PRK01",  
  "PRK02",  "PRK03",  "PRK04",  "PRK05",  "PRK06",
  "PRK07",  "SBH01",  "SBH02",  "SBH03",  "SBH04",  
  "SBH05",  "SBH06",  "SBH07",  "SBH08",  "SBH09",  
  "SGR01",  "SGR02",  "SGR03",  "SWK01",  "SWK02",
  "SWK03",  "SWK04",  "SWK05",  "SWK06",  "SWK07",
  "SWK08",  "SWK09",  "TRG01",  "TRG02",  "TRG03",
  "TRG04",  "WLY01",  "WLY02"
];