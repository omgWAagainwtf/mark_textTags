const selectedTagClz = "btn-info";
const unselectedTagClz = "btn-light";
let tagIdCounter = 0;
let currTag = null;
let tagsMap = new Map();

// pages function
function btn_search(tag, num) {
    var url = "http://localhost:5000/search";
    var data = {
        data: JSON.stringify({
            'tag': tag,
            'num': num
        }),
    }
    let $ajxa_data;
    $.ajax({
        method: "POST",
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        },
        url: url,
        data: data,
        dataType: "json",
        async: false,
        success: function (data) {
            console.log(data);
            $ajxa_data = data;
        },
        error: function () {
            alert("btn_search error ajax");
            console.log("---");
            console.log("btn_search error ajax");
            console.log("---");
        },
    })
    var length = $ajxa_data['text_id'].length;
    for (let $cnt = 0; $cnt < length; $cnt++) {
        let $category = $ajxa_data['category'][$cnt];
        let $tag = $ajxa_data['tag'][$cnt];
        let $id = $ajxa_data['text_id'][$cnt];
        let $text = $ajxa_data['text'][$cnt];
        let $textbar = `
        <div class="row-show" id="${$id}">
        <h3>${$category}</h3>
        <span class="badge badge-info">${$tag}</span>
        <p>${$text}</p>
        </div>`;
        
        $(".row-search").append($textbar);
    }
    //row-show
    $(".row-show").on('click', function (event) {
        console.log("row-show")
        var now_row_show_id = $(this).attr('id');
        $(".row-show").not(this).removeClass('selected');
        $(this).toggleClass('selected');
        if (!$(".btn-delete")[0]) {
            $("#row-btn").append(`<button type="submit" class="btn btn-primary btn-delete"> Delete </button>`);
        }
        if ($(".row-show").hasClass("selected") == false) {
            $(".btn-delete").attr('hidden', true);
        } else {
            $(".btn-delete").attr('hidden', false);
        }
        console.log("before");
        // btn-delete
        $(".btn-delete").off('click').on('click', function () {
            console.log("btn-delete")
            console.log(now_row_show_id);
            if (confirm("Delete?")) {
                console.log("press delete");
                var data = {
                    data: JSON.stringify({
                        'text_id': now_row_show_id,
                    }),
                }
                var url_delete = "http://localhost:5000/delete";
                $.ajax({
                    method: "POST",
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                    },
                    url: url_delete,
                    data: data,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        console.log(data);
                        if (data==false){
                            alert("Failed，Primary Key more than one")
                        }
                    },
                    error: function () {
                        alert("btn-delete error ajax");
                        console.log("---");
                        console.log("btn-delete error ajax");
                        console.log("---");
                    },
                })
                $('.selected').remove();
            } else {
                return false;
            }
        });
    });

    return $ajxa_data;
}

$(function () {
    ctxTransition();
    let $inputTag = $(".input-tag");
    let $tags = $(".tags");
    let $btnSubmit = $(".btn-submit");

    /* bind key insert event */
    $inputTag.on("keyup", function (e) {
        if (e.keyCode === 13) _addKey();
    });

    var url = "http://localhost:5000/init";
    $.ajax({
        method: "GET",
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        },
        url: url,
        dataType: "json",
        async: false,
        success: function (data) {
            console.log(data);
            data.forEach(element => {
                $(".btn-tag").append(_addKey(element));
            });
        },
        error: function () {
            alert("init error ajax");
            console.log("---");
            console.log("init error ajax");
            console.log("---");
        },
    })
    $(".btn-tag").append(_addKey("3C"));
    $(".btn-tag").append(_addKey("政治"));
    $(".btn-tag").append(_addKey("體育"));
    /* bind submit event */
    $btnSubmit.click(function () {
        //新的文章
        var url = "http://localhost:5000/get_document";
        $.ajax({
            method: "GET",
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            },
            url: url,
            dataType: "json",
            async: false,
            success: function (data) {
                console.log(data);
            },
            error: function () {
                alert("get_document error ajax");
                console.log("---");
                console.log("get_document error ajax");
                console.log("---");
            },
        })

        var timer;
        $('.btn-submit').addClass('btn-success');
        $('.btn-success').html('Success');
        // $(".btn-success").attr("disabled", true);
        clearTimeout(timer);
        timer = setTimeout(function () {
            $('.btn-submit').removeClass('btn-success');
            $('.btn-submit').html('Submit');
            // $(".btn-submit").attr("disabled", false);
        }, 750);

    });

    function _addKey(key) {


        /* already exist */
        if (!key || tagsMap.has(key)) return;

        let $tag = $(`<button id="${tagIdCounter++}" class="btn ${unselectedTagClz} tag">
      <span class="tag-key">${key}</span>
    </button>`);
        $tags.append($tag);
        tagsMap.set(key, $tag);
        initTag($tag, key);
    }
});
function initTag($tag, key) {
    $tag.click(function () {
        let oldTag = currTag;
        unselectCurrTag();
        if (oldTag !== $tag) selectTag($tag);
    });

}

