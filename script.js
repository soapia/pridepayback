function rand(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
}

function isLowerCase(input) {  
  return input === String(input).toLowerCase()
}

function addSelect() {
  var arr = ["", "Alcohol & Substances", "Automobiles", "Beverages", "Cell Providers", "Events & Entertainment", "Dating Apps", "Finance", "Food Brands", "Healthcare", "Personal Care", "Reading", "Restaurants", "Ride Sharing & Delivery", "Shopping", "Social Media & Gaming", "Sports", "Technology", "Television & Media", "Travel"]
  for (var key of arr) {
    $('select').append('<option value="' + key + '">' + key + '</option>')
  }
}


function emailLink(company) {
  company = company.replace("&amp;", "&")
  var hash = companies.find(e => e["Emails"] == company)
  var loyal = ["loyal", "frequent", "regular"]
  var customer = ["customer", "consumer"]
  var incredibly = ["very", "incredibly", "really", "extremely"]
  var disappointed = ["disappointed", "upset", "disheartened"]
  var anti = ["anti-LGBTQ", "anti-trans", "homophobic", "transphobic"]
  var recent = ["the last few", "recent", "the past few"]
  var showing = ["supporting", "showing support for", "uplifting"]
  var pride = ["Pride", "Pride Month"]
  var wont = ["won't", "will not"]
  var performative = ["rainbow capitalism", "rainbow-washing", "performative allyship"]
  var demand = ["demanding that", "imploring", "urging"]
  var bigoted = ["intolerant", "harmful", "bigoted", "damaging", "destructive"]
  var queer = ["LGBTQ+", "queer"]
  var fund = ["fundraiser", "fund"]
  
  var email = `To whom it may concern:\n\nAs a ${rand(loyal)} ${rand(customer)}, I am ${rand(incredibly)} ${rand(disappointed)} that you have donated ${hash["TOTAL"]} to ${rand(anti)} politicians and PACs in ${rand(recent)} years despite ${rand(showing)} the ${rand(queer)} community during ${rand(pride)}. I ${rand(wont)} tolerate ${rand(performative)}, so I am ${rand(demand)} you match your ${rand(bigoted)} donation of ${hash["TOTAL"]} to a tax-deductible ${rand(fund)} for struggling ${rand(queer)} youth:\n\nhttps://secure.actblue.com/donate/paybackpride`
  var emails = hash["Emails"].replace(" ", "")
  var emailLetter = encodeURIComponent(email)
  var subjects = [`${rand(showing)} ${rand(queer)} Youth`, `${rand(performative)} During ${rand(pride)}`, `${rand(pride)} ${rand(fund)}`, `${rand(anti)} Practices`]
  var emailLink=`mailto:${emails}?subject=${encodeURIComponent(rand(subjects).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()))}&body=${emailLetter}`
  return emailLink
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function fromDollar(money) {
  var int = parseInt(money.replace(/[$,]+/g,""))
  return int
}

for (var i = 0; i < companies.length; i++) {
  companies[i]["To Candidates"] = formatter.format(parseInt(companies[i]["To Candidates"].replace(/[$,]+/g,"")))
  companies[i]["To PACs"] = formatter.format(parseInt(companies[i]["To PACs"].replace(/[$,]+/g,"")))
  companies[i]["TOTAL"] = formatter.format(parseInt(companies[i]["TOTAL"].replace(/[$,]+/g,"")))
}

for (var i = 0; i < companies.length; i++) {
  var group_dons = {"RSLC": 0, "RGA": 0, "RAGA": 0}
  var cand_dons = []
  var billsHelped = []
  for (var j = 0; j < group_donations.length; j++) {
    if (companies[i]["COMPANY"] == group_donations[j]["COMPANY"]) {
      group_dons[`${group_donations[j]["GROUP"]}`] += group_donations[j]["DONATION"]
    }
  }
  for (var j = 0; j < candidate_donations.length; j++) {
    if (companies[i]["COMPANY"] == candidate_donations[j]["Company"]) {
      cand_dons.push(candidate_donations[j])
    }
  }
  for (var j = 0; j < cand_dons.length; j++) {
    for (var k = 0; k < bills.length; k++)
    if (bills[k].includes(cand_dons[j]["State"]) && !billsHelped.includes(bills[k])) {
      billsHelped.push(bills[k])
    }
  }
  companies[i]["Group Donations"] = group_dons
  companies[i]["Candidate Donations"] = cand_dons
  companies[i]["Bills Facilitated"] = billsHelped.length
  companies[i]["Bills"] = billsHelped
}

for (var i = 0; i < subsidiaries.length; i++) {
  var element = subsidiaries[i]
  var parent_hash = companies.find(e => e["COMPANY"] == element["Parent Company"])
  parent_hash["Category"] += ` ${element["Category"]}`
}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  let th = document.createElement("th");
  row.appendChild(th);
  for (let key of data) {
    // if (key != "Logo" && key != "Group Donations" && key != "Candidate Donations" && key != "Subsidiaries & Products" && key != "Bills" && key != "2023 Pride Post IG" && key != "2023 Pride Post Twitter") {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    // }
  }
  // var th1 = document.createElement("th");
  // var text1 = document.createTextNode("Email");
  // th1.appendChild(text1);
  // row.appendChild(th1);
  // var th2 = document.createElement("th");
  // var text2 = document.createTextNode("Tweet");
  // th2.appendChild(text2);
  // row.appendChild(th2);
  // var th3 = document.createElement("th");
  // var text3 = document.createTextNode("Instagram");
  // th3.appendChild(text3);
  // row.appendChild(th);
}

