// VUE ARRAY
var app = new Vue({
    el: '#app',
    data: {
        members: [],
        states: [],
        stateFilter: [],
        resultsParty: [],
        nonChangingArray: []
    },
});

// GETTING LOCATION OF FILTER ELEMENTS IN HTML
var rep = document.getElementById("rep");
var dem = document.getElementById("dem");
var ind = document.getElementById("ind");
var dropDownSelector = document.getElementById("filter-state");

// CHANGING BETWEEN SENATE AND HOUSE JSONS DEPENDING ON ATTRIBUTE IN HTML
var bodyElement = document.getElementById("body");
var json = bodyElement.getAttribute("data-chambers");
if (json === "senate") {
    callApiSenateData();
} else if (json === "house") {
    callApiHouseData();
}

// SENATE AJAX CALL
function callApiSenateData() {
    fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
            method: "GET",
            headers: new Headers({
                "X-API-Key": '1pbwyOY6uoByUBqUNzarMxuDp04aWsimswBC5Fwl'
            })

        })
        .then(onDataFetched)
        .catch(onDataFetchFailed);

}
// HOUSE AJAX CALL
function callApiHouseData() {
    fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
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
    app.members = json.results[0].members;
    app.nonChangingArray = app.members;
    app.states = stateList();

    filterParty();

    //CHECKBOX FILTER LISTENERS
    rep.addEventListener("click", filterParty);
    dem.addEventListener("click", filterParty);
    ind.addEventListener("click", filterParty);
    dropDownSelector.addEventListener("change", filterParty);

    document.getElementById('load').style.display = 'none';
}
// IF RESPONSE FAILS, NOT A JSON
function onConversionToJsonFailed() {}

// SORTING AND FILTERING BY STATE
function stateList() {
    var membersArray = app.members;
    var allMemberState = [];
    var uniqueState = [];
    for (i = 0; i < membersArray.length; i++) {
        allMemberState.push(membersArray[i].state);
    }
    allMemberState.sort();

    for (i = 0; i < allMemberState.length; i++) {
        if (!uniqueState.includes(allMemberState[i])) {
            uniqueState.push(allMemberState[i]);
            console.log(uniqueState);
        }
    }

    for (i = 0; i < uniqueState.length; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', uniqueState[i]);
        option.innerHTML = uniqueState[i];
        dropDownSelector.appendChild(option)
    }
    return uniqueState;
}

// FILTERING BY PARTY
function filterParty() {
    app.members = app.nonChangingArray;
    var resultsParty = [];
    var selectedState = document.getElementById('filter-state').value;
    for (var i = 0; i < app.members.length; i++) {
        var currentMember = app.members[i];
        if (selectedState === currentMember.state || selectedState === 'ALL') {
            if (rep.checked && currentMember.party === "R") {
                resultsParty.push(currentMember);
            }
            if (dem.checked && currentMember.party === "D") {
                resultsParty.push(currentMember);
            }
            if (ind.checked && currentMember.party === "I") {
                resultsParty.push(currentMember);
            }
            if (rep.checked == false && dem.checked == false && ind.checked == false) {
                resultsParty.push(currentMember);

            }
        }
    }

    app.members = resultsParty;
}
