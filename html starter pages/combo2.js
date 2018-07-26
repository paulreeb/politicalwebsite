// CHANGING BETWEEN SENATE AND HOUSE JSONS DEPENDING ON ATTRIBUTE IN HTML
var bodyElement = document.getElementById("body");
var json = bodyElement.getAttribute("data-chambers");
if (json === "senate") {
    callApiData("senate");
   
} else if (json === "house") {
    callApiData("house");
}

// SENATE AJAX CALL
function callApiData(source) {    
    fetch("https://api.propublica.org/congress/v1/113/" + source + "/members.json", {
            method: "GET",
            headers: new Headers({
                "X-API-Key": '1pbwyOY6uoByUBqUNzarMxuDp04aWsimswBC5Fwl'
            })

        })
        .then(onDataFetched)
        .catch(onDataFetchFailed);

}
// IF DATA IS FETCHED, RESPOND
function onDataFetched(response) {
    response.json()
        .then(onConversionToJsonSuccessful)
        .catch(onConversionToJsonFailed);
}
// IF FECTH FAILS, ERROR
function onDataFetchFailed(error) {}

// IF RESPONSE IS SUCCESSFUL, DO STUFF
function onConversionToJsonSuccessful(json) {
    data = json;
    Members = data.results[0].members;
    // note that this does not add a new promise
    console.log(data);
    countMembers(Members, summary);
    makeRow(summary);
    Members.sort(sortByMissedAscending);
    var myTopTen = topTenPercent(Members);
    makeRowAttendance(myTopTen);
    Members.sort(sortByMissedAscending2);
    var myTopTen = topTenPercent(Members);
    makeRowAttendance2(myTopTen);
}
// IF RESPONSE FAILS, NOT A JSON
function onConversionToJsonFailed() {}

var statistics = {

    "glance": [
        {
            "party": "Republicans",
            "reps": 0,
            "votes_with_party_pct": 0
    },
        {
            "party": "Democrats",
            "reps": 0,
            "votes_with_party_pct": 0
    },
        {
            "party": "Independents",
            "reps": 0,
            "votes_with_party_pct": 0
    }
    ]
}

var summary = statistics.glance;
countMembers(Members, summary);

makeRow(summary);

Members.sort(sortByMissedAscending);
var myTopTen = topTenPercent(Members);
makeRowAttendance(myTopTen);


Members.sort(sortByMissedAscending2);
var myTopTen = topTenPercent(Members);
makeRowAttendance2(myTopTen);


function countMembers(Members, summary) {

    var republicans = 0;
    var republicanVotes = 0;
    var republicanAverage = 0;
    var democrats = 0;
    var democraticVotes = 0;
    var democraticAverage = 0;
    var independents = 0;
    var independentVotes = 0;
    var independentAverage = 0;

    for (var i = 0; i < Members.length; i++) {

        if (Members[i].party === "R" && Members[i].votes_with_party_pct != undefined) {

            republicans += 1;
            republicanVotes += Members[i].votes_with_party_pct;
        } else if (Members[i].party === "D" && Members[i].votes_with_party_pct != undefined) {
            democrats += 1;
            democraticVotes += Members[i].votes_with_party_pct;
        } else if (Members[i].party === "I" && Members[i].votes_with_party_pct != undefined) {
            independents += 1;
            independentVotes += Members[i].votes_with_party_pct;
        }

    }
    console.log(independents);
    republicanAverage = republicanVotes / republicans
    democraticAverage = democraticVotes / democrats
    independentAverage = independentVotes / independents
    console.log(republicanAverage);

    if (independents === 0) {
        independentAverage = 0;
    }


    summary[0].reps = republicans;
    summary[1].reps = democrats;
    summary[2].reps = independents;

    summary[0].votes_with_party_pct = republicanAverage;
    summary[1].votes_with_party_pct = democraticAverage;
    summary[2].votes_with_party_pct = independentAverage;


}


function makeRow(summary) {

    var tbody = document.getElementById("Totals");

    tbody.innerHTML = "";

    for (var i = 0; i < summary.length; i++) {

        var tr = document.createElement("tr");

        var td = document.createElement("td");
        td.innerHTML = summary[i].party;
        tr.appendChild(td);


        var td = document.createElement("td");
        td.innerHTML = summary[i].reps;
        tr.appendChild(td);


        var td = document.createElement("td");
        td.innerHTML = summary[i].votes_with_party_pct.toFixed(2);
        tr.appendChild(td);

        tbody.appendChild(tr);
        console.log(tr);
    }
}


function makeRowAttendance(membersArray) {
    var tbody = document.getElementById("-attendance");

    tbody.innerHTML = "";

    for (var i = 0; i < membersArray.length; i++) {
        var tr = document.createElement("tr");

        var td = document.createElement("td");
        var a = document.createElement("a");
        a.textContent = membersArray[i].first_name + " " + membersArray[i].last_name;
        a.setAttribute("href", membersArray[i].url);
        td.appendChild(a);
        tr.appendChild(td);


        var td = document.createElement("td");
        td.innerHTML = Math.round(membersArray[i].total_votes * membersArray[i].votes_with_party_pct / 100);
        tr.appendChild(td);


        var td = document.createElement("td");
        td.innerHTML = membersArray[i].votes_with_party_pct.toFixed(2);
        tr.appendChild(td);

        tbody.appendChild(tr);
    }
}


function sortByMissedAscending(a, b) {


    if (a.votes_with_party_pct > b.votes_with_party_pct) {
        return -1;

    }
    if (a.votes_with_party_pct < b.votes_with_party_pct) {
        return 1;
    }
    if (a.votes_with_party_pct == b.votes_with_party_pct) {
        return 0;
    }
}

function topTenPercent(members) {
    var leastEngaged = [];

    for (var i = 0; i <= 10 * members.length / 100; i++) {
        leastEngaged.push(members[i]);
    }
    return leastEngaged;
}


function makeRowAttendance2(membersArray) {
    var tbody = document.getElementById("-attendance2");

    tbody.innerHTML = "";

    for (var i = 0; i < membersArray.length; i++) {
        var tr = document.createElement("tr");

        var td = document.createElement("td");
        var a = document.createElement("a");
        a.textContent = membersArray[i].first_name + " " + membersArray[i].last_name;
        a.setAttribute("href", membersArray[i].url);
        td.appendChild(a);
        tr.appendChild(td);


        var td = document.createElement("td");
        td.innerHTML = Math.round(membersArray[i].total_votes * membersArray[i].votes_with_party_pct / 100);
        tr.appendChild(td);


        var td = document.createElement("td");
        td.innerHTML = membersArray[i].votes_with_party_pct.toFixed(2);
        tr.appendChild(td);

        tbody.appendChild(tr);
    }
}

function sortByMissedAscending2(a, b) {

    if (a.votes_with_party_pct < b.votes_with_party_pct) {
        return -1;
    }
    if (a.votes_with_party_pct > b.votes_with_party_pct) {
        return 1;
    }
    if (a.votes_with_party_pct == b.votes_with_party_pct) {
        return 0;
    }
}

/*function moveDecimal(n) {
    
    for (var i = 0; i < n.length; i++)
    var l = n.toString().length - 3;
    var partyVotes = n / Math.pow(10, l);
    return partyVotes;
}*/