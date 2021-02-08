function message(status, shake = false, id = "") {
  if (shake) {
    $("#" + id).effect("shake", {
      direction: "right",
      times: 2,
      distance: 8
    }, 250);
  }
  document.getElementById("feedback").innerHTML = status;
  $("#feedback").show().delay(2000).fadeOut();
}

function mon() {
  $("#Prof").trigger("change");
};

function error(type) {
  $("." + type).css("border-color", "#E14448");
}

function gotoURL(place) {
  window.location = place;
}

// function showWait() {
//   $("#loading-overlay").show();
//   return true;
// }

function setChartName(name) {
  document.getElementById('submit').disabled = false;
  document.getElementById('submit').style.color = 'black';
  document.getElementById('submit').style.cursor = 'pointer';
  document.getElementById('chartName').value = name;
  if (name == 'ProcessingTimeReport') {
    $.ajax({
      url: "/getprofilenames",
      type: "get",
      timeout: 8000,
      success: function (response) {
        $("#Profile").html(response);
        $("#Profile").trigger("change");
      },
      error: function (x, textstatus, m) {
        if (textstatus == "timeout") {
          alert("Request Timeout, Try Again");
        }
        $("#Profile").html("<option value=\"None\" disabled selected>Could not fetch Profiles</option>");
      }
    });
    document.getElementById('ProcTimeInput').style.display = '';
    document.getElementById('taskname').style.display = '';
  } else {
    document.getElementById('ProcTimeInput').style.display = 'none';
    document.getElementById('taskname').style.display = 'none';
  }

}
$('.btn').click(function () {
  $(this).toggleClass('active');
});
// function showDesc(id){
// 	document.getElementById(id).style.display='';
// }

// function hideDesc(id){
// 	document.getElementById(id).style.display="none";
// }

$(document).ajaxStart(function () {
  $("#loading-overlay").show();
}).ajaxStop(function () {
  $("#loading-overlay").hide();
});



$(function () {

  $('#search').on('submit', function (e) {

    e.preventDefault();
    if (document.getElementById("OCid").value == "None") {
      alert("Please Select the parameter to search by");
      return;
    }
    $("#loading-overlay").show();


    var Cr = document.getElementById("OCid");
    var value = document.getElementById("OCNum");
    url = $(this).attr('action');
    // fetch(url, {
    //   method: 'post',
    //   // headers: new Headers({
    //   //   'Content-Type': 'application/x-www-form-urlencoded'
    //   // }),
    //   body: new FormData(this),
    //   timeout: 80000
    // }).then(response => {
    //   if (!response.ok) {
    //     throw new Error("Response status: " + response.status);
    //   }
    //   return response.text();
    // }).then((res) => {
    //   $("#res").html(res);
    //   $("#resblock").show();
    //   $("#loading-overlay").hide();
    // }).catch((error) => {
    //   $("#res").html(
    //     "<div class='text-center'>Request Failed, " + error +
    //     "</div>");
    //   $("#resblock").show();
    //   $("#loading-overlay").hide();
    //   console.error('Error:', error);
    // });
    $.ajax({
      url: url,
      type: "post",
      data: $('#search').serialize(),
      timeout: 80000,
      success: function (response) {
        $("#res").html(response);
        $("#resblock").show();
      },
      error: function (x, textstatus, m) {
        if (textstatus == "timeout") {
          $("#res").html("<div class='text-center'>Request Timeout! </div>");
          $("#resblock").show();
        } else {
          $("#res").html("<div class='text-center'>Request Failed, " + textstatus + "</div>");
          $("#resblock").show();
        }
      }
    });

  });

});

$(function () {

  $('#redirecturl').on('submit', function (e) {

    e.preventDefault();
    clearReports();
    $("#loading-overlay").show();
    url = $(this).attr('action');
    fetch(url, {
      method: 'post',
      body: new FormData(this),
      timeout: 80000
    }).then(response => {
      if (!response.ok) {
        throw new Error("Response status: " + response.status);
      }
      return response.json();
    }).then((res) => {
      openTab("report");
      //$("#report").html(res);
      reportPlot(res);
      $("#loading-overlay").hide();
    }).catch((error) => {
      $("#report").html(
        "<div class='container article text-center'>Request Failed, " + error +
        "</div>");
      openTab("report");
      $("#loading-overlay").hide();
      console.error('Error:', error);
    });
    // $.ajax({
    //   url: url,
    //   type: "post",
    //   data: $('#redirecturl').serialize(),
    //   timeout: 80000,
    //   success: function (response) {
    //     $("#report").html(response);
    //     openTab("report");
    //   },
    //   error: function (x, textstatus, m) {
    //     if (textstatus == "timeout") {
    //       alert("Request Timeout, Try Again");
    //     } else {
    //       alert("Not Found");
    //     }
    //     //Do Something to handle error
    //   }
    // });

  });

});

window.onload = function () {
  this.document.getElementById("rep").innerHTML = this.atob("RFlOIERhc2hCb2FyZCBUb29sIA0KDQpEZXZlbG9wZXI6DQpVcGRlc2ggU3JpdmFzdGF2YQ")
};

function showLive() {
  if ($("#Prof").val() == "custom") {
    console.log($("#fd").val());
    if ($("#fd").val() == "" || $("#td").val() == "") {
      console.error("Enter Dates");
      alert("Please input Dates");
      return
    }
  }
  $("#loading-overlay").show();
  $("#tabdet").html(" ");
  document.getElementById("Mbutton").style.display = 'None';
  url = '/getLiveData'
  fetch(url, {
    method: 'post',
    body: new FormData(document.getElementById('monitor')),
    timeout: 80000
  }).then(response => {
    if (!response.ok) {
      throw new Error("Response status: " + response.status);
    }
    return response.json();
  }).then((res) => {
    //$("#report").html(res);
    livePlot(res);
    $("#loading-overlay").hide();
  }).catch((error) => {
    document.getElementById('mon').innerHTML = "<div style='text-align:center;'>Request Failed, " + error + "</div>";
    $("#loading-overlay").hide();
    console.error('Error:', error);
  });
}

