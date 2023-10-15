//Profile form:
const userCountersForm = $("#profile")
const amountField = userCountersForm.find("[name=amount]")
const amountInputValue = userCountersForm.find("[name=input_value_for_amount]")
const dayCounterField = userCountersForm.find("[name=day_counter]")
const profileErrors = $("#profileErrors")
const resetButton = userCountersForm.find("[id=reset]")

const DAY_COUNTER_MAX = 92

//Comments:
const commentFormElement = $(`<form>
                                <fieldset class="form-group position-relative">
                                    <label class="property-phonenumber float-left"></label>
                                    <textarea name="comment" class="form-control" placeholder=":Comment"></textarea>
                                </fieldset>
                                <button type="submit" class="btn btn-primary position-relative float-left">EDIT</button>
                                <button type="button" name="del" class="mx-1 btn btn-primary position-relative float-left">DEL</button>
                                <input name="id" style="visibility:hidden">
                            </form>`)
const commentsBlock = $("#comments")
const commentErrors = $("#commentErrors")
const newComment = $("#comment")

//For css styles:
const errorColor = 'red'
const reachUpperBoundColor = 'green'

$.ajax({
    type: 'GET',
    url: `${backendUrl}/api/profile`,
    cors: true ,
    crossDomain: true,
    enctype: 'multipart/form-data',
    beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('access_token'))
        xhr.setRequestHeader('Access-Control-Allow-Origin', $(location).attr("origin"))
    },
    success: function(response, status, xhr){
        console.log("data", response)
        amountField.val(response["amount"])
        dayCounterField.val(response["day_counter"])

        if (response['day_counter'] == DAY_COUNTER_MAX){
            dayCounterField.css({ 'border-color': reachUpperBoundColor })
        }

        for (let comment of response["comments"]){
            console.log('comment', comment)
            commentInstance = commentFormElement.clone()
            commentInstance.find("[name=comment]").val(comment.comment)
            
            commentInstance.find("[name=id]").val(comment.id)
            commentInstance.find("label").text(new Date(comment.published).toLocaleDateString(
                "il-IL", { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    hour: 'numeric', 
                    minute: 'numeric' }
            ))

            liElement = $('<li>').append(commentInstance)
            commentsBlock.append(liElement)
            commentsBlock.append($('<br>'))
            commentsBlock.append($('<br>'))
        }

    },
    error: function(jqxhr, status, exception){
        responseText = eval("(" + jqxhr.responseText + ")")
        console.log("resptext", responseText)
    }
})

resetButton.on('click', (event) => {
    event.preventDefault()
    formData = userCountersForm.serialize()
    confirmation = confirm("Are you sure to reset profile?")

    if(confirmation){
        $.ajax({
            type: 'PUT',
            data: formData,
            url: `${backendUrl}/api/updateProfile/?reset=true`,
            cors: true ,
            crossDomain: true,
            enctype: 'multipart/form-data',
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('access_token'))
                xhr.setRequestHeader('Access-Control-Allow-Origin', $(location).attr("origin"))
            },
            success: function(response, status, xhr){
                window.location.replace($(location).attr("origin"))
            },
            error: function(jqxhr, status, exception){
                var responseText = eval("(" + jqxhr.responseText + ")")

                for (let error of responseText.error){
                    profileErrors.append($('<li>').text(error.message).css('color', errorColor))
                }
            }
        })
    }   
})

commentsBlock.on('submit', (event) => {
    event.preventDefault()
    var formData = $(event.target).serialize()
    var { id } = Object.fromEntries(new URLSearchParams(formData))

    $.ajax({
        type: 'PUT',
        url: `${backendUrl}/api/comment/?id=${id}`,
        data: formData,
        cors: true ,
        crossDomain: true,
        enctype: 'multipart/form-data',
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('access_token'))
            xhr.setRequestHeader('Access-Control-Allow-Origin', $(location).attr("origin"))
        },
        success: function(response, status, xhr){
            window.location.replace($(location).attr("origin"))
        },
        error: function(jqxhr, status, exception){
            var responseText = eval("(" + jqxhr.responseText + ")")
            console.log("resp text", responseText)
            $(event.target).find("[name=comment]").css('color', errorColor)
        }
    })
})


commentsBlock.on('click', (event) => {
    event.preventDefault()
    var button = $(event.target)
    var form = $(event.target.parentElement)
    var formData = form.serialize()
    var { id } = Object.fromEntries(new URLSearchParams(formData))

    if(button.attr('type') == 'submit'){
        form.submit()
        return
    }
    else if (button.attr('name') !== 'del'){
        return
    }
    $.ajax({
        type: 'DELETE',
        url: `${backendUrl}/api/comment/?id=${id}`,
        cors: true ,
        crossDomain: true,
        enctype: 'multipart/form-data',
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('access_token'))
            xhr.setRequestHeader('Access-Control-Allow-Origin', $(location).attr("origin"))
        },
        success: function(response, status, xhr){
            window.location.replace($(location).attr("origin"))
        },
        error: function(jqxhr, status, exception){
            var responseText = eval("(" + jqxhr.responseText + ")")
            $(event.target.parentElement).find("[name=comment]").css('color', errorColor)
        }
    })
})

newComment.on('submit', (event) => {
    event.preventDefault()
    formData = newComment.serialize()

    $.ajax({
        type: 'POST',
        url: `${backendUrl}/api/comment`,
        data: formData,
        cors: true ,
        crossDomain: true,
        enctype: 'multipart/form-data',
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('access_token'))
            xhr.setRequestHeader('Access-Control-Allow-Origin', $(location).attr("origin"))
        },
        success: function(response, status, xhr){
            window.location.replace($(location).attr("origin"))
        },
        error: function(jqxhr, status, exception){
            var responseText = eval("(" + jqxhr.responseText + ")")

            for (let error of responseText.error){
                commentErrors.append($('<li>').text(error.message).css('color', errorColor))
            }
        }
    })
    
})

userCountersForm.on('submit', (event) => {
    event.preventDefault();
    var amountInputedValue = amountInputValue.val()

    if (amountInputedValue){
        amountField.val(amountInputedValue)
    }
    var formData = userCountersForm.serialize();
    $.ajax({
        type: 'PUT',
        url: `${backendUrl}/api/updateProfile`,
        data: formData,
        cors: true ,
        crossDomain: true,
        enctype: 'multipart/form-data',
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('access_token'))
            xhr.setRequestHeader('Access-Control-Allow-Origin', $(location).attr("origin"))
        },
        success: function(response, status, xhr){
            window.location.replace($(location).attr("origin"))
        },
        error: function(jqxhr, status, exception){
            var responseText = eval("(" + jqxhr.responseText + ")")

            for (let error of responseText.error){
                profileErrors.append($('<li>').text(error.message).css('color', errorColor))
            }
        }
    })
})