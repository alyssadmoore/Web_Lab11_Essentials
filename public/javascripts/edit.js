$(function(){
   $("#name").click(function(){
       // If no name input, create & add one
       if ($('#newName').length == 0){
           addInput($(this));
       }
   });

   // Listener for escape key, remove input
   $('body').keyup(function(event){
       if (event.which == 17){
           removeInput();
       }
   });
});

// Add input text field
function addInput(element){
    var input = '<input id="newName" placeholder = "New name"/>';
    element.append(input);

    // Enter key listener
    $('#newName').keypress(function(event){
        if (event.which == 13){
            //todo
        }
    });
}

function removeInput(){
    $('#newName').remove();
}