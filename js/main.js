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
            'name':"KCS TITLE8",
            'description':"testetstets",
            'createdBy':'Shruti Pradhan',
            'createdOn':'12-06-2024',
            'tags':['test-feeds','warehouse'],
            'ticketID':'E-1234555',
        },
        {
            'name':"KCS TITLE2",
            'description':"testetstets",
            'createdBy':'Akanksha Bhatnagar',
            'createdOn':'12-06-2024',
            'tags':['test-feeds','warehouse'],
            'ticketID':'E-1256788',
        },
        {
            'name':"KCS TITLE0",
            'description':"testetstets",
            'createdBy':'Rishita',
            'createdOn':'12-06-2024',
            'tags':['test-feeds','warehouse'],
            'ticketID':'E-123497',
        },
        {
            'name':"KCS TITLE4",
            'description':"testetstets",
            'createdBy':'Faraz',
            'createdOn':'12-06-2024',
            'tags':['test-feeds','warehouse'],
            'ticketID':'E-123546567',
        },
        {
            'name':"KCS TITLE5",
            'description':"testetstets",
            'createdBy':'Nilotpal',
            'createdOn':'12-06-2024',
            'tags':['calcudated matrics','warehouse'],
            'ticketID':'E-12345557',
        },
        {
            'name':"KCS TITLE6",
            'description':"testetstets",
            'createdBy':'Akanksha Bhatnagar',
            'createdOn':'12-06-2024',
            'tags':['segment','warehouse'],
            'ticketID':'E-123455455',
        }




]
    
function format(d) {
    // `d` is the original data object for the row
    return (
        '<dl>' +
        '<dt style="display: inline-block">Description:</dt>' +
        '<dd style="display: inline-block">' +
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