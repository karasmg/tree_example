$( document ).ready(function() {
    var nodes = {};
   $('body').on('click', '.fa', function () {
       var node = $(this).closest('.node');
       node.find('.node').toggle();

       //меняем картинку узла при сворачивании/разворачивании
       if(node.children('.node').length > 0){
            if(node.children('.dropdown').children('.fa').hasClass('fa-rotate-270')){
                node.children('.dropdown').children('.fa').attr('class', 'fa fa-shield');
            } else{
                node.children('.dropdown').children('.fa').attr('class', 'fa fa-shield fa-rotate-270');
            }
       }

   });

   $('body').on('click', '.node_add', function () {
      var parent_node = $(this).closest('.node');
      add_node(parent_node);
      del_menu($(this).closest('.dropdown-menu'));
   });

    $('body').on('click', '.node_del', function () {
        var parent_node = $(this).closest('.node').parent().closest('.node');
        $(this).closest('.node').remove();
        if(parent_node.children('.node').length == 0){
            parent_node.children('.dropdown').children('.fa').attr('class', 'fa fa-fw fa-plus-square');
        }
    });

    $('body').on('contextmenu', '.dropdown-toggle', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if($('.dropdown-menu').length>0)
            return false;
  //      console.dir($(this));
        add_menu($(this).closest('.node'));
    });

    $('body').on('dblclick', '.dropdown-toggle', function (event) {
        edit_node($(this).closest('.dropdown'));
    });

    var del_menu = function(menu){
        menu.menu('destroy');
        menu.remove();
    }


    var add_menu = function(el){
        var context_menu = '<ul class="dropdown-menu">' +
            '<li><a href="#" class="node_add">Добавить</a></li>';
        if(el.attr('id') != 0) {
            context_menu += '<li><a href="#" class="node_del">Удалить</a></li>' +
                            '<li><a href="#" class="node_move">Переместить</a></li>';
        }
        context_menu += '</ul>';

        var menu = $(context_menu).appendTo(el.children('.dropdown'));
        menu.menu();
    }



    var add_node = function (parent_node){
        //формируем шаблон
        var node = '<div class="node">' +
                      '<div class="dropdown">' +
                        '<i class="fa fa-plus-square"></i>' +
                        '<span class="dropdown-toggle">Узел</span>' +
                      '</div>' +
                    '</div>';
        //получаем ссылку на вновь созданный узел
        var this_node = $(node).appendTo(parent_node);
        parent_node.children('.dropdown').children('.fa').attr('class', 'fa fa-shield fa-rotate-270');

        //Формируем id узла
        var node_id = parent_node.attr('id')+'_'+(parent_node.children('.node').length);
        this_node.attr('id', node_id);

        //Добавляем функционал drag-and-drop
        this_node.draggable({
            cursor: 'move',
            snap: '.dropdown-toggle',
            revert: 'invalid',
            refreshPositions: true,
        });

        this_node.children('.dropdown').droppable( {
            drop: function ( event, ui ) {
                var draggable = ui.draggable;
                draggable.appendTo($(this).parent());
                draggable.css({ 'left' : '', 'top' : '' });
                $(this).css("color", "black");
                //alert( ' ID: "' + draggable.attr('id') + '" был доставлен к месту назначения!'+ $(this).parent().attr('id') );
            },
            accept: '.node',
            over: function ( event, ui ) {
                $(this).css("color", "red");
            },
            out: function ( event, ui ) {
                $(this).css("color", "black");
            }
        });
//        console.log(this_node.attr('id'));
    }


});

    var edit_node = function(this_node){
    //this_node.find('.dropdown-toggle').dropdown('toggle');
    if( $('.dropdown-toggle_input').length !== 0 ) {
        return false;
    }
    var input_name = this_node.find('.dropdown-toggle').html();
    this_node.find('.dropdown-toggle').html('<input class = "dropdown-toggle_input" type="text" value="'+input_name+'">');
    var input = this_node.find('.dropdown-toggle_input');
    input.on('change', function(e){
            if (input.val() != '') {
                this_node.find('.dropdown-toggle').html(input.val());
            } else {
                alert('Имя узла не может быть пустым');
                this_node.find('.dropdown-toggle').html(input_name);
            }
    //        this_node.find('.dropdown-toggle').dropdown();
    });
}