function generateTable(table, data, data2) {
  for (let element of data) {
    var row = table.insertRow();
    // if (plus) {
      var cell = row.insertCell();
      let text = document.createTextNode("+");
      cell.appendChild(text);
    // }
    for (key in element) {
      // if (key != "Logo" && key != "Group Donations" && key != "Candidate Donations" && key != "Subsidiaries & Products" && key != "Bills" && key != "2023 Pride Post IG" && key != "2023 Pride Post Twitter") {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      // }
    }
    // let row2 = table.insertRow();
  }
  for (let element of data2) {
    var row = table.insertRow();
    // if (plus) {
      var cell = row.insertCell();
      let text = document.createTextNode("+");
      cell.appendChild(text);
    // }
    var parent_hash = companies.find(e => e["COMPANY"] == element["Parent Company"])
    var hash = {
      "COMPANY": element["Company"],
      "Parent Company": element["Parent Company"],
      "Subsidiaries & Products": "",
      "To Candidates": parent_hash["To Candidates"],
      "To PACs": parent_hash["To PACs"],
      "TOTAL": parent_hash["TOTAL"],
      "Logo": element["Logo"],
      "Category": element["Category"],
      "2023 Pride Post IG": "",
      "2023 Pride Post Twitter": "",
      "IG @": element["Instagram @"],
      "Twitter @": element["Instagram @"],
      "Emails": parent_hash["Emails"],
      "Group Donations": "",
      "Candidate Donations": "",
      "Bills Facilitated": "",
      "Bills": "",
    }
    for (key in hash) {
      // if (key != "Logo" && key != "Group Donations" && key != "Candidate Donations" && key != "Subsidiaries & Products" && key != "Bills" && key != "2023 Pride Post IG" && key != "2023 Pride Post Twitter") {
        let cell = row.insertCell();
        let text = document.createTextNode(hash[key]);
        cell.appendChild(text);
      // }
    }
    // let row2 = table.insertRow();
  }
}

function makeMiniTable(row, data, i) {
  $(row).append('<td><h5>Donation Details</h5><table id="mini"><tbody id="tbody"></tbody></table></td>')
  let table = document.getElementById("mini");
  // generateTableHead($("#mini", row)[0], Object.keys(data[0]))
  generateTable($("tbody", row)[i], data, false);
}

