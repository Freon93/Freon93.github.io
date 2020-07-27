function addLinksNext(json, option) {

    json.results.forEach(function (result) {
        $('.content').append(`<div><a href="#" link="${result.url.replace('http:', 'https:')}">${result[option]}</a></div>`);
    });
    if (json.next) {
        addLinks(json.next.replace('http:', 'https:'), option);
    } else {

        sort();
        ckickLink();
        document.getElementsByClassName('spinner')[0].style.display = 'none';
    }
}

function addLinks(link, option) {

    $.ajax({
        url: link,
        type: 'GET',
        async: true,
        success: function (response) {
            addLinksNext(response, option);
        }
    });
}

function ckickLink() {
    $('.content a').click(function () {
        $('.content').html('');
        addInformation($(this).attr('link'));
        document.getElementsByClassName('spinner')[0].style.display = 'block';
    });
}


function sort() {

    let elementToSort = document.getElementsByClassName('content')[0].getElementsByTagName('DIV');
    for (let i = 0; i < elementToSort.length - 1; i++) {
        for (let j = 0; j < elementToSort.length - 1; j++) {
            let sortArray = [elementToSort[j].getElementsByTagName('A')[0].innerText,
                elementToSort[j + 1].getElementsByTagName('A')[0].innerText];
            let before = sortArray[0];
            sortArray.sort()

            if (before !== sortArray[0]) {
                let temp = elementToSort[j].innerHTML;
                elementToSort[j].innerHTML = elementToSort[j + 1].innerHTML;
                elementToSort[j + 1].innerHTML = temp;
            }


        }
    }

}

function addInformation(link) {
    $('.content').css('column-count', '1');
    $.ajax({
        url: link,
        type: 'GET',
        async: true,
        success: function (response) {
            for (let parameter in response) {
                console.log(typeof response[parameter]);
                if (parameter !== 'created' && parameter !== 'edited' && parameter !== 'episode_id' && parameter !== 'url') {
                    if (typeof response[parameter] === "object") {
                        $('.content').append(`<div>${parameter}: </div>`);
                        if (response[parameter] !== null) {
                            response[parameter].forEach(function (arrayPart) {
                                if (arrayPart.substr(0, 4) === 'http') {
                                    let resp = JSON.parse($.ajax({
                                        url: arrayPart,
                                        async: false,
                                        type: 'GET',

                                    }).responseText);
                                    let name;
                                    for (let prop in resp) {
                                        name = resp[prop];
                                        break;
                                    }
                                    $('.content div').last().append(`<a href="#" link="${arrayPart.replace('http:', 'https:')}">${name}</a>; `);
                                } else {
                                    $('.content div').last().append(`${arrayPart}; `);
                                }
                            });
                        }

                    } else {
                        if (response[parameter].substr(0, 4) === 'http') {
                            let resp = JSON.parse($.ajax({
                                url: response[parameter],
                                async: false,
                                type: 'GET',

                            }).responseText);
                            let name;
                            for (let prop in resp) {
                                name = resp[prop];
                                break;
                            }

                            $('.content').append(`<div>${parameter}: <a href="#" link="${response[parameter].replace('http:', 'https:')}">${name}</a></div>`);
                        } else {
                            $('.content').append(`<div>${parameter}: ${response[parameter]}</div>`);
                        }
                    }
                }
            }
            ckickLink();
            document.getElementsByClassName('spinner')[0].style.display = 'none';
        }
    });
}


$(function () {
    $('.content').html('');

    addLinks('https://swapi.dev/api/people/', 'name');
        document.getElementsByClassName('spinner')[0].style.display = 'block';
    $('.nav a').click(function () {
        $('.nav a').removeClass('active');
        $(this).addClass('active');
        $('.content').html('');
        $('.content').css('column-count', '3');
        addLinks($(this).attr('link'), $(this).attr('option'));
        document.getElementsByClassName('spinner')[0].style.display = 'block';
    });

});