function selectTag($tag) {
    if (currTag && currTag === $tag) return;
    currTag = $tag;
    $tag.removeClass(unselectedTagClz);
    $tag.addClass(selectedTagClz);
}

function unselectCurrTag() {
    if (currTag) {
        currTag.removeClass(selectedTagClz);
        currTag.addClass(unselectedTagClz);
        currTag = null;
    }
}

function getKeyWithTag($tag) {
    return $tag.find(".tag-key").text();
}

function currKey() {
    return currTag ? getKeyWithTag(currTag) : null;
}

function ctxTransition() {
    let $container = $(".container");
    if ($container.length === 0) return;

}
$(".btn-search").on('click', function () {
    console.log('btn-search');
    var id_num = 0;
    let $tag = currKey();
    let $text = $(".text").val();
    if ($tag == null) {
        alert("Select one key to search");
        return;
    }

    $(".row-search").empty();
    //append row-search
    let $search_data = btn_search(tag=$tag, num=1);

    $('.pages').bootpag({
        total: $search_data['pages'],
        page: 1,
        maxVisible: 10,
    }).on('page', function (event, num) {
        $("#content").html("Page " + num); // or some ajax content loading...
        console.log("---")
        console.log("pages click, num=", num);
        $(".row-search").empty();
        btn_search(tag=$tag, num=num);
        console.log("---")

    });
    

});
$(".text").on("mouseup", function (e) {
    var selected = getSelections();
    var range = selected.getRangeAt(0);
    if (selected.toString().length > 1) {
        text = selected.toString();
        var newNode = document.createElement("div");
        newNode.setAttribute("class", "highlight-border");
        newNode.setAttribute("id", text);
        range.surroundContents(newNode);
        console.log(text);
        var newStateVal = text;
        // Set the value, creating a new option if necessary
        $(".select2").select2({
            tags: true
        });
        if ($(".select2").find("option[value='" + newStateVal + "']").length) {
            $(".select2").val(newStateVal).trigger("change");
        } else {
            // Create the DOM option that is pre-selected by default
            var newState = new Option(newStateVal, newStateVal, true, true);
            // Append it to the select
            $(".select2").append(newState).trigger('change');
        }
    }
    selected.removeAllRanges();
});
$('.select2').on("select2:unselect", function (e) {
    var text = e.params.data.text;
    $(`#${text}`).contents().unwrap();

});
$('.select2').on('select2:opening select2:close', function (e) {
    $('body').toggleClass('kill-all-select2-dropdowns', e.type == 'select2:opening');
});
function getSelections() {
    var seltxt = '';
    if (window.getSelection) {
        seltxt = window.getSelection();
    } else if (document.getSelection) {
        seltxt = document.getSelection();
    } else if (document.selection) {
        seltxt = document.selection.createRange().text;
    }
    else return;
    return seltxt;
}

// tags
function tags_search(tag, num) {
    var url = "http://localhost:5000/tags_search";
    var data = {
        data: JSON.stringify({
            'tag': tag,
            'num': num
        }),
    }
    let $ajxa_data;
    $("#tag_tags").empty();
    $.ajax({
        method: "POST",
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        },
        url: url,
        data: data,
        dataType: "json",
        async: false,
        success: function (data) {
            console.log(data);
            $ajxa_data = data;
            var length = $ajxa_data['tags'].length;

            console.log(length);
            console.log($ajxa_data['tags'][0]);
            for (let $cnt = 0; $cnt < length; $cnt++) {
                let $textbar = `
                    <span class="badge badge-info">${$ajxa_data['tags'][$cnt]}</span>
                `;
                
                $("#tag_tags").append($textbar);
            }

        },
        error: function () {
            alert("tags_search error ajax");
            console.log("---");
            console.log("tags_search error ajax");
            console.log("---");
        },
    })
    return $ajxa_data;
}

$('.btn-tags').on("click", function () {
    let $tag = currKey();
    if ($tag == null) {
        alert("Select one key to search");
        return;
    }

    console.log("---")
    console.log("btn-tags");
    console.log($tag);
    console.log("---")
    var tags_search_data = tags_search(tag=$tag, num=1)

    $('.tags-pages').bootpag({
        total: tags_search_data['pages'],
        page: 1,
        maxVisible: 5,
    }).on('page', function (event, num) {
        $("#content").html("Page " + num); // or some ajax content loading...
        console.log("---")
        console.log("pages click, num=", num);
        tags_search(tag=$tag, num=num)
        console.log("---")
    });
});