function donorDetail(rowData) {
  var company = rowData[2].replace("&amp;", "&")
  var comp_obj = companies.find(element => element["COMPANY"] == company)
  var states = getStates(comp_obj["Bills"]).sort()
  
  var to_return = `<table class="mini">
  <thead><tr><th>State</th><th>Donated To</th><th>Donation Amount</th><th>Bills Passed</th><th>Type of Bills</th></tr></thead><tbody>`
  for (var i = 0; i<states.length; i++) {
    state_donations = comp_obj["Candidate Donations"].filter(element => element["State"] == states[i])
    bodies = []
    donationAmount = 0
    for (var j = 0; j<state_donations.length; j++) {
      donationAmount += fromDollar(state_donations[j]["Amount"])
      if (!bodies.includes(state_donations[j]["Position"])) {
        bodies.push(state_donations[j]["Position"])
      }
    }
    if (bodies.length > 1) {
      bodies.pop()
      bodies[0] = "Governor & Legislature"
    }
    
    billsPassed = comp_obj["Bills"].filter(element => getStates([element])[0] == states[i])
    billTypes = []
    for (law in laws[states[i]]) {
      if (laws[states[i]][law] == "Y") {
        billTypes.push(law)
      }
    }


        
    to_return += `<tr>`
    // state
    to_return += `<td>${stateAbbv[states[i]]}</td>`
    
    // donation type
    to_return += `<td>${bodies[0]}</td>`

    // donation amount
    to_return += `<td>${formatter.format(donationAmount)}</td>`

    // passed
    to_return += `<td>${billsPassed.join(", ")}</td>`

    // bill types
    to_return += `<td>${billTypes.join(", ")}</td>`
    
    to_return += `</tr>`
  }
  to_return += `</tbody></table>`
  return to_return
}

function getStates(bills) {
  var states = []
  for (var i = 0; i<bills.length; i++) {
    var substring = bills[i].substring(0, 2)
    if (!states.includes(substring)) {
      states.push(substring)
    }
  }
  return states
}

let table = document.querySelector("table");
let data = Object.keys(companies[0]);
generateTableHead(table, data)
generateTable(document.querySelector("tbody"), companies, subsidiaries);