function livePlot(res) {

  if (!res.data) {
    document.getElementById('mon').innerHTML = '<p class="text-center">No Data Found</p>'
    return
  }
  var graphs = JSON.parse(res.graphJSON);
  var status = res.urls_plot;
  var timeline = res.timeline;
  var from_date = '';
  var to_date = '';
  if (timeline == 'custom') {
    from_date = res.from_date;
    to_date = res.to_date;
  }
  var myPlot = document.getElementById('mon');
  document.getElementById('mon').innerHTML = "";


  heading = '';
  layout = {
    title: heading,
    margin: {
      l: 10,
      r: 80,
      b: 60,
      t: 60
    }
  }
  Plotly.newPlot(myPlot, graphs, layout, {
    responsive: true
  });
  myPlot.on('plotly_click', function (graph) {
    for (var i = 0; i < graph.points.length; i++) {
      status = graph.points[i].label;
      $.ajax({
        url: '/showDetails',
        type: "post",
        data: {
          chart_name: "Live",
          status,
          timeline,
          from_date,
          to_date
        },
        success: function (response) {
          var myPlot = document.getElementById("tabdet");
          var graph = JSON.parse(response.table);
          var layoutdet = {
            title: 'Detailed Report',
          };
          Plotly.newPlot(myPlot, graph, layoutdet, {
            responsive: true
          });
          document.getElementById("Mbutton").onclick = function () {
            myFunction(response.csv);
          }
          document.getElementById("Mbutton").style.display = 'block';
        },
        error: function (xhr) {
          $("#tabdet").html("<div>Request Failed, Please Try Again</div>");
        }
      });

    };
  });
}

function reportPlot(resp) {
  if (!resp.data) {
    document.getElementById('piegraph').innerHTML = '<p class="text-center">No Data Found</p>'
    return
  }
  var initials = "";
  var graphs = JSON.parse(resp.graphJSON);
  var from_date = resp.from_date,
    to_date = resp.to_date;
  var profile_type = resp.profile_type,
    task_name = resp.task_name,
    chart_name = resp.chart_name,
    layout;
  var showtab = "/showDetails";
  console.log(chart_name);

  var myPlot = document.getElementById('piegraph');
  if (chart_name == "ErrorReport") {
    heading = initials.concat('Top Offenders between ', from_date, ' and ', to_date);
    layout = {
      title: heading,
      margin: {
        l: 20,
        r: 80,
        b: 10,
        t: 60
      }
    };
    Plotly.newPlot(myPlot, graphs, layout, {
      responsive: true
    });
    myPlot.on('plotly_click', function (graph) {
      for (var i = 0; i < graph.points.length; i++) {
        error_type = graph.points[i].label;
        $.ajax({
          url: showtab,
          type: "post",
          data: {
            chart_name,
            error_type,
            from_date,
            to_date
          },
          success: function (response) {
            var myPlot = document.getElementById("table");
            var graph = JSON.parse(response.table);
            var layoutdet = {
              title: 'Detailed Report',
            };
            Plotly.newPlot(myPlot, graph, layoutdet, {
              responsive: true
            });
            document.getElementById("DLbutton").onclick = function () {
              myFunction(response.csv);
            }
          },
          error: function (xhr) {
            $("#table").html("<div>Request Failed, Please Try Again</div>");
            //Do Something to handle error
          }
        });
        document.getElementById("DLbutton").style.display = 'block';
      };
    });
  } else if (chart_name == "ProcessingTimeReport") {
    var heading = initials.concat('Activity Processing time for Task "', resp.task_name, '" Under Profile "', resp.profile_type,
      '" between ', from_date, ' and ', to_date);
    console.log(heading);
    layout = {
      title: heading,
      xaxis: {
        title: 'Timestamp',
      },
      yaxis: {
        title: 'Average Response Time'
      }
    };
    Plotly.newPlot(myPlot, graphs, layout, {
      responsive: true
    });
    myPlot.on('plotly_click', function (graph) {
      for (var i = 0; i < graph.points.length; i++) {
        actdate = graph.points[i].x;
        $.ajax({
          url: showtab,
          type: "post",
          data: {
            chart_name,
            actdate,
            profile_type,
            task_name
          },
          success: function (response) {
            var myPlot = document.getElementById("table");
            var graph = JSON.parse(response.table);
            var layoutdet = {
              title: 'Detailed Report',
            };
            Plotly.newPlot(myPlot, graph, layoutdet, {
              responsive: true
            });
            document.getElementById("DLbutton").onclick = function () {
              myFunction(response.csv);
            }

          },
          error: function (xhr) {
            //Do Something to handle error
          }
        });
        document.getElementById("DLbutton").style.display = 'block';
      };
    });
  } else if (chart_name == "StuckOrderReport") {
    var layout = {
      title: 'Stuck Order Report',

    };
    Plotly.newPlot(myPlot, graphs, layout, {
      responsive: true
    });
    document.getElementById("DLbutton").onclick = function () {
      myFunction(resp.filename);
    }
    document.getElementById("DLbutton").style.display = 'block';
  }
}

function clearReports() {
  openTab('reporting')
  $("#piegraph").html("");
  $("#table").html("");
  document.getElementById("DLbutton").style.display = 'none';
}

function myFunction(file) {
  var red_loc = "/getCSV";
  var redirect_url = red_loc.concat('?q=', file);
  location.href = redirect_url;
}