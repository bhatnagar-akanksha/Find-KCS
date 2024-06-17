var test=[
        {
        'name':"KCS TITLE1",
        'description':"testetstets",
        'createdBy':'Akanksha Bhatnagar',
        'createdOn':'21-06-2024',
        'tags':['feeds','warehouse'],
        'ticketID':'E-12343444'
    },
        {
            'name':"KCS TITLE1",
            'description':"testetstets",
            'createdBy':'Akanksha Bhatnagar',
            'createdOn':'12-06-2024',
            'tags':['test-feeds','warehouse'],
            'ticketID':'E-1234555',
        }

]
    
function format(d) {
    // `d` is the original data object for the row
    return (
        '<dl>' +
        '<dt style="display= inline-block">Description:</dt>' +
        '<dd style="display= inline-block">' +
        d.description +
        '</dd>' +
        '</dl>'
    );
}

let table = new DataTable('#myTable', {
 data:test,
 columns: [
    {
        className: 'dt-control',
        orderable: false,
        data: null,
        defaultContent: ''
    },
    { data: 'name' },
     {data: ''},
    { data: 'createdOn' },
    { data: 'createdBy' },  
    { data: 'ticketID' },
    { data: 'description', visible:false }
   
 
],
columnDefs: [
    {
        targets: 0,
        render: function (data, type, row, meta) {
            return `<span style='background-color:pink; border-radius:100%'></span>`;
        }
    },
    {
        targets: 2,
        render: function (data, type, row, meta) {

            return `<p class='tags'>${row.tags[0]}</p>`;
        }
    },
    {
            "defaultContent": "-",
            "targets": "_all"
          }
],
// columnDefs: [{
//     "defaultContent": "-",
//     "targets": "_all"
//   }]
})
table.on('click', 'td.dt-control', function (e) {
    let tr = e.target.closest('tr');
    let row = table.row(tr);
 
    if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
    }
    else {
        // Open this row
        row.child(format(row.data())).show();
    }
});