$(document).ready(function() {
  // currentNum = 0
  // $('tbody tr').each(function (i) {
  //   if (this.innerHTML != "") {
  //     this.className = "expandMe"
  //   } else {
  //     this.className = "childCell"
  //     // makeMiniTable(this, companies[currentNum]["Group Donations"], 0)
  //     makeMiniTable(this, companies[currentNum]["Candidate Donations"], 0)
  //     currentNum+=1
  //   }
  // })
  // $('body').on('click', 'tr', function () {
  //       console.log("clicked")
  //       $(this).find(".card small").show('slow')
  //       // $('#dialog').show();
  //       // return false;
  //   });
  // $("#gfg").on("keyup", function() {
  //       var value = $(this).val().toLowerCase();
  //       $("tbody tr").filter(function() {
  //           $(this).toggle($(this).text()
  //           .toLowerCase().indexOf(value) > -1)
  //         $('.childCell').hide()
  //       });
  //   });
  // $('th')[0].onclick = function() { normalSort() };
  // $('th')[3].onclick = function() { sortTable(3) };
  // $('th')[4].onclick = function() { sortTable(4) };
  // $('th')[5].onclick = function() { sortTable(5) };
  // $(function() {
  //   $('.expandMe').on('click', function() {
  //       $(this).toggleClass('selected').closest('tr').next().toggle();
  //   })
  // });
  // var detailRows = [];
  addSelect()
  var dt = $('#table').DataTable({
    paging: false,
    scrollY: 600,
    "dom": '<lf<t>>',
    order: [[6, 'desc']],
    colReorder: {
            order: [0, 7, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
        },
    columnDefs: [
            {
                targets: [0, 3, 4, 5, 8, 9, 10, 14, 15, 16, 17],
                visible: false
            },
            {
                targets: [0, 7, 3, 8, 11, 12, 13],
                orderable: false
            },
            {
                targets: 7, 
                mRender: function(data, type, full) {
                    toReturn = ''
                    if (full[1] != '' && isLowerCase(full[1])) {
                      toReturn = `<img src="assets/${full[1]}.jpeg"/>`
                    }
                  return toReturn
                }
            },
            {
                targets: 11,
                // data: null,
                // defaultContent: '<button>Click!</button>',
                mRender: function(data, type, full) {
                  toReturn = ''
                  if (full[11] != '') {
                    ig = full[11].replace("@", "")
                    toReturn = '<a class="btn btn-info btn-sm" target="_blank" href="instagram.com/' + ig + '""><i class="fa-brands fa-instagram"></i></a>'
                  }
                  return toReturn
                }
            }, 
            {
                targets: 12,
                // data: null,
                // defaultContent: '<button>Click!</button>',
                mRender: function(data, type, full) {
                  toReturn = ''
                  if (full[12] != '') {
                    twitter = full[12]
                    if (full[12].includes(",")) {
                      arr = full[12].split(", ")
                      twitter = rand(arr)
                    }
                    twitter = twitter.replace("@", "")
                    var tweet = `hey @${twitter},\nSupporting Pride is great, but not when you've donated ${full[6]} to anti-LGBTQ+ politicians and PACs in recent years.\nRight your wrongs by matching your donation to LGBTQ+ nonprofits in the South. It's time to #PayBackPride.`

                    toReturn = '<a class="btn btn-info btn-sm" target="_blank" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet) + '&url=https://secure.actblue.com/donate/paybackpride"><i class="fa-brands fa-twitter"></i></a>'
                  }
                  return toReturn
                }
            },
            {
                targets: 13,
                // data: null,
                // defaultContent: '<button>Click!</button>',
                mRender: function(data, type, full) {
                  toReturn = ''
                  company = ''
                  if (full[2] != '') {
                    company = full[2]
                  } else {
                    company = full[1]
                  }
                  toReturn = '<a class="btn btn-info btn-sm email" target="_" href="' + emailLink(data) + '"">Send Email</a>'
                  return toReturn
                }
            },
            {
                targets: 2,
                className: "smaller"
            },
            {
                targets: 1,
                className: "title",
                mRender: function(data, type, full) {
                  return data.toUpperCase()
                }
            },
        ], 
    
  });
  // var detailRows = [];

  // $('#table tbody').on('click', 'tr', function () {
  //     var tr = $(this).closest('tr');
  //     var row = dt.row(tr);
  //     if (row.child.isShown()) {
  //         tr.removeClass('details');
  //         row.child.hide();
          
  //     } else {
  //         tr.addClass('details');
  //         row.child(donorDetail(row.data())).show();
          
  //     }
  // });
  
  $('.sorting_disabled').eq(1).text('');
  $('.sorting_disabled').eq(0).css('visibility', 'hidden')
  $('.money').click(function() {
    dt.order( [[ 6, 'desc' ]] ).draw()
  })
  $('.name').click(function() {
    dt.order( [[ 2, 'asc' ]] ).draw()
  })
  $('select').on('change', function() {
    dt.search(this.value).draw();
  })
  $('td').each(function() {
    if (this.innerHTML == "") {
      $(this).hide()
    }
  })
  // dt.on('draw', function () {
  //     detailRows.forEach(function(id, i) {
  //         $('#' + id + ' td.details-control').trigger('click');
  //     });
  // });
  // $( "table" ).wrap( "<div class='scroll'></div>" );
  // for (var i = 0; i < companies.length; i++) {
  //   var theClass = "." + companies[i]["Category"].toLowerCase()
  //   theClass = theClass.replace("&","").replace("  ", "")
  //   console.log(theClass + " - " + companies[i]["COMPANY"])
  //   if (theClass != ".") {
  //     $(".row").append(`<div class="column">
  //   <div class="card">
  //     <h4>${companies[i]["COMPANY"]}
  //     <small hidden>${companies[i]["Subsidiaries & Products"]}</small>
  //     </h4>
  //     <img class="logo" src="${companies[i]["Logo"]}"/>
  //     <p>${companies[i]["TOTAL"]}</p>
  //   </div>
  // </div>`)
  //   }
  // }
});

