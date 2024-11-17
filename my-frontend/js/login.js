const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
console.log('login once')
        if (storedUser) {
            $('#welcomeMessage').text(`Welcome,${storedUser[0].name}`).fadeIn().addClass('welcome-animated');
            setTimeout(() => {
                 window.location.href = 'http://localhost:5000/main.html'; 
            }, 2000);
        
        }
$('#loginButton').off().on('click',function () {
    // Get username and password
    const ldapVal = $('#ldap').val();
    var user = allusers.filter(user => 
        user.ldap.toLowerCase().includes(ldapVal)
    );
    // Validate input
    console.log('user',user.length,user)
    if (user.length>0) {
        const username=  user[0].name ? user[0].name : '';
        $('#welcomeMessage').text(`Welcome,${username}`).fadeIn().addClass('welcome-animated');
        setTimeout(() => {
            window.location.href = 'http://localhost:5000/main.html'; 
        }, 2000);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    } else {
        alert('Please enter both username and password!');
    }
});

