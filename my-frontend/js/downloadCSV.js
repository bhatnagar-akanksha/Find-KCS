
  // jQuery click event for button
  $('#download-btn').click(() => {
    startLoading()
    $.ajax({
      url: '/api/articles',
      method: 'GET',
      success: function(allData) {
        stopLoading()
          console.log(allData.articles); // Log the articles to see them
            
          const skipColumns = ['_id','uuid','__v']; // Columns to skip
          const csv = convertToCSV(allData.articles, skipColumns);
          downloadCSV(csv, 'data.csv');  
      },
      error: function(error) {
          console.log('Error fetching articles', error);
          $.notify("Error fetching article please fetch again", "error");
          stopLoading()
      }
  });
   
  });

  function convertToCSV(data, skipColumns = []) {
    const keys = Object.keys(data[0]).filter(key => !skipColumns.includes(key)); // Filter out keys to skip
    const csvRows = [keys.join(',')]; // Column headers

    data.forEach(row => {
      const values = keys.map(key => JSON.stringify(row[key]));
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }
   
  
//   function convertToCSV(data) {
//     const keys = Object.keys(data[0]);
//     const csvRows = [keys.join(',')]; // Column headers

//     data.forEach(row => {
//       const values = keys.map(key => JSON.stringify(row[key]));
//       csvRows.push(values.join(','));
//     });

//     return csvRows.join('\n');
//   }

  // Function to download CSV file
  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = $('<a></a>')
      .attr('href', url)
      .attr('download', filename)
      .appendTo('body');
    a[0].click();
    a.remove();
    URL.revokeObjectURL(url);
  }
