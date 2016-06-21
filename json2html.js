function jsontotable(ajaxurl, divid, cssclass,paging,search) {
    var DefaultPageIndex = 10;
    var paging = paging;
    jQuery.support.cors = true;
    $.ajax({
        url: ajaxurl,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        complete: function () {
            $('#ajaxstatus').hide();
        },
        success: function (response) {
            var json = JSON.parse(response.d);
            var gridfinal = "<div class='ajaxgriddiv'><div style='float:left'><span id='pgind'>Page Size: <select id='page_index'><option>10</option><option>25</option><option>50</option><option>100</option></select></span></div><div style='float:right'><span id='search'>Search: <input type='text' id='grid_search'/></span></div><br/>";
            gridfinal += tablemaker(json, cssclass);
            $('#' + divid).append(gridfinal);
            var tabletrdata = $('#' + divid).find('table tbody');
            if (paging == true) {
                //Makes Grid Consists Number of rows depend on DefaultPageIndex value
                pageindex($('#' + divid).find('#page_index').val(), divid);
                //Page Index Change Event
                pageindexchange(divid);
                //Do Pagination
                doPaginate(divid);
                //Process Pagination
                paginationtrigger(divid);
            }
            else {
                $('#pgind').hide();
            }
            //Search Grid
            if (search == true) {
                gridsearch(divid, paging);
            }
            else {
                $('#search').hide();
            }
        },
        error: function (xhr, status, error) {
            $('#' + divid).empty().html('<div class="ajaxgriddiv"><h3 class="ajaxerrortext">"Error Info: ' + $(xhr.responseText).filter('title').text() + '"</h3></div>');
        }
    })
};
function gridsearch(divid,paging) {
    var tgtdivid = $('#' + divid);
    tgtdivid.find('#grid_search').keyup(function () {
        var srchtxt = tgtdivid.find('#grid_search').val().toLowerCase();
        if (srchtxt.length > 2) {
            tgtdivid.find('table tbody tr').each(function () {
                var tdata = "";
                $(this).find('td').each(function () {
                    tdata += $(this).html().toLowerCase().replace(' ','');
                })
                if (tdata.indexOf(srchtxt) > -1) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            })
            if (paging == true) {
                doPaginateForSearch(divid);
            }
        }
        else {
            tgtdivid.find('table tbody tr').each(function () {
                $(this).show();
                if (paging == true) {
                    doPaginate(divid);
                    pageindex(tgtdivid.find('#page_index').val(), divid);
                    paginationtrigger(divid);
                }
            })
        }
    });
}
function Ajaxloading(Status, divid) {
    var tbodyhgt = parseInt($('#' + divid).find('table tbody').height());
    $('#' + divid).find('.gridloading').css('margin-top', (tbodyhgt / 2));
    if (Status == On) {
        $('#' + divid).find('.gridloading').show();
        $('#' + divid).find('table tbody').css('opacity', '0.2');
    }
    else {
        $('#' + divid).find('.gridloading').hide();
    }
}
function pageindexchange(divid) {
    var tgtdivid = $('#' + divid);
    tgtdivid.find('#page_index').on('change', function () {
        doPaginate(divid);
        pageindex(tgtdivid.find('#page_index').val(), divid);
        paginationtrigger(divid);
    });
}
function tablemaker(json, cssclass) {
    var json = $(json);
    var table = '<table class=' + cssclass + '>';
    var thead = "<thead>";
    var tbody = "<tbody>";
    var loading = "<div class='gridloading'><i class='fa fa-spinner fa-spin fa-5x fa-fw margin-bottom'></i></div>";
    if (json.length > 0) {
        for (var i = 0; i < json.length ; i++) {
            tbody += "<tr>";
            for (var key in json[i]) {
                var attrValue = json[i][key];
                tbody += '<td>' + attrValue + "</td>";
                if (i == 0) {
                    thead += '<td>' + key.replace('_', ' ') + '</td>';
                }
            }
            thead += '</thead>';
            tbody += "</tr>";
        }
        table += thead;
        tbody += "</tbody>";
        table += tbody;
        table += "</table>";
        table += "<div class='gridfoot'><span id='Recordinfo'></span><span class='Pagination'></span></div>";
        return table;
    }
    else {
        var norecordhtml = "<h1 style='text-align:center'>No Records Found In JSON</h1>";
        return norecordhtml;
    }
}
function pageindex(indexsize, divid) {
    var tgtdivid = $('#' + divid);
    var tr = tgtdivid.find('table tbody tr').each(function () {
        if ($(this).index() < indexsize) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
   // tgtdivid.find('#Recordinfo').empty().html('Records 1-' + $('#page_index').val());
}
function doPaginate(divid) {
    var tgtdivid = $('#' + divid);
    var totalrows = tgtdivid.find('table tbody tr').length; //no of rows in a table
    var pageindex = tgtdivid.find('#page_index').val(); //current pageindex size
    var pagescount = (totalrows / pageindex);
    var paginationhtml = "<ul class='pagination pagination-sm'>";
    paginationhtml += "<li><a>Prev</a></li>";
    //paginationhtml += "<a>Prev</a>";
    for (var i = 0; i < pagescount; i++) {
        paginationhtml += '<li><a>' + (i + 1) + "</a></li>";
    }
    paginationhtml += "<li><a>Next</a></li></ul>";
    tgtdivid.find('.Pagination').empty().html(paginationhtml);
}
function doPaginateForSearch(divid) {
    var tgtdivid = $('#' + divid);
    var totalrows = tgtdivid.find('table tbody tr:visible').length; //no of rows in a table
    var pageindex = tgtdivid.find('#page_index').val(); //current pageindex size
    var pagescount = (totalrows / pageindex);
    var paginationhtml = "<ul class='pagination pagination-sm'>";
    paginationhtml += "<li><a>Prev</a></li>";
    //paginationhtml += "<a>Prev</a>";
    for (var i = 0; i < pagescount; i++) {
        paginationhtml += '<li><a>' + (i + 1) + "</a></li>";
    }
    paginationhtml += "<li><a>Next</a></li></ul>";
    tgtdivid.find('.Pagination').empty().html(paginationhtml);
}
function paginate(pagenum, divid) {
    var tgtdivid = $('#' + divid);
    var to = (pagenum * tgtdivid.find('#page_index').val());
    var from = (to - tgtdivid.find('#page_index').val());
    if (from < tgtdivid.find('table tbody tr').length & to > 1) {
        tgtdivid.find('table tbody tr').each(function () {
            $(this).show();
            var i = $(this).index() + 1;
            if (i > from & i < to + 1) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        });
        if (to <= tgtdivid.find('table tbody tr').length) {
            //tgtdivid.find('#Recordinfo').empty().html('Records ' + (from + 1) + '-' + (to));
        }
        else {
            //tgtdivid.find('#Recordinfo').empty().html('Records ' + (from + 1) + '-' + (parseInt(tgtdivid.find('table tbody tr').length)));
        }
    }
    tgtdivid.find('#currentpagenum').empty().html(pagenum);
}
function paginationtrigger(divid) {
    var tgtdivid = $('#' + divid);
    tgtdivid.find('.Pagination a').click(function () {
        if ($(this).html() == "Prev") {
            var targetli = (parseInt(tgtdivid.find('li.active a').html()) - 1);
            tgtdivid.find('.Pagination li').removeClass('active');
            tgtdivid.find('.Pagination li a:contains(' + targetli + ')').parent('li').addClass('active');
            paginate(targetli, divid);
        }
        else if ($(this).html() == 'Next') {
            var targetli = (parseInt(tgtdivid.find('li.active a').html()) + 1);
            if (isNaN(targetli)) {
                tgtdivid.find('.Pagination li a:contains("2")').parent('li').addClass('active');
                paginate(2, divid);
            }
            else {
                tgtdivid.find('.Pagination li').removeClass('active');
                tgtdivid.find('.Pagination li a:contains(' + targetli + ')').parent('li').addClass('active');
                paginate(parseInt(targetli), divid);
            }
        }
        else {
            tgtdivid.find('.Pagination li').removeClass('active');
            $(this).parent('li').addClass('active');
            paginate($(this).html(), divid);
        }
    })
}
