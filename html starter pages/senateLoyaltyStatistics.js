var senateMembers;
var data;

console.log(data);

fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {

    method: "GET",
    headers: {
        'X-API-Key': 'qsB6fSabIzyfNBsweDBQO7mdCL5Mb3eQXI7DhVB2'
    }
}).then(function (response) {

    if (response.ok) {
        // add a new promise to the chain
        return response.json();
    }
    // signal a server error to the chain
    throw new Error(response.statusText);
}).then(function (json) {
    data = json;
    senateMembers = data.results[0].members;
    // note that this does not add a new promise
    console.log(data);
    countMembers(senateMembers, summary);
    makeRow(summary);
    senateMembers.sort(sortByMissedAscending);
    var myTopTen = topTenPercent(senateMembers);
    makeRowAttendance(myTopTen);
    senateMembers.sort(sortByMissedAscending2);
    var myTopTen = topTenPercent(senateMembers);
    makeRowAttendance2(myTopTen);
}).catch(function (error) {
    // called when an error occurs anywhere in the chain
    console.log("Request failed: " + error.message);
});

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
countMembers(senateMembers, summary);

makeRow(summary);


senateMembers.sort(sortByMissedAscending);
var myTopTen = topTenPercent(senateMembers);
makeRowAttendance(myTopTen);


senateMembers.sort(sortByMissedAscending2);
var myTopTen = topTenPercent(senateMembers);
makeRowAttendance2(myTopTen);


function countMembers(senateMembers, summary) {

    var republicans = 0;
    var republicanVotes = 0;
    var republicanAverage = 0;
    var democrats = 0;
    var democraticVotes = 0;
    var democraticAverage = 0;
    var independents = 0;
    var independentVotes = 0;
    var independentAverage = 0;

    for (var i = 0; i < senateMembers.length; i++) {

        if (senateMembers[i].party === "R" && senateMembers[i].votes_with_party_pct != undefined) {

            republicans += 1;
            republicanVotes += senateMembers[i].votes_with_party_pct;
        } else if (senateMembers[i].party === "D" && senateMembers[i].votes_with_party_pct != undefined) {
            democrats += 1;
            democraticVotes += senateMembers[i].votes_with_party_pct;
        } else if (senateMembers[i].party === "I" && senateMembers[i].votes_with_party_pct != undefined) {
            independents += 1;
            independentVotes += senateMembers[i].votes_with_party_pct;
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

    var tbody = document.getElementById("senateTotals");

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
    var tbody = document.getElementById("senate-attendance");

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
        td.innerHTML = membersArray[i].total_votes * Math.round(membersArray[i].votes_with_party_pct / 100);
        tr.appendChild(td);


        var td = document.createElement("td");
        td.innerHTML = membersArray[i].votes_with_party_pct;
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
    var tbody = document.getElementById("senate-attendance2");

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
        td.innerHTML = membersArray[i].total_votes * Math.round(membersArray[i].votes_with_party_pct / 100);
        tr.appendChild(td);


        var td = document.createElement("td");
        td.innerHTML = membersArray[i].votes_with_party_pct;
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