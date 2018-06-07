$(document).ready(function(){

    /*********************************************************
     ******* View Logic (show/remove rows in table) **********
     *********************************************************/

    // add new message to table
    var tableShowMessage = function (key, values) {
        var table = $('#table-messages');
        var created = (values.created ? moment(values.created).format('YYYY-MM-DD, HH:mm:ss') : '<em>no info</em>');
        var edited = (values.edited ? moment(values.edited).format('YYYY-MM-DD, HH:mm:ss') : '<em>not yet</em>');
        var newEntry = '<tr id="' + key + '"><td class="title">' + values.title + '</td><td class="message">' + values.message + '</td>' +
            '<td class="created">' + created + '</td><td class="created">' + edited + '</td>' +
            '<td class="table-col-action"><div class="btn-group">' +
            '<button class="btn btn-secondary button-edit">edit</button><button class="btn btn-secondary button-delete">delete</button>' +
            '</div></td></tr>';
        table.html(table.html() + newEntry);
    };

    // show message modification in table
    var tableModifyMessage = function(key, values) {
        $('#' + key + ' .title').text(values.title);
        $('#' + key + ' .message').text(values.message);
    };

    // remove a message from table
    var tableDeleteMessage = function (key) {
        $('#' + key).remove();
    };

    /*******************************************************
     ***** Firebase DB Logic (listen for changes) **********
     *******************************************************/

    // listen for new messages
    firebase.database().ref('messages').on('child_added', function(snapshot) {
        tableShowMessage(snapshot.key, snapshot.val());
    });

    // listen for modified messages
    firebase.database().ref('messages').on('child_changed', function(snapshot) {
        tableModifyMessage(snapshot.key, snapshot.val());
    });

    // listen for deleted messages
    firebase.database().ref('messages').on('child_removed', function(snapshot) {
        tableDeleteMessage(snapshot.key);
    });

    /********************************************************
     ****** Form Logic (add / remove messages) **************
     ********************************************************/

    // add new message
    $('#form-add').submit(function (event) {
        var title = $('#form-add-title');
        var message = $('#form-add-message');
        var button = $('#form-add-save');
        if(title.val().length === 0 || message.val().length === 0) {
            alert('Please enter a title and a message.');
            return false;
        }
        button.prop('disabled', true);
        // save new entry to database
        var newMessageKey = firebase.database().ref().child('messages').push({
            title: title.val().replace('<', '[').replace('>', ']'), // sanitize input: < > to [ ]
            message: message.val().replace('<', '[').replace('>', ']'), // sanitize input: < > to [ ]
            created: firebase.database.ServerValue.TIMESTAMP
        }, function(error) {
            if (error) {
                alert('The message could not be saved!');
            } else {
                title.val('');
                message.val('');
                button.prop('disabled', false);
                $('#modal-add-message').modal('hide');
            }
        });
        return false;
    });

    // edit message
    $('#form-edit').submit(function (event) {
        var title = $('#form-edit-title');
        var message = $('#form-edit-message');
        var key = $('#form-edit-key').val();
        var button = $('#form-edit-save');
        if(title.val().length === 0 || message.val().length === 0) {
            alert('Please enter a title and a message.');
            return false;
        }
        button.prop('disabled', true);
        // save changes to database
        var newMessageKey = firebase.database().ref().child('messages/' + key).set({
            title: title.val().replace('<', '[').replace('>', ']'), // sanitize input: < > to [ ]
            message: message.val().replace('<', '[').replace('>', ']'), // sanitize input: < > to [ ]
            edited: firebase.database.ServerValue.TIMESTAMP
        }, function(error) {
            if (error) {
                alert('The message could not be saved!');
            } else {
                title.val('');
                message.val('');
                button.prop('disabled', false);
                $('#modal-edit-message').modal('hide');
            }
        });
        return false;
    });

    // close add modal (abort)
    $('#form-add-abort').click(function() {
        $('#modal-add-message').modal('hide');
    });

    // close edit modal (abort)
    $('#form-edit-abort').click(function() {
        $('#modal-edit-message').modal('hide');
    });

    // button "edit" for message
    $(document).on('click', '.button-edit', function(event){
        var key = this.parentNode.parentNode.parentNode.id;
        $('#form-edit-key').val(key);
        $('#form-edit-title').val($('#' + key + ' .title').text());
        $('#form-edit-message').val($('#' + key + ' .message').text());
        $('#modal-edit-message').modal('show');
    });

    // button "delete" for message
    $(document).on('click', '.button-delete', function(event){
        if(window.confirm('Are you sure you want to delete the message?')) {
            var key = this.parentNode.parentNode.parentNode.id;
            firebase.database().ref().child('messages/' + key).remove();
        }
